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
  const enhancedForm = document.querySelector('form[data-enhanced-form]');
  if (enhancedForm) {
    const status = document.querySelector('[data-form-status]');
    enhancedForm.addEventListener('submit', async function (e) {
      if (!enhancedForm.action || !enhancedForm.method) return; // default submit
      e.preventDefault();
      if (status) status.innerHTML = '<div class="alert">Sending…</div>';
      try {
        const formData = new FormData(enhancedForm);
        const response = await fetch(enhancedForm.action, {
          method: enhancedForm.method,
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        if (response.ok) {
          enhancedForm.reset();
          if (status) status.innerHTML = '<div class="alert alert-success">Thank you! Your message has been sent.</div>';
        } else {
          if (status) status.innerHTML = '<div class="alert alert-error">Oops, something went wrong. Please try again.</div>';
        }
      } catch (err) {
        if (status) status.innerHTML = '<div class="alert alert-error">Network error. Please try again later.</div>';
      }
    });
  }

  // Backend comments form (JSON to API)
  const API_BASE = window.API_BASE || 'http://localhost:8787';
  const commentsForm = document.querySelector('form[data-comments-form]');
  if (commentsForm) {
    const status = document.querySelector('[data-form-status]');
    commentsForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (status) status.innerHTML = '<div class="alert">Sending…</div>';
      const formData = new FormData(commentsForm);
      const payload = {
        name: formData.get('name') || null,
        email: formData.get('email') || null,
        comment_text: formData.get('message') || formData.get('comment') || ''
      };
      try {
        const response = await fetch(API_BASE + '/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const body = await response.json().catch(() => ({}));
        if (response.ok) {
          commentsForm.reset();
          if (status) status.innerHTML = '<div class="alert alert-success">Thanks! Awaiting approval.</div>';
        } else {
          if (status) status.innerHTML = `<div class="alert alert-error">${body.error || 'Submission failed.'}</div>`;
        }
      } catch (err) {
        if (status) status.innerHTML = '<div class="alert alert-error">Network error. Please try again later.</div>';
      }
    });
  }
})();



