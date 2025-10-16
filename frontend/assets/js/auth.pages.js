// Page-level auth interactions for login/register
UniPeer.onReady(() => {
  const loginForm = UniPeer.qs('#login-form');
  const registerForm = UniPeer.qs('#register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const payload = {
        email: formData.get('email')?.toString().trim(),
        password: formData.get('password')?.toString(),
      };
      if (!payload.email || !payload.password) {
        UniPeer.toast('Please enter email and password', 'error');
        return;
      }
      try {
        await window.AuthManager.login(payload);
        UniPeer.toast('Welcome back!', 'success');
        window.location.href = '/dashboard/index.html';
      } catch (e) {
        const msg = e?.data?.detail || 'Invalid credentials';
        showInlineError(loginForm, msg);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const payload = {
        first_name: formData.get('first_name')?.toString().trim(),
        last_name: formData.get('last_name')?.toString().trim(),
        username: formData.get('username')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        password: formData.get('password')?.toString(),
        password_confirm: formData.get('password_confirm')?.toString(),
      };

      const errors = validateRegister(payload);
      if (errors.length) {
        showInlineError(registerForm, errors[0]);
        return;
      }

      try {
        await window.AuthManager.register(payload);
        UniPeer.toast('Registration successful! Please login.', 'success');
        window.location.href = '/auth/login.html';
      } catch (e) {
        const msg = e?.data?.detail || 'Registration failed';
        showInlineError(registerForm, msg);
      }
    });
  }

  function validateRegister(p) {
    const errs = [];
    if (!p.first_name || !p.last_name) errs.push('Please enter your full name');
    if (!p.username) errs.push('Username is required');
    if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errs.push('Valid email is required');
    if (!p.password || p.password.length < 6) errs.push('Password must be at least 6 characters');
    if (p.password !== p.password_confirm) errs.push('Passwords do not match');
    return errs;
  }

  function showInlineError(form, message) {
    let box = form.querySelector('.inline-error');
    if (!box) {
      box = document.createElement('div');
      box.className = 'inline-error field-error';
      form.prepend(box);
    }
    box.textContent = message;
  }
});
