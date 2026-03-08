/* ============================================================
   FluxusTV — app.js
   Netflix UI + FluxusTV Embed Player
   Hash-based SPA: Home → Player → Browse → Search
   ============================================================ */

// ============================================================
// CONFIG
// ============================================================
const TMDB_KEY  = '3d421899d5ce93db8ad4ae4591ccc130';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_W300  = 'https://image.tmdb.org/t/p/w300';
const IMG_W500  = 'https://image.tmdb.org/t/p/w500';
const IMG_W780  = 'https://image.tmdb.org/t/p/w780';
const IMG_ORIG  = 'https://image.tmdb.org/t/p/original';
const IMG_STILL = 'https://image.tmdb.org/t/p/w400';

// ============================================================
// EMBED SOURCES (from FluxusTV)
// ============================================================
const SOURCES = {
  alpha:    { movie: id      => `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=false`,
              tv:   (id,s,e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}?autoPlay=false` },
  bravo:    { movie: id      => `https://vidsrc.cc/v3/embed/movie/${id}?autoPlay=false`,
              tv:   (id,s,e) => `https://vidsrc.cc/v3/embed/tv/${id}/${s}/${e}?autoPlay=false` },
  charlie:  { movie: id      => `https://moviesapi.club/movie/${id}`,
              tv:   (id,s,e) => `https://moviesapi.club/tv/${id}-${s}-${e}` },
  delta:    { movie: id      => `https://moviesapi.to/movie/${id}`,
              tv:   (id,s,e) => `https://moviesapi.to/tv/${id}-${s}-${e}` },
  echo:     { movie: id      => `https://vidsrc-embed.ru/embed/movie/${id}`,
              tv:   (id,s,e) => `https://vidsrc-embed.ru/embed/tv/${id}/${s}-${e}` },
  foxtrot:  { movie: id      => `https://vidsrc-embed.su/embed/movie/${id}`,
              tv:   (id,s,e) => `https://vidsrc-embed.su/embed/tv/${id}/${s}-${e}` },
  golf:     { movie: id      => `https://vidsrcme.su/embed/movie/${id}`,
              tv:   (id,s,e) => `https://vidsrcme.su/embed/tv/${id}/${s}-${e}` },
  hotel:    { movie: id      => `https://vsrc.su/embed/movie/${id}`,
              tv:   (id,s,e) => `https://vsrc.su/embed/tv/${id}/${s}-${e}` },
  india:    { movie: id      => `https://player.videasy.net/movie/${id}?color=E50914`,
              tv:   (id,s,e) => `https://player.videasy.net/tv/${id}/${s}/${e}?nextEpisode=true&episodeSelector=true&color=E50914` },
  juliet:   { movie: id      => `https://player.videasy.net/movie/${id}?overlay=true&color=E50914`,
              tv:   (id,s,e) => `https://player.videasy.net/tv/${id}/${s}/${e}?overlay=true&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&color=E50914` },
  kilo:     { movie: id      => `https://vidfast.pro/movie/${id}?autoPlay=false`,
              tv:   (id,s,e) => `https://vidfast.pro/tv/${id}/${s}/${e}?autoPlay=false&nextButton=true&autoNext=true` },
  lima:     { movie: id      => `https://vidfast.in/movie/${id}?autoPlay=false`,
              tv:   (id,s,e) => `https://vidfast.in/tv/${id}/${s}/${e}?autoPlay=false&nextButton=true&autoNext=true` },
  mike:     { movie: id      => `https://vidfast.io/movie/${id}?autoPlay=false`,
              tv:   (id,s,e) => `https://vidfast.io/tv/${id}/${s}/${e}?autoPlay=false&nextButton=true&autoNext=true` },
  november: { movie: id      => `https://vidfast.me/movie/${id}?autoPlay=false&theme=E50914`,
              tv:   (id,s,e) => `https://vidfast.me/tv/${id}/${s}/${e}?autoPlay=false&nextButton=true&autoNext=true&theme=E50914` },
  oscar:    { movie: id      => `https://vidfast.net/movie/${id}?autoPlay=false`,
              tv:   (id,s,e) => `https://vidfast.net/tv/${id}/${s}/${e}?autoPlay=false&nextButton=true&autoNext=true` },
  papa:     { movie: id      => `https://vidfast.pm/movie/${id}?autoPlay=false`,
              tv:   (id,s,e) => `https://vidfast.pm/tv/${id}/${s}/${e}?autoPlay=false&nextButton=true&autoNext=true` },
  quebec:   { movie: id      => `https://vidfast.xyz/movie/${id}?autoPlay=false`,
              tv:   (id,s,e) => `https://vidfast.xyz/tv/${id}/${s}/${e}?autoPlay=false&nextButton=true&autoNext=true` },
  romeo:    { movie: id      => `https://vidlink.pro/movie/${id}?autoplay=false&title=true&poster=true`,
              tv:   (id,s,e) => `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=false&title=true&poster=true&nextbutton=true` },
  sierra:   { movie: id      => `https://vidlink.pro/movie/${id}?autoplay=false&title=true&poster=true&player=jw`,
              tv:   (id,s,e) => `https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=false&title=true&poster=true&nextbutton=true&player=jw` },
};

