type GtagFunction = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: GtagFunction }).gtag === 'function') {
    (window as unknown as { gtag: GtagFunction }).gtag(...args);
  }
}

export function trackTabView(tabId: number, tabTitle: string, artist: string) {
  gtag('event', 'tab_view', {
    tab_id: tabId,
    tab_title: tabTitle,
    artist,
  });
}

export function trackSearch(query: string, resultCount: number) {
  gtag('event', 'search', {
    search_term: query,
    result_count: resultCount,
  });
}

export function trackTabCreate(difficulty?: string) {
  gtag('event', 'tab_create', {
    difficulty,
  });
}

export function trackLogin() {
  gtag('event', 'login');
}

export function trackRegister() {
  gtag('event', 'sign_up');
}

export function trackFavoriteAdd(tabId: number) {
  gtag('event', 'favorite_add', {
    tab_id: tabId,
  });
}
