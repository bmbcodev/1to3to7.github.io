export function generateFingerprint(): string {
  if (typeof window === "undefined") return "server";

  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ];

  const raw = components.join("|||");
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "fp_" + Math.abs(hash).toString(36) + "_" + Date.now().toString(36);
}

export function getOrCreateFingerprint(): string {
  if (typeof window === "undefined") return "server";
  const key = "bia_co_fingerprint";
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = generateFingerprint();
    localStorage.setItem(key, fp);
  }
  return fp;
}
