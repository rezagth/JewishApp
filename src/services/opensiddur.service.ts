import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OpenSiddurResult {
  heText?: string;
  enText?: string;
  sourceUrl: string;
}

const CACHE_PREFIX = 'opensiddur:';

const extractHebrewFromText = (text: string): string | null => {
  if (!text) return null;
  // Match long Hebrew blocks (Hebrew Unicode range)
  const matches = text.match(/[\u0590-\u05FF\s\-\.,:\"'()]{80,}/g);
  if (!matches) return null;
  // Return the longest match (likely the prayer body)
  return matches.sort((a, b) => b.length - a.length)[0].trim();
};

const stripHtml = (html: string) => html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ');

const extractHebrewFromHtml = (html: string) => extractHebrewFromText(stripHtml(html));

const extractEnglishFromHtml = (html: string) => {
  if (!html) return null;
  const text = stripHtml(html);
  // Very simple heuristic: paragraphs containing latin letters
  const matches = text.match(/[A-Za-z0-9\,\.;:\-\'\"\s]{80,}/g);
  if (!matches) return null;
  return matches.sort((a, b) => b.length - a.length)[0].trim();
};

const tryArchiveText = async (id: string) => {
  const candidates = [
    `https://archive.org/download/${id}.txt`,
    `https://archive.org/download/${id}_djvu.txt`,
    `https://archive.org/download/${id}_ocr.txt`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const txt = await res.text();
      if (txt && txt.length > 100) return txt;
    } catch (e) {
      // ignore and try next
    }
  }

  return null;
};

export const fetchOpenSiddurText = async (url: string): Promise<OpenSiddurResult | null> => {
  const cacheKey = CACHE_PREFIX + url;
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as OpenSiddurResult;
  } catch (e) {
    // continue
  }

  try {
    let heText: string | undefined;
    let enText: string | undefined;

    if (url.includes('archive.org')) {
      const m = url.match(/\/details\/([^\/?#]+)/i);
      if (m) {
        const id = m[1];
        const txt = await tryArchiveText(id);
        if (txt) {
          const heb = extractHebrewFromText(txt);
          if (heb) heText = heb;
        }
      }
    }

    if (!heText) {
      const res = await fetch(url);
      if (!res.ok) return null;
      const html = await res.text();
      const heb = extractHebrewFromHtml(html);
      const eng = extractEnglishFromHtml(html);
      if (heb) heText = heb;
      if (eng) enText = eng;
    }

    const result: OpenSiddurResult = { heText, enText, sourceUrl: url };

    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (e) {
      // ignore cache write errors
    }

    return result;
  } catch (err) {
    console.warn('fetchOpenSiddurText error', err);
    return null;
  }
};

export default {
  fetchOpenSiddurText,
};

export const findAndFetchByTitle = async (title: string, alt?: string): Promise<OpenSiddurResult | null> => {
  if (!title && !alt) return null;
  const q = encodeURIComponent(title || alt || '');
  const searchUrls = [
    `https://opensiddur.org/?s=${q}`,
    `https://opensiddur.org/?s=${encodeURIComponent(alt || title)}`,
  ];

  for (const searchUrl of searchUrls) {
    try {
      const res = await fetch(searchUrl);
      if (!res.ok) continue;
      const html = await res.text();

      // Find first prayer link pattern
      const m = html.match(/href="([^"]+\/(?:prayers|texts|liturgies)\/[^"]+)"/i);
      if (m && m[1]) {
        const link = m[1].startsWith('http') ? m[1] : `https://opensiddur.org${m[1]}`;
        const fetched = await fetchOpenSiddurText(link);
        if (fetched) return fetched;
      }

      // Fallback: look for archive.org links
      const m2 = html.match(/href="([^"]*archive\.org\/details\/[^"]+)"/i);
      if (m2 && m2[1]) {
        const link = m2[1].startsWith('http') ? m2[1] : `https://opensiddur.org${m2[1]}`;
        const fetched = await fetchOpenSiddurText(link);
        if (fetched) return fetched;
      }
    } catch (e) {
      // ignore and try next
    }
  }

  return null;
};
