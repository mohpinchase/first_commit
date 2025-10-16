UniPeer.onReady(async () => {
  const form = UniPeer.qs('#profile-form');
  const nameEl = UniPeer.qs('#profile-name');
  try {
    const me = await AuthManager.getMe();
    if (me && nameEl) nameEl.textContent = me.username || me.email || 'Student';
    if (me && form) {
      form.first_name.value = me.first_name || '';
      form.last_name.value = me.last_name || '';
      form.bio.value = me.bio || '';
    }
  } catch {}

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      first_name: formData.get('first_name')?.toString().trim(),
      last_name: formData.get('last_name')?.toString().trim(),
      bio: formData.get('bio')?.toString().trim(),
    };
    try {
      await AuthManager.updateProfile(payload);
      UniPeer.toast('Profile updated', 'success');
    } catch (e) {
      UniPeer.toast(e?.data?.detail || 'Update failed', 'error');
    }
  });
});
