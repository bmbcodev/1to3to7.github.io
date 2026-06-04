import { supabase } from "./supabase";

let _useLocal: boolean | null = null;

export function isLocalMode(): boolean {
  if (_useLocal !== null) return _useLocal;
  if (typeof window === "undefined") return false;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  _useLocal = key.includes("placeholder") || key.length < 10;
  return _useLocal;
}

function prefix(key: string): string {
  return `bia_co:${key}`;
}

export function localGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(prefix(key));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function localSet<T>(key: string, value: T): void {
  try { localStorage.setItem(prefix(key), JSON.stringify(value)); } catch {}
}

export function localRemove(key: string): void {
  try { localStorage.removeItem(prefix(key)); } catch {}
}

export function localList<T>(table: string): T[] {
  return localGet<T[]>(table) || [];
}

export function localInsert<T extends Record<string, unknown>>(table: string, item: T): T & { id: string; created_at: string } {
  const items = localList<any>(table);
  const entry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8), ...item, created_at: new Date().toISOString() };
  items.push(entry);
  localSet(table, items);
  return entry;
}

export function localDelete<T extends { id?: string }>(table: string, id: string): void {
  const items = localList<any>(table).filter((i: any) => i.id !== id);
  localSet(table, items);
}

export function localCount(table: string): number {
  return localList(table).length;
}

export function localFollowToggle(fingerprint: string): { isFollowing: boolean } {
  const followers = localList<{ fingerprint: string; id: string }>("followers");
  const existing = followers.find((f: any) => f.fingerprint === fingerprint);
  if (existing) {
    localSet("followers", followers.filter((f: any) => f.fingerprint !== fingerprint));
    return { isFollowing: false };
  }
  localInsert("followers", { fingerprint });
  return { isFollowing: true };
}

export function localIsFollowing(fingerprint: string): boolean {
  return localList<any>("followers").some((f: any) => f.fingerprint === fingerprint);
}

export async function safeUpload(
  bucket: string,
  path: string,
  file: File | Blob
): Promise<{ publicUrl: string; storagePath: string }> {
  if (!isLocalMode()) {
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);
    if (uploadError && !uploadError.message?.includes("bucket") && !uploadError.message?.includes("Failed to fetch")) throw uploadError;
  }

  const reader = new FileReader();
  const b64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  localSet(`file:${path}`, { b64, name: file instanceof File ? file.name : path, type: file.type, size: file.size });
  return { publicUrl: b64, storagePath: path };
}

export async function safeRemoveFile(bucket: string, paths: string[]): Promise<void> {
  if (!isLocalMode()) {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (!error) return;
  }
  paths.forEach((p) => localRemove(`file:${p}`));
}
