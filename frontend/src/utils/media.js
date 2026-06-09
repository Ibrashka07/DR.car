const BASE = 'http://127.0.0.1:8000';

export function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE}${path}`;
}