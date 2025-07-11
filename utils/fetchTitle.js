export async function fetchPageTitle(url) {
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    const match = data.contents.match(/<title>(.*?)<\/title>/i);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}
