// Global entry: load components, toggle theme, SPA-like navigation
UniPeer.onReady(async () => {
  // Load navbar and footer by CSS selectors if present
  await UniPeer.loadComponent('#navbar', '/components/navbar.html');
  await UniPeer.loadComponent('#footer', '/components/footer.html');
  // Also support legacy data-component placeholders
  await UniPeer.loadComponents();

  // Theme init already handled in utils, ensure buttons reflect
  UniPeer.reflectAuthState();

  // Fade-in on first load
  document.body.classList.add('fade-in');

  // Intercept clicks for SPA-like navigation
  document.body.addEventListener('click', async (e) => {
    const anchor = e.target.closest('a[data-link]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;
    e.preventDefault();
    navigate(href);
  });
});

async function navigate(href) {
  try {
    // Basic partial page loading: fetch, swap <main> content, preserve components
    const res = await fetch(href, { cache: 'no-cache' });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const newMain = doc.querySelector('main');
    const currentMain = document.querySelector('main');
    if (newMain && currentMain) {
      document.body.classList.remove('fade-in');
      document.body.classList.add('fade-out');
      await new Promise(r => setTimeout(r, 120));
      currentMain.replaceWith(newMain);
      history.pushState({}, '', href);
      document.body.classList.remove('fade-out');
      document.body.classList.add('fade-in');
      // Re-wire navbar events after DOM change
      UniPeer.initNavbarInteractions();
      UniPeer.reflectAuthState();
      // Execute inline scripts inside new main if any
      doc.querySelectorAll('script').forEach(s => {
        if (s.src) {
          const sc = document.createElement('script');
          sc.src = s.src; sc.defer = true;
          document.body.appendChild(sc);
        } else if (s.textContent) {
          const sc = document.createElement('script');
          sc.textContent = s.textContent;
          document.body.appendChild(sc);
        }
      });
    } else {
      window.location.href = href; // Fallback full navigation
    }
  } catch (e) {
    UniPeer.showNotification('Navigation failed', 'error');
    window.location.href = href;
  }
}

window.addEventListener('popstate', () => {
  // On back/forward, do a full reload for simplicity
  window.location.reload();
});
