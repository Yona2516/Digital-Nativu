(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Contact form enhancement (works with or without JS)
  const form = document.querySelector('form[data-enhanced-form]');
  if (form) {
    const status = document.querySelector('[data-form-status]');
    form.addEventListener('submit', async function (e) {
      if (!form.action || !form.method) return; // fallback to default if not present
      e.preventDefault();
      if (status) {
        status.innerHTML = '<div class="alert">Sending…</div>';
      }
      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: form.method,
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        if (response.ok) {
          form.reset();
          if (status) {
            status.innerHTML = '<div class="alert alert-success">Thank you! Your message has been sent.</div>';
          }
        } else {
          if (status) {
            status.innerHTML = '<div class="alert alert-error">Oops, something went wrong. Please try again.</div>';
          }
        }
      } catch (err) {
        if (status) {
          status.innerHTML = '<div class="alert alert-error">Network error. Please try again later.</div>';
        }
      }
    });
  }
})();


