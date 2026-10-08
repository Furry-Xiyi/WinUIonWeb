export const recentlyVisitedStorageKey = 'winui-recently-visited';
export const recentlyVisitedChangedEvent = 'winui-recently-visited-changed';
const maxRecentlyVisitedSamples = 7;

export const getRecentlyVisited = (): string[] => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(recentlyVisitedStorageKey) ?? '[]');
    return Array.isArray(stored) ? [...new Set(stored.filter((id): id is string => typeof id === 'string'))].slice(0, maxRecentlyVisitedSamples) : [];
  } catch {
    return [];
  }
};

export const recordRecentlyVisited = (id: string) => {
  const recent = [id, ...getRecentlyVisited().filter(item => item !== id)].slice(0, maxRecentlyVisitedSamples);
  try {
    localStorage.setItem(recentlyVisitedStorageKey, JSON.stringify(recent));
  } catch {
    return;
  }
  window.dispatchEvent(new CustomEvent(recentlyVisitedChangedEvent, { detail: recent }));
};

export const pruneRecentlyVisited = (validIds: ReadonlySet<string>) => {
  const current = getRecentlyVisited();
  const valid = current.filter(id => validIds.has(id));
  if (valid.length === current.length) return valid;
  try {
    localStorage.setItem(recentlyVisitedStorageKey, JSON.stringify(valid));
  } catch {
    return valid;
  }
  window.dispatchEvent(new CustomEvent(recentlyVisitedChangedEvent, { detail: valid }));
  return valid;
};
