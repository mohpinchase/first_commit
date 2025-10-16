/* Utilities for UniPeer: component loader, toasts, theme, auth state */
const UniPeer = (() => {
  const API_BASE = 'http://localhost:8000/api';

  function qs(selector, scope = document) { return scope.querySelector(selector); }
  function qsa(selector, scope = document) { return Array.from(scope.querySelectorAll(selector)); }

  async function loadComponents() {
    const placeholders = qsa('[data-component]');
    await Promise.all(placeholders.map(async el => {
      const url = el.getAttribute('data-component');
      try {
        const resp = await fetch(url, { cache: 'no-cache' });
        const html = await resp.text();
        el.innerHTML = html;
      } catch (e) {
        console.error('Failed to load component', url, e);
      }
    }));
    initNavbarInteractions();
  }

  function toast(message, type = 'info', timeout = 3500) {
    const host = document.createElement('div');
    host.className = 'toast-host';
    const item = document.createElement('div');
    item.className = `toast toast-${type}`;
    item.textContent = message;
    host.appendChild(item);
    document.body.appendChild(host);
    setTimeout(() => host.classList.add('show'));
    setTimeout(() => {
      host.classList.remove('show');
      setTimeout(() => host.remove(), 250);
    }, timeout);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('unipeer:theme', theme); } catch {}
    syncThemeButtons();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'light' ? 'dark' : 'light');
  }

  function initThemeFromStorage() {
    try {
      const saved = localStorage.getItem('unipeer:theme');
      if (saved) applyTheme(saved);
    } catch {}
  }

  function syncThemeButtons() {
    const isDark = (document.documentElement.getAttribute('data-theme') || 'light') === 'dark';
    qsa('#theme-toggle, #theme-toggle-mobile').forEach(btn => {
      if (!btn) return;
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function initNavbarInteractions() {
    const hamburger = qs('#hamburger');
    const drawer = qs('#mobile-drawer');
    const close = qs('#close-drawer');
    const themeBtns = qsa('#theme-toggle, #theme-toggle-mobile');
    const logoutBtns = qsa('#logout-btn, #logout-btn-mobile');

    if (hamburger && drawer) {
      hamburger.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        drawer.setAttribute('aria-hidden', String(!isOpen));
      });
    }
    if (close && drawer) {
      close.addEventListener('click', () => {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        hamburger?.setAttribute('aria-expanded', 'false');
      });
    }
    themeBtns.forEach(btn => btn?.addEventListener('click', toggleTheme));
    logoutBtns.forEach(btn => btn?.addEventListener('click', async () => {
      try {
        await window.AuthManager?.logout();
        toast('Logged out successfully', 'success');
        window.location.href = '/index.html';
      } catch (e) {
        toast('Failed to logout', 'error');
      }
    }));

    reflectAuthState();
  }

  function setAuthState(isAuthenticated) {
    qsa('[data-requires-auth]')?.forEach(el => { el.style.display = isAuthenticated ? '' : 'none'; });
    qsa('[data-hide-when-auth]')?.forEach(el => { el.style.display = isAuthenticated ? 'none' : ''; });
  }

  async function reflectAuthState() {
    try {
      const me = await window.AuthManager?.getMe();
      setAuthState(Boolean(me));
    } catch {
      setAuthState(false);
    }
  }

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  // expose
  return {
    API_BASE,
    qs,
    qsa,
    loadComponents,
    toast,
    applyTheme,
    toggleTheme,
    initThemeFromStorage,
    onReady,
    reflectAuthState,
  };
})();

// Apply theme early
UniPeer.initThemeFromStorage();

// Initialize after DOM
UniPeer.onReady(async () => {
  await UniPeer.loadComponents();
  UniPeer.reflectAuthState();
});

// Toast styles
const style = document.createElement('style');
style.textContent = `
.toast-host { position: fixed; top: 16px; right: 16px; z-index: 2000; transform: translateY(-12px); opacity: 0; transition: all 200ms ease; }
.toast-host.show { transform: translateY(0); opacity: 1; }
.toast { background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); padding: 10px 14px; border-radius: 12px; box-shadow: var(--shadow-md); }
.toast-success { border-color: color-mix(in oklab, var(--success) 50%, transparent); }
.toast-error { border-color: color-mix(in oklab, #ef4444 50%, transparent); }
`;
document.head.appendChild(style);