// ============================================================
// CAROUSEL DEFINITIONS
// ============================================================
const CAROUSELS = [
  { id: 'trending-day',    title: '🔥 Trending Today',       endpoint: '/trending/all/day',    browseKey: 'trending-today' },
  { id: 'trending-week',   title: '📅 Trending This Week',   endpoint: '/trending/all/week',   browseKey: 'trending-week' },
  { id: 'now-playing',     title: '🎬 Now Playing',           endpoint: '/movie/now_playing',   browseKey: 'now-playing', forceType: 'movie' },
  { id: 'popular-movies',  title: '🍿 Popular Movies',        endpoint: '/movie/popular',       browseKey: 'popular-movies', forceType: 'movie' },
  { id: 'top-movies',      title: '⭐ Top Rated Movies',      endpoint: '/movie/top_rated',     browseKey: 'top-movies', forceType: 'movie' },
  { id: 'popular-tv',      title: '📺 Popular TV Shows',      endpoint: '/tv/popular',          browseKey: 'popular-tv', forceType: 'tv' },
  { id: 'top-tv',          title: '🏆 Top Rated TV',          endpoint: '/tv/top_rated',        browseKey: 'top-tv', forceType: 'tv' },
  { id: 'airing-today',    title: '📡 Airing Today',          endpoint: '/tv/airing_today',     browseKey: 'airing-today', forceType: 'tv' },
  { id: 'upcoming',        title: '🗓️ Coming Soon',           endpoint: '/movie/upcoming',      browseKey: 'upcoming', forceType: 'movie' },
];

const BROWSE_LABELS = {
  'trending-today':  '🔥 Trending Today',
  'trending-week':   '📅 Trending This Week',
  'now-playing':     '🎬 Now Playing',
  'popular-movies':  '🍿 Popular Movies',
  'top-movies':      '⭐ Top Rated Movies',
  'popular-tv':      '📺 Popular TV Shows',
  'top-tv':          '🏆 Top Rated TV',
  'airing-today':    '📡 Airing Today',
  'on-air':          '📻 On Air',
  'upcoming':        '🗓️ Coming Soon',
};

// ============================================================
// STATE
// ============================================================
let activeMediaId   = null;
let activeMediaType = null;
let activeSeason    = 1;
let activeEpisode   = 1;
let activeTitle     = '';
let activeYear      = '';

let searchQuery     = '';
let searchPage      = 1;
let searchTotal     = 1;
let searchResults   = [];

let browsePage      = 1;
let browseTotalPgs  = 1;
let browseCategory  = null;

let heroItems       = [];
let heroIndex       = 0;
let heroInterval    = null;

const mediaCache    = {};
const seasonCache   = {};
const homeLoaded    = { done: false };

// ============================================================
// LOCALSTORAGE HELPERS
// ============================================================
function getSavedSource() {
  let s = localStorage.getItem('ftv_source');
  if (!s || !SOURCES[s]) { s = 'november'; localStorage.setItem('ftv_source', s); }
  return s;
}
function saveSource(v) { localStorage.setItem('ftv_source', v); }
function isUblockDismissed() { return localStorage.getItem('ftv_ublock') === '1'; }
function dismissUblock() { localStorage.setItem('ftv_ublock', '1'); }

// ============================================================
// TMDB API
// ============================================================
async function tmdbFetch(endpoint) {
  const sep = endpoint.includes('?') ? '&' : '?';
  const res  = await fetch(`${TMDB_BASE}${endpoint}${sep}api_key=${TMDB_KEY}`);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}
async function fetchDetail(type, id) {
  const key = `${type}-${id}`;
  if (mediaCache[key]) return mediaCache[key];
  const data = await tmdbFetch(`/${type}/${id}`);
  mediaCache[key] = data;
  return data;
}
async function fetchSeason(tvId, s) {
  const key = `${tvId}-s${s}`;
  if (seasonCache[key]) return seasonCache[key];
  const data = await tmdbFetch(`/tv/${tvId}/season/${s}`);
  seasonCache[key] = data;
  return data;
}

// ============================================================
// UTILS
// ============================================================
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function mediaType(item, forced) {
  if (forced) return forced;
  return item.media_type === 'tv' ? 'tv' : 'movie';
}
function itemTitle(item, type) {
  return type === 'tv' ? (item.name || item.title || '') : (item.title || item.name || '');
}
function itemDate(item, type) {
  return type === 'tv' ? item.first_air_date : item.release_date;
}
function toTarget(type, id) {
  return type === 'tv' ? `#/tv/${id}/1/1` : `#/movie/${id}`;
}
function getServerLetter(name) { return (name || '').charAt(0); }
function getServerFromLetter(l) { return Object.keys(SOURCES).find(k => k.charAt(0) === l) || null; }

let toastTimer;
function showToast(msg, dur = 2500) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), dur);
}

