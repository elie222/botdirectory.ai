// Home-page interactivity over one statically rendered directory. Card mode
// restyles the same links instead of shipping a duplicate tree for every bot.
import { loadCopyCounts, refreshCopyLabels } from './copies';
import type { Bot } from '../lib/data';
import { promptExcerpt } from '../lib/text';

interface BrowseState {
  category: string;
  integration: string;
  query: string;
  sort: 'copies' | 'newest' | 'name';
  view: 'table' | 'cards';
}

type BotFeedItem = Pick<Bot, 'slug' | 'name' | 'category' | 'integrations' | 'prompt'> & {
  contributor: string | null;
};

const searchIndex = new Map<string, string>();
let detailsPromise: Promise<void> | undefined;
let detailsReady = false;
let detailsRefreshQueued = false;

function loadBotDetails(): Promise<void> {
  detailsPromise ??= fetch('/api/bots.json', { headers: { Accept: 'application/json' } })
    .then(async (response) => {
      if (!response.ok) throw new Error(`bot feed returned ${response.status}`);
      const payload = (await response.json()) as { bots?: BotFeedItem[] };
      for (const bot of payload.bots ?? []) {
        searchIndex.set(
          bot.slug,
          [bot.name, bot.category, ...bot.integrations, bot.contributor, bot.prompt].filter(Boolean).join(' ').toLowerCase(),
        );
        const summary = document.querySelector<HTMLElement>(`[data-prompt-slug="${CSS.escape(bot.slug)}"]`);
        if (summary) summary.textContent = promptExcerpt(bot.prompt);
      }
    })
    .catch(() => {
      // The server-rendered name, category, tool, and contributor search still works.
    })
    .finally(() => {
      detailsReady = true;
    });
  return detailsPromise;
}

function init(): void {
  const search = document.getElementById('bot-search') as HTMLInputElement | null;
  // The selects are <Select /> components: a hidden input that fires `change`.
  const category = document.getElementById('bot-category') as HTMLInputElement | null;
  const integration = document.getElementById('bot-integration') as HTMLInputElement | null;
  const sort = document.getElementById('bot-sort') as HTMLInputElement | null;
  const btnTable = document.getElementById('view-table-btn');
  const btnCards = document.getElementById('view-cards-btn');
  const directoryView = document.getElementById('directory-view');
  const empty = document.getElementById('empty-state');
  // `sort` is optional: the select is hidden pre-launch while copy counts are hidden.
  if (!search || !category || !integration || !btnTable || !btnCards || !directoryView || !empty) return;
  const directory = directoryView;
  const emptyState = empty;

  const state: BrowseState = {
    category: new URLSearchParams(location.search).get('category') || 'All',
    integration: 'all',
    query: '',
    sort: sort?.value === 'copies' || sort?.value === 'newest' ? sort.value : 'name',
    // The table is useful on wide screens, but on a phone it turns the
    // directory into a horizontal scroller. Start with the purpose-built
    // cards there instead.
    view: window.matchMedia('(max-width: 900px)').matches ? 'cards' : 'table',
  };
  // Bot pages deep-link here with ?category=…; reflect it in the select.
  category.dispatchEvent(new CustomEvent('select:set', { detail: state.category }));

  /** Keep ?category= shareable without adding history entries. */
  function syncUrl(): void {
    const url = new URL(location.href);
    if (state.category === 'All') url.searchParams.delete('category');
    else url.searchParams.set('category', state.category);
    history.replaceState(null, '', url);
  }

  const effectiveCopies = (row: HTMLElement): number => Number(row.dataset.copies || '0');

  const matches = (row: HTMLElement, q: string): boolean =>
    (state.category === 'All' || row.dataset.category === state.category) &&
    (state.integration === 'all' || (row.dataset.integrations || '').split('|').includes(state.integration)) &&
    (!q || (searchIndex.get(row.dataset.slug || '') || row.dataset.search || '').includes(q));

  function applyDirectory(): void {
    const rows = Array.from(directory.querySelectorAll<HTMLElement>('[data-slug], [data-promo]'));
    const botRows = rows.filter((r) => !r.hasAttribute('data-promo'));
    const promoRows = rows.filter((r) => r.hasAttribute('data-promo'));
    const q = state.query.trim().toLowerCase();

    const visible = botRows.filter((r) => matches(r, q));
    visible.sort((a, b) => {
      if (state.sort === 'name') return (a.dataset.name || '').localeCompare(b.dataset.name || '');
      if (state.sort === 'newest') {
        const byDate = (b.dataset.addedAt || '').localeCompare(a.dataset.addedAt || '');
        return byDate || (a.dataset.name || '').localeCompare(b.dataset.name || '');
      }
      return effectiveCopies(b) - effectiveCopies(a) ||
        (a.dataset.name || '').localeCompare(b.dataset.name || '');
    });

    // Promoted rows keep their fixed positions in the visible list.
    const ordered = [...visible];
    for (const p of promoRows) {
      ordered.splice(Math.min(Number(p.dataset.at || '0'), ordered.length), 0, p);
    }
    const hiddenRows = botRows.filter((r) => !visible.includes(r));

    for (const r of ordered) r.hidden = false;
    for (const r of hiddenRows) r.hidden = true;
    // Reorder in place (the table header stays first: only rows move).
    for (const r of [...ordered, ...hiddenRows]) directory.appendChild(r);
  }

  function apply(): void {
    applyDirectory();
    const anyVisible = directory.querySelectorAll('[data-slug]:not([hidden])').length > 0;
    emptyState.hidden = anyVisible;
  }

  function syncView(): void {
    directory.dataset.view = state.view;
    btnTable!.classList.toggle('active', state.view === 'table');
    btnCards!.classList.toggle('active', state.view === 'cards');
    if (state.view === 'cards') void loadBotDetails();
  }

  search.addEventListener('input', () => {
    state.query = search.value;
    apply();
    if (state.query.trim() && !detailsReady && !detailsRefreshQueued) {
      detailsRefreshQueued = true;
      void loadBotDetails().then(() => {
        detailsRefreshQueued = false;
        if (state.query.trim()) apply();
      });
    }
  });
  category.addEventListener('change', () => {
    state.category = category.value || 'All';
    syncUrl();
    apply();
  });
  integration.addEventListener('change', () => {
    state.integration = integration.value;
    apply();
  });
  sort?.addEventListener('change', () => {
    state.sort = sort.value === 'name' || sort.value === 'newest' ? sort.value : 'copies';
    apply();
  });
  btnTable.addEventListener('click', () => {
    state.view = 'table';
    syncView();
  });
  btnCards.addEventListener('click', () => {
    state.view = 'cards';
    syncView();
  });

  refreshCopyLabels();
  apply();
  syncView();
  void loadCopyCounts().then(apply);
}

init();
