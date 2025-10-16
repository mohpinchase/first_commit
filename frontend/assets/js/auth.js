// AuthManager for UniPeer
window.AuthManager = (() => {
  function saveToken(token) {
    try { localStorage.setItem('unipeer:token', token); } catch {}
  }
  function clearToken() {
    try { localStorage.removeItem('unipeer:token'); } catch {}
  }
  function getToken() {
    try { return localStorage.getItem('unipeer:token'); } catch { return null; }
  }

  async function register(payload) {
    const data = await Api.post('/accounts/users/register/', payload);
    return data;
  }

  async function login(payload) {
    const data = await Api.post('/accounts/users/login/', payload);
    const token = data?.token || data?.access;
    if (token) saveToken(token);
    return data;
  }

  async function getMe() {
    try {
      const me = await Api.get('/accounts/users/me/');
      return me;
    } catch (e) {
      return null;
    }
  }

  async function logout() {
    clearToken();
    return true;
  }

  async function updateProfile(payload) {
    const data = await Api.patch('/accounts/profiles/update_my_profile/', payload);
    return data;
  }

  return { register, login, logout, getMe, updateProfile, getToken };
})();