// ============================================================
// DOM REFS
// ============================================================
const $ = id => document.getElementById(id);

// Views
const viewHome   = $('view-home');
const viewSearch = $('view-search');
const viewPlayer = $('view-player');
const viewBrowse = $('view-browse');

// Hero
const heroImg      = $('hero-img');
const heroTitle    = $('hero-title');
const heroBadge    = $('hero-badge');
const heroOverview = $('hero-overview');
const heroMeta     = $('hero-meta');
const heroPlayBtn  = $('hero-play-btn');
const heroInfoBtn  = $('hero-info-btn');

// Player
const playerBackdropImg = $('player-backdrop-img');
const playerTypeBadge   = $('player-type-badge');
const playerYear        = $('player-year');
const playerRating      = $('player-rating');
const playerTitle       = $('player-title');
const playerGenres      = $('player-genres');
const playerOverview    = $('player-overview');
const playerPoster      = $('player-poster');
const playerIframe      = $('player-iframe');
const iframeSpinner     = $('iframe-spinner');
const serverSelect      = $('server-select');
const tvSection         = $('tv-section');
const seasonTabs        = $('season-tabs');
const episodeGrid       = $('episode-grid');
const episodesLoading   = $('episodes-loading');
const uBlockBanner      = $('player-ublock-banner');
const newBanner         = $('player-new-banner');

// Navbar / search
const navbar           = $('navbar');
const navSearchToggle  = $('nav-search-toggle');
const navSearchBar     = $('nav-search-bar');
const navSearchInput   = $('nav-search-input');

// Browse
const browseTitle        = $('browse-title');
const browseGrid         = $('browse-grid');
const browseLoading      = $('browse-loading');
const browseLoadMoreWrap = $('browse-load-more-wrap');
const browseLoadMoreBtn  = $('browse-load-more-btn');

// Search
const searchGrid         = $('search-results-grid');
const searchCount        = $('search-results-count');
const searchLoadMoreWrap = $('search-load-more-wrap');
const searchLoadMoreBtn  = $('search-load-more-btn');
const searchStateLoad    = $('search-state-loading');
const searchStateEmpty   = $('search-state-empty');

// ============================================================
// NAVBAR SCROLL BEHAVIOUR
// ============================================================
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

// ============================================================
// SEARCH BAR
// ============================================================
navSearchToggle.addEventListener('click', () => {
  navSearchBar.classList.toggle('open');
  if (navSearchBar.classList.contains('open')) navSearchInput.focus();
});

navSearchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const q = navSearchInput.value.trim();
    if (!q) return;
    searchQuery  = q;
    searchPage   = 1;
    searchResults = [];
    window.location.hash = `#/search?q=${encodeURIComponent(q)}`;
    navSearchBar.classList.remove('open');
  }
  if (e.key === 'Escape') navSearchBar.classList.remove('open');
});

// ============================================================
// ROUTER
// ============================================================
function parseHash() {
  const raw = window.location.hash || '#/';
  const stripped = raw.startsWith('#/') ? raw.slice(2) : raw.slice(1);
  const qIdx     = stripped.indexOf('?');
  const path     = qIdx >= 0 ? stripped.slice(0, qIdx) : stripped;
  const qs       = qIdx >= 0 ? stripped.slice(qIdx + 1) : '';
  return { parts: path.split('/').filter(Boolean), qs };
}

