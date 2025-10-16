UniPeer.onReady(async () => {
  const me = await AuthManager.getMe();
  const nameEl = UniPeer.qs('#user-name');
  if (me && nameEl) nameEl.textContent = me.first_name ? `${me.first_name} ${me.last_name || ''}`.trim() : (me.username || 'Student');

  // Placeholder loads: resources, forums, events
  // Replace with real endpoints when available
});
