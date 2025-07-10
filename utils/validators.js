// Link geçerliliğini kontrol eder
export function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// https:// yoksa otomatik ekler
export function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
}

// Favicon URL’si üretir
export function getFaviconUrl(url) {
  try {
    const domain = new URL(normalizeUrl(url)).origin;
    return `${domain}/favicon.ico`;
  } catch {
    return "";
  }
}