function route() {
  const { parts, qs } = parseHash();
  const params = new URLSearchParams(qs);

  // Apply server from URL silently
  const serverLetter = params.get('server');
  if (serverLetter) {
    const sName = getServerFromLetter(serverLetter);
    if (sName) saveSource(sName);
  }

  hideAllViews();
  navbar.classList.remove('opaque');

  if (parts[0] === 'movie' && parts[1]) {
    showPlayerView('movie', parts[1], 1, 1);
  } else if (parts[0] === 'tv' && parts[1]) {
    const s = parseInt(parts[2]) || 1;
    const e = parseInt(parts[3]) || 1;
    showPlayerView('tv', parts[1], s, e);
  } else if (parts[0] === 'browse' && parts[1]) {
    showBrowseView(parts[1]);
  } else if (parts[0] === 'search') {
    const q = params.get('q') || '';
    showSearchView(q);
  } else {
    showHomeView();
  }
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

// ============================================================
// VIEW SWITCHING
// ============================================================
function hideAllViews() {
  viewHome.classList.add('hidden');
  viewSearch.classList.add('hidden');
  viewPlayer.classList.add('hidden');
  viewBrowse.classList.add('hidden');
  // Stop hero rotation when leaving home
  clearInterval(heroInterval);
  // Clear player iframe when leaving player
  if (viewPlayer && !viewPlayer.classList.contains('hidden')) {
    // will be hidden next line effectively
  }
}

// ============================================================
// HOME VIEW
// ============================================================
function showHomeView() {
  viewHome.classList.remove('hidden');
  document.title = 'FluxusTV';
  window.scrollTo(0, 0);

  if (!homeLoaded.done) {
    homeLoaded.done = true;
    loadHome();
  } else {
    startHeroRotation();
  }
}

async function loadHome() {
  // Build carousel scaffolding immediately
  buildCarouselShells();

  // Load hero (trending today)
  try {
    const data = await tmdbFetch('/trending/all/day');
    heroItems = (data.results || []).filter(i => i.backdrop_path);
    if (heroItems.length > 0) {
      renderHeroItem(heroItems[0]);
      startHeroRotation();
    }
  } catch (e) { console.error('Hero load failed', e); }

  // Load carousels concurrently
  CAROUSELS.forEach(c => loadCarousel(c));
}

function buildCarouselShells() {
  const wrap = $('carousels-wrap');
  wrap.innerHTML = '';
  CAROUSELS.forEach(c => {
    const sec = document.createElement('div');
    sec.className = 'carousel-section';
    sec.id = `carousel-section-${c.id}`;
    sec.innerHTML = `
      <div class="carousel-header">
        <span class="carousel-title">${esc(c.title)}</span>
        <a href="#/browse/${c.browseKey}" class="carousel-view-all">See all →</a>
      </div>
      <div class="carousel-outer" id="carousel-outer-${c.id}">
        <button class="carousel-arrow carousel-arrow-left" aria-label="Scroll left" data-carousel="${c.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="carousel-track-wrap">
          <div class="carousel-track" id="track-${c.id}"></div>
        </div>
        <button class="carousel-arrow carousel-arrow-right" aria-label="Scroll right" data-carousel="${c.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    `;
    wrap.appendChild(sec);
  });

  // Attach arrow event listeners
  wrap.addEventListener('click', (e) => {
    const arrow = e.target.closest('.carousel-arrow');
    if (!arrow) return;
    const id    = arrow.dataset.carousel;
    const outer = $(`carousel-outer-${id}`);
    const track = $(`track-${id}`);
    scrollCarousel(outer, track, arrow.classList.contains('carousel-arrow-right'));
  });
}

function scrollCarousel(outer, track, forward) {
  const cardW   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-w')) || 200;
  const visible = outer.offsetWidth;
  const step    = Math.floor(visible / (cardW + 6)) * (cardW + 6);
  const max     = track.scrollWidth - outer.offsetWidth + 80;
  let   current = parseInt(track.dataset.offset || '0');
  current = forward ? Math.min(current + step, max) : Math.max(current - step, 0);
  track.dataset.offset = current;
  track.style.transform = `translateX(-${current}px)`;
}

async function loadCarousel(c) {
  try {
    const data  = await tmdbFetch(`${c.endpoint}?page=1`);
    const items = data.results || [];
    const track = $(`track-${c.id}`);
    if (!track) return;
    track.innerHTML = '';
    items.slice(0, 20).forEach(item => {
      const type  = mediaType(item, c.forceType);
      const title = itemTitle(item, type);
      const date  = itemDate(item, type);
      const year  = date ? date.slice(0,4) : '';
      const score = item.vote_average ? item.vote_average.toFixed(1) : null;
      const thumb = item.backdrop_path
        ? `${IMG_W300}${item.backdrop_path}`
        : (item.poster_path ? `${IMG_W300}${item.poster_path}` : null);

      const card = document.createElement('div');
      card.className = 'card-item';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', title);
      card.innerHTML = `
        <div class="card-thumb">
          ${thumb
            ? `<img src="${esc(thumb)}" alt="${esc(title)}" loading="lazy" />`
            : `<div class="card-thumb-placeholder">${esc(title)}</div>`}
          <span class="card-badge ${type === 'tv' ? 'badge-tv' : 'badge-movie'}">${type === 'tv' ? 'TV' : 'Movie'}</span>
        </div>
        <div class="card-hover-info">
          <div class="card-hover-btns">
            <button class="chb-play" aria-label="Play ${esc(title)}">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <button class="chb-more" aria-label="More info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            ${score ? `<span class="card-hover-score" style="margin-left:auto;font-size:0.7rem;">★ ${score}</span>` : ''}
          </div>
          <div class="card-hover-title">${esc(title)}</div>
          <div class="card-hover-meta">
            <span>${year}</span>
            <span class="card-badge ${type === 'tv' ? 'badge-tv' : 'badge-movie'}" style="position:static;">${type === 'tv' ? 'TV' : 'Movie'}</span>
          </div>
        </div>
      `;

      const target = toTarget(type, item.id);
      // Play button → go to player
      card.querySelector('.chb-play').addEventListener('click', (ev) => {
        ev.stopPropagation();
        window.location.hash = target;
      });
      // More info → go to player
      card.querySelector('.chb-more').addEventListener('click', (ev) => {
        ev.stopPropagation();
        window.location.hash = target;
      });
      card.addEventListener('click', () => { window.location.hash = target; });
      card.addEventListener('keydown', ev => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); window.location.hash = target; }
      });

      // Hero: clicking card poster on first hover can update hero
      card.addEventListener('mouseenter', () => {
        const heroItem = items.find(i => i.id === item.id);
        if (heroItem && heroItem.backdrop_path) {
          updateHeroSilent(heroItem, type);
        }
      });

      track.appendChild(card);
    });
  } catch (e) { console.error(`Carousel ${c.id} failed`, e); }
}

