const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "";
const INDEXNOW_HOST =
  process.env.INDEXNOW_HOST ||
  (process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname
    : "");
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/**
 * Submit one or more URLs to IndexNow (Bing, Yandex, Seznam real-time indexing).
 * Call this whenever a new article or project is published or updated.
 *
 * @param {string|string[]} urls - Absolute URL(s) to submit
 * @returns {Promise<boolean>} true on success
 */
export async function submitToIndexNow(urls) {
  if (!INDEXNOW_KEY || !INDEXNOW_HOST) return false;
  const list = Array.isArray(urls) ? urls : [urls];
  if (!list.length) return false;

  try {
    const body = {
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: list,
    };

    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    // 200 or 202 means accepted
    return res.status === 200 || res.status === 202;
  } catch {
    return false;
  }
}
