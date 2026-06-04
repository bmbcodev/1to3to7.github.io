const SITE_PASSWORD = "#Fils*#12@@";
const HARDCODED_HASH = "e138554f419cb4ea627a7a66355ae4d45a93ffdaf6b4881c892fe8937a33aaa0";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = await hashPassword(password);
  const storedHash = process.env.NEXT_PUBLIC_SITE_PASSWORD_HASH || HARDCODED_HASH;
  return hash === storedHash;
}

function setAuthCookie(token: string): void {
  document.cookie = `bia_co_session=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;
}

function clearAuthCookie(): void {
  document.cookie = "bia_co_session=; path=/; max-age=0";
}

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bia_co_session");
}

export function setSessionToken(token: string): void {
  localStorage.setItem("bia_co_session", token);
  setAuthCookie(token);
}

export function clearSessionToken(): void {
  localStorage.removeItem("bia_co_session");
  clearAuthCookie();
}

export async function login(password: string): Promise<boolean> {
  const isValid = await verifyPassword(password);
  if (isValid) {
    const token = await hashPassword(password + Date.now().toString());
    setSessionToken(token);
    return true;
  }
  return false;
}

export function logout(): void {
  clearSessionToken();
}

export function isAuthenticated(): boolean {
  return getSessionToken() !== null;
}