// ============================================================
// HERO
// ============================================================
function renderHeroItem(item) {
  const type  = item.media_type === 'tv' ? 'tv' : 'movie';
  const title = itemTitle(item, type);
  const date  = itemDate(item, type);
  const year  = date ? date.slice(0,4) : '';
  const score = item.vote_average ? item.vote_average.toFixed(1) : null;

  heroImg.style.opacity = '0';
  heroImg.src = `${IMG_ORIG}${item.backdrop_path}`;
  heroImg.onload = () => { heroImg.style.opacity = '1'; };

  heroBadge.textContent = type === 'tv' ? 'TV Show' : 'Movie';
  heroTitle.textContent = title;
  heroOverview.textContent = item.overview || '';
  heroMeta.innerHTML = [
    score ? `<span class="hero-meta-rating">★ ${score}</span>` : '',
    year  ? `<span>${year}</span>` : '',
    item.original_language ? `<span>${item.original_language.toUpperCase()}</span>` : '',
  ].filter(Boolean).join('');

  const target = toTarget(type, item.id);
  heroPlayBtn.onclick = () => { window.location.hash = target; };
  heroInfoBtn.onclick = () => { window.location.hash = target; };
}

function updateHeroSilent(item, forcedType) {
  const type = forcedType || (item.media_type === 'tv' ? 'tv' : 'movie');
  if (!item.backdrop_path) return;
  heroImg.src = `${IMG_ORIG}${item.backdrop_path}`;
  heroTitle.textContent = itemTitle(item, type);
  heroOverview.textContent = item.overview || '';
  const target = toTarget(type, item.id);
  heroPlayBtn.onclick = () => { window.location.hash = target; };
  heroInfoBtn.onclick = () => { window.location.hash = target; };
}

function startHeroRotation() {
  clearInterval(heroInterval);
  if (heroItems.length < 2) return;
  heroInterval = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroItems.length;
    renderHeroItem(heroItems[heroIndex]);
  }, 8000);
}

// ============================================================
// PLAYER VIEW
// ============================================================
async function showPlayerView(type, id, s, e) {
  viewPlayer.classList.remove('hidden');
  navbar.classList.add('opaque');
  document.title = 'Loading… — FluxusTV';
  window.scrollTo(0, 0);

  activeMediaId   = id;
  activeMediaType = type;
  activeSeason    = s;
  activeEpisode   = e;

  // uBlock banner
  if (isUblockDismissed()) uBlockBanner.classList.add('hidden');
  else uBlockBanner.classList.remove('hidden');

  // Restore server selection
  serverSelect.value = getSavedSource();

  // Reset player UI
  playerIframe.src = '';
  iframeSpinner.classList.remove('hidden');
  playerTitle.textContent  = '…';
  playerOverview.textContent = '';
  playerGenres.textContent = '';
  playerYear.textContent   = '';
  playerRating.textContent = '';
  playerTypeBadge.textContent = '';
  playerPoster.src = '';
  playerBackdropImg.src = '';

  try {
    const detail = await fetchDetail(type, id);
    renderPlayerMeta(type, detail);

    // Newly released banner
    const releaseDate = type === 'tv' ? detail.first_air_date : detail.release_date;
    activeTitle = itemTitle(detail, type);
    activeYear  = releaseDate ? releaseDate.slice(0,4) : '';

    if (releaseDate) {
      const ageDays = (Date.now() - new Date(releaseDate)) / 86400000;
      if (ageDays < 120) newBanner.classList.remove('hidden');
      else               newBanner.classList.add('hidden');
    } else {
      newBanner.classList.add('hidden');
    }

    document.title = `${activeTitle} — FluxusTV`;

    if (type === 'tv') {
      tvSection.classList.remove('hidden');
      renderSeasonTabs(detail);
      await loadSeason(id, s, e);
    } else {
      tvSection.classList.add('hidden');
    }

    loadPlayer();
    updateHash();

  } catch (err) {
    console.error(err);
    playerTitle.textContent = 'Failed to load';
    playerOverview.textContent = 'Could not fetch details from TMDB.';
  }
}

function renderPlayerMeta(type, detail) {
  const title  = itemTitle(detail, type);
  const date   = itemDate(detail, type);
  const year   = date ? date.slice(0,4) : '';
  const rating = detail.vote_average ? detail.vote_average.toFixed(1) : null;
  const genres = (detail.genres || []).map(g => g.name).join(' · ');

  playerTitle.textContent   = title;
  playerOverview.textContent = detail.overview || 'No description available.';
  playerGenres.textContent  = genres;
  playerYear.textContent    = year;
  playerRating.textContent  = rating ? `★ ${rating}` : '';

  playerTypeBadge.textContent = type === 'tv' ? 'TV Show' : 'Movie';
  playerTypeBadge.className   = `badge ${type === 'tv' ? 'badge-tv' : 'badge-movie'}`;

  if (detail.poster_path) {
    playerPoster.src = `${IMG_W500}${detail.poster_path}`;
  }
  if (detail.backdrop_path) {
    playerBackdropImg.src = `${IMG_W780}${detail.backdrop_path}`;
  }
}

