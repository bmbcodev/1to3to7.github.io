const TABLES_KEY = "localDb:tables";
const BLOBS_KEY = "localDb:blobs";
const STORAGE_KEY = "localDb:storage";

type Row = Record<string, unknown> & { id: string };

function getTable(table: string): Row[] {
  try {
    const raw = localStorage.getItem(`${TABLES_KEY}:${table}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTable(table: string, rows: Row[]): void {
  localStorage.setItem(`${TABLES_KEY}:${table}`, JSON.stringify(rows));
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const localDb = {
  from: (table: string) => ({
    select: (columns = "*") => ({
      data: getTable(table),
      error: null,
      async: {
        then: (resolve: (v: { data: Row[] | null; error: null }) => void) =>
          resolve({ data: getTable(table), error: null }),
      },
      order: (_col: string, _opts?: { ascending?: boolean }) => ({
        data: getTable(table).sort((a, b) =>
          String(a.created_at || "") > String(b.created_at || "") ? -1 : 1
        ),
        error: null,
      }),
      limit: (_n: number) => ({
        data: getTable(table).slice(0, _n),
        error: null,
      }),
      eq: (col: string, val: unknown) => {
        const rows = getTable(table).filter((r) => r[col] === val);
        return {
          data: rows,
          error: null,
          single: () => ({ data: rows[0] || null, error: rows.length ? null : { code: "PGRST116" } }),
        };
      },
      single: () => {
        const rows = getTable(table);
        return { data: rows[0] || null, error: rows.length ? null : { code: "PGRST116" } };
      },
      count: getTable(table).length,
      then: (resolve: (v: { data: Row[] | null; error: null; count: number }) => void) =>
        resolve({ data: getTable(table), error: null, count: getTable(table).length }),
    }),
    insert: (row: Record<string, unknown>) => {
      const rows = getTable(table);
      const newRow = { id: uid(), ...row, created_at: new Date().toISOString() } as Row;
      rows.push(newRow);
      saveTable(table, rows);
      const error =
        table === "followers" && row.fingerprint
          ? rows.filter((r) => r.fingerprint === row.fingerprint).length > 1
            ? { code: "23505", message: "Already following", details: "", hint: "" }
            : null
          : null;
      return { data: [newRow], error, single: () => ({ data: newRow, error: null }) };
    },
    update: (updates: Record<string, unknown>) => ({
      eq: (col: string, val: unknown) => {
        const rows = getTable(table);
        const idx = rows.findIndex((r) => r[col] === val);
        if (idx !== -1) {
          rows[idx] = { ...rows[idx], ...updates, updated_at: new Date().toISOString() };
          saveTable(table, rows);
        }
        return { data: idx !== -1 ? rows[idx] : null, error: null };
      },
    }),
    delete: () => ({
      eq: (col: string, val: unknown) => {
        const rows = getTable(table).filter((r) => r[col] !== val);
        saveTable(table, rows);
        return { error: null };
      },
    }),
    upsert: (row: Record<string, unknown>) => {
      const rows = getTable(table);
      rows.push({ id: uid(), ...row, created_at: new Date().toISOString() } as Row);
      saveTable(table, rows);
      return { data: rows, error: null };
    },
  }),

  storage: {
    from: (_bucket: string) => ({
      upload: async (path: string, file: File | Blob) => {
        const key = `${STORAGE_KEY}:${path}`;
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const binary = Array.from(bytes).map((b) => String.fromCharCode(b)).join("");
        const b64 = btoa(binary);
        const meta = { path, name: path.split("/").pop(), type: file.type, size: file.size, b64 };
        localStorage.setItem(key, JSON.stringify(meta));
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => ({
        publicUrl: `localblob://${path}`,
        data: { publicUrl: `localblob://${path}` },
      }),
      remove: async (paths: string[]) => {
        paths.forEach((p) => localStorage.removeItem(`${STORAGE_KEY}:${p}`));
        return { data: null, error: null };
      },
      listBuckets: async () => ({ data: [{ name: "uploads" }], error: null }),
    }),
  },
};

export function getLocalImageUrl(path: string): string | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${path}`);
    if (!raw) return null;
    const meta = JSON.parse(raw);
    const binary = atob(meta.b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: meta.type || "application/octet-stream" });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}