// ============================================================
// SEASON TABS
// ============================================================
function renderSeasonTabs(detail) {
  seasonTabs.innerHTML = '';
  const seasons = (detail.seasons || []).filter(s => s.season_number > 0);
  seasons.forEach(s => {
    const btn = document.createElement('button');
    btn.className   = `season-tab${s.season_number === activeSeason ? ' active' : ''}`;
    btn.textContent = `Season ${s.season_number}`;
    btn.addEventListener('click', () => {
      if (s.season_number === activeSeason) return;
      activeSeason  = s.season_number;
      activeEpisode = 1;
      document.querySelectorAll('.season-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      loadSeason(activeMediaId, s.season_number, 1);
      updateHash();
    });
    seasonTabs.appendChild(btn);
  });
}

// ============================================================
// EPISODE GRID
// ============================================================
async function loadSeason(tvId, s, highlightEp) {
  episodeGrid.innerHTML = '';
  episodesLoading.classList.remove('hidden');
  try {
    const season = await fetchSeason(tvId, s);
    episodesLoading.classList.add('hidden');
    renderEpisodes(season.episodes || [], highlightEp);
  } catch (e) {
    episodesLoading.classList.add('hidden');
    episodeGrid.innerHTML = '<p style="color:#666;padding:1rem">Failed to load episodes.</p>';
  }
}

function renderEpisodes(episodes, highlightEp) {
  episodeGrid.innerHTML = '';
  episodes.forEach(ep => {
    const card  = document.createElement('div');
    const isAct = ep.episode_number === highlightEp;
    card.className = `ep-card${isAct ? ' active' : ''}`;
    const still = ep.still_path ? `${IMG_STILL}${ep.still_path}` : null;
    card.innerHTML = `
      <div class="ep-thumb-wrap">
        ${still ? `<img src="${esc(still)}" alt="E${ep.episode_number}" loading="lazy" />` : '<div class="ep-thumb-ph">▶</div>'}
        <span class="ep-num-badge">E${ep.episode_number}</span>
      </div>
      <div class="ep-info">
        <div class="ep-title">${esc(ep.name || `Episode ${ep.episode_number}`)}</div>
        <div class="ep-desc">${esc(ep.overview || '')}</div>
      </div>
    `;
    card.addEventListener('click', () => {
      activeEpisode = ep.episode_number;
      document.querySelectorAll('.ep-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      loadPlayer();
      updateHash();
      document.querySelector('.iframe-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    episodeGrid.appendChild(card);
  });
}

// ============================================================
// PLAYER (IFRAME)
// ============================================================
function buildSrc() {
  const src = SOURCES[serverSelect.value] || SOURCES.november;
  return activeMediaType === 'tv'
    ? src.tv(activeMediaId, activeSeason, activeEpisode)
    : src.movie(activeMediaId);
}
function loadPlayer() {
  iframeSpinner.classList.remove('hidden');
  playerIframe.src = '';
  requestAnimationFrame(() => { playerIframe.src = buildSrc(); });
}
playerIframe.addEventListener('load', () => { iframeSpinner.classList.add('hidden'); });

serverSelect.addEventListener('change', () => {
  saveSource(serverSelect.value);
  if (activeMediaId) { loadPlayer(); updateHash(); }
});

// Actions
$('btn-newtab').addEventListener('click', () => {
  if (activeMediaId) window.open(buildSrc(), '_blank', 'noopener,noreferrer');
});
$('btn-download').addEventListener('click', () => {
  if (!activeTitle) return;
  const q = encodeURIComponent(`${activeTitle}${activeYear ? ' ' + activeYear : ''}`);
  window.open(`https://1337x.to/search/${q}/1/`, '_blank', 'noopener,noreferrer');
});
$('btn-share').addEventListener('click', openShareModal);
$('btn-report').addEventListener('click', () => {
  $('report-desc').value = '';
  $('report-modal').classList.remove('hidden');
  $('report-desc').focus();
});
$('player-ublock-dismiss').addEventListener('click', () => {
  dismissUblock();
  uBlockBanner.classList.add('hidden');
});
$('player-back-btn').addEventListener('click', () => {
  playerIframe.src = '';
  history.back();
});

// ============================================================
// HASH UPDATER (silent, no hashchange trigger)
// ============================================================
function updateHash() {
  if (!activeMediaId) return;
  const sl = getServerLetter(serverSelect.value);
  const h  = activeMediaType === 'tv'
    ? `#/tv/${activeMediaId}/${activeSeason}/${activeEpisode}?server=${sl}`
    : `#/movie/${activeMediaId}?server=${sl}`;
  history.replaceState(null, '', h);
}

// ============================================================
// SEARCH VIEW
// ============================================================
async function showSearchView(q) {
  viewSearch.classList.remove('hidden');
  navbar.classList.add('opaque');
  document.title = q ? `"${q}" — FluxusTV` : 'Search — FluxusTV';
  window.scrollTo(0, 0);

  if (q && q !== searchQuery) {
    searchQuery   = q;
    searchPage    = 1;
    searchResults = [];
    navSearchInput.value = q;
  }
  if (!searchQuery) return;
  await doSearch(true);
}

async function doSearch(reset) {
  if (reset) {
    searchStateLoad.classList.remove('hidden');
    searchStateEmpty.classList.add('hidden');
    searchGrid.innerHTML = '';
    searchCount.textContent = '';
    searchLoadMoreWrap.classList.add('hidden');
  }
  try {
    const url  = `${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(searchQuery)}&page=${searchPage}&include_adult=false`;
    const data = await (await fetch(url)).json();
    searchTotal = data.total_pages || 1;
    const filtered = (data.results || [])
      .filter(r => r.media_type === 'movie' || r.media_type === 'tv')
      .sort((a,b) => b.popularity - a.popularity);

    if (reset) searchResults = filtered;
    else searchResults = searchResults.concat(filtered);

    searchStateLoad.classList.add('hidden');
    if (searchResults.length === 0) { searchStateEmpty.classList.remove('hidden'); return; }

    searchCount.textContent = `${(data.total_results||0).toLocaleString()} result${data.total_results !== 1 ? 's' : ''} for "${searchQuery}"`;
    if (reset) searchGrid.innerHTML = '';
    renderSearchCards(filtered);
    if (searchPage < searchTotal) searchLoadMoreWrap.classList.remove('hidden');
    else searchLoadMoreWrap.classList.add('hidden');
  } catch (e) {
    searchStateLoad.classList.add('hidden');
    console.error(e);
  }
}

function renderSearchCards(items) {
  items.forEach(item => {
    const type  = item.media_type === 'tv' ? 'tv' : 'movie';
    const title = itemTitle(item, type);
    const date  = itemDate(item, type);
    const year  = date ? date.slice(0,4) : '';
    const poster = item.poster_path ? `${IMG_W300}${item.poster_path}` : null;
    const target = toTarget(type, item.id);

    const card = document.createElement('div');
    card.className = 's-card';
    card.innerHTML = `
      <div class="s-card-thumb">
        ${poster
          ? `<img src="${esc(poster)}" alt="${esc(title)}" loading="lazy" />`
          : `<div class="s-card-thumb-ph">${esc(title)}</div>`}
        <span class="s-card-badge ${type === 'tv' ? 'badge-tv' : 'badge-movie'}">${type === 'tv' ? 'TV' : 'Movie'}</span>
      </div>
      <div class="s-card-body">
        <div class="s-card-title">${esc(title)}</div>
        ${year ? `<div class="s-card-year">${year}</div>` : ''}
      </div>
    `;
    card.addEventListener('click', () => { window.location.hash = target; });
    searchGrid.appendChild(card);
  });
}

searchLoadMoreBtn.addEventListener('click', () => {
  if (searchPage < searchTotal) { searchPage++; doSearch(false); }
});

// ============================================================
// BROWSE VIEW
// ============================================================
function getBrowseEndpoint(key, page) {
  const map = {
    'trending-today':  `/trending/all/day?page=${page}`,
    'trending-week':   `/trending/all/week?page=${page}`,
    'now-playing':     `/movie/now_playing?page=${page}`,
    'popular-movies':  `/movie/popular?page=${page}`,
    'top-movies':      `/movie/top_rated?page=${page}`,
    'popular-tv':      `/tv/popular?page=${page}`,
    'top-tv':          `/tv/top_rated?page=${page}`,
    'airing-today':    `/tv/airing_today?page=${page}`,
    'on-air':          `/tv/on_the_air?page=${page}`,
    'upcoming':        `/movie/upcoming?page=${page}`,
  };
  // Genre (numeric id)
  if (!map[key] && /^\d+$/.test(key)) {
    return `/discover/movie?with_genres=${key}&sort_by=popularity.desc&page=${page}`;
  }
  return map[key] || null;
}

function getBrowseType(key) {
  if (['popular-tv','top-tv','airing-today','on-air'].includes(key)) return 'tv';
  if (['now-playing','popular-movies','top-movies','upcoming'].includes(key)) return 'movie';
  return null; // mixed
}

function showBrowseView(key) {
  viewBrowse.classList.remove('hidden');
  navbar.classList.add('opaque');
  browseGrid.innerHTML = '';
  browseLoading.classList.add('hidden');
  browseLoadMoreWrap.classList.add('hidden');
  browsePage     = 1;
  browseTotalPgs = 1;
  browseCategory = key;

  const label = BROWSE_LABELS[key] || (key.match(/^\d+$/) ? 'Genre' : 'Browse');
  browseTitle.textContent = label;
  document.title = `${label} — FluxusTV`;
  window.scrollTo(0, 0);

  loadBrowsePage(true);
}

async function loadBrowsePage(reset) {
  browseLoading.classList.remove('hidden');
  browseLoadMoreWrap.classList.add('hidden');
  const endpoint = getBrowseEndpoint(browseCategory, browsePage);
  if (!endpoint) { browseLoading.classList.add('hidden'); return; }
  try {
    const data  = await tmdbFetch(endpoint);
    browseTotalPgs = data.total_pages || 1;
    const forced   = getBrowseType(browseCategory);
    const items    = (data.results || []).map(i => {
      if (!i.media_type) i.media_type = forced || 'movie';
      return i;
    }).filter(i => i.media_type === 'movie' || i.media_type === 'tv');

    browseLoading.classList.add('hidden');
    if (reset) browseGrid.innerHTML = '';
    renderBrowseCards(items);
    if (browsePage < browseTotalPgs) browseLoadMoreWrap.classList.remove('hidden');
  } catch (e) {
    browseLoading.classList.add('hidden');
    console.error('Browse error', e);
  }
}

function renderBrowseCards(items) {
  items.forEach(item => {
    const type  = item.media_type === 'tv' ? 'tv' : 'movie';
    const title = itemTitle(item, type);
    const date  = itemDate(item, type);
    const year  = date ? date.slice(0,4) : '';
    const poster = item.poster_path ? `${IMG_W300}${item.poster_path}` : null;
    const target = toTarget(type, item.id);

    const card = document.createElement('div');
    card.className = 's-card';
    card.innerHTML = `
      <div class="s-card-thumb">
        ${poster
          ? `<img src="${esc(poster)}" alt="${esc(title)}" loading="lazy" />`
          : `<div class="s-card-thumb-ph">${esc(title)}</div>`}
        <span class="s-card-badge ${type === 'tv' ? 'badge-tv' : 'badge-movie'}">${type === 'tv' ? 'TV' : 'Movie'}</span>
      </div>
      <div class="s-card-body">
        <div class="s-card-title">${esc(title)}</div>
        ${year ? `<div class="s-card-year">${year}</div>` : ''}
      </div>
    `;
    card.addEventListener('click', () => { window.location.hash = target; });
    browseGrid.appendChild(card);
  });
}

browseLoadMoreBtn.addEventListener('click', () => {
  if (browsePage < browseTotalPgs) { browsePage++; loadBrowsePage(false); }
});

// ============================================================
// SHARE MODAL
// ============================================================
function buildShareUrl(includeServer) {
  const base = window.location.origin + window.location.pathname;
  let h = activeMediaType === 'tv'
    ? `#/tv/${activeMediaId}/${activeSeason}/${activeEpisode}`
    : `#/movie/${activeMediaId}`;
  if (includeServer) h += `?server=${getServerLetter(serverSelect.value)}`;
  return base + h;
}
function openShareModal() {
  $('share-url-input').value = buildShareUrl($('share-include-server').checked);
  $('share-modal').classList.remove('hidden');
  $('share-url-input').select();
}
$('share-include-server').addEventListener('change', () => {
  $('share-url-input').value = buildShareUrl($('share-include-server').checked);
});
$('share-copy-btn').addEventListener('click', () => {
  const url = $('share-url-input').value;
  navigator.clipboard?.writeText(url).then(() => {
    showToast('Link copied!');
    $('share-modal').classList.add('hidden');
  }).catch(() => {
    $('share-url-input').select();
    try { document.execCommand('copy'); showToast('Link copied!'); $('share-modal').classList.add('hidden'); }
    catch { showToast('Copy failed — select the link manually.'); }
  });
});
$('share-modal-close').addEventListener('click', () => $('share-modal').classList.add('hidden'));
$('share-modal').addEventListener('click', e => { if (e.target === $('share-modal')) $('share-modal').classList.add('hidden'); });

// ============================================================
// REPORT MODAL
// ============================================================
$('report-modal-close').addEventListener('click', () => $('report-modal').classList.add('hidden'));
$('report-cancel').addEventListener('click', () => $('report-modal').classList.add('hidden'));
$('report-modal').addEventListener('click', e => { if (e.target === $('report-modal')) $('report-modal').classList.add('hidden'); });
$('report-submit').addEventListener('click', () => {
  const desc  = $('report-desc').value.trim();
  const title = playerTitle.textContent || 'Unknown';
  window.open(
    `mailto:izaak@cc.cc?subject=${encodeURIComponent('FluxusTV Issue: ' + title)}&body=${encodeURIComponent((desc ? desc + '\n\n' : '') + 'Page: ' + location.href)}`,
    '_self'
  );
  $('report-modal').classList.add('hidden');
});

// ============================================================
// KEYBOARD
// ============================================================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!$('share-modal').classList.contains('hidden'))  { $('share-modal').classList.add('hidden');  return; }
    if (!$('report-modal').classList.contains('hidden')) { $('report-modal').classList.add('hidden'); return; }
  }
});
