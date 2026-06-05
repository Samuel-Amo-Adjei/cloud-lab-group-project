/* ==============================================
   Cloud Ninjas — script.js
   Mobile menu toggle + contact form feedback.
   No e-commerce logic.
=============================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile menu toggle ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    /* Close menu when a link is tapped */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── Contact form (demo — no server) ── */
  const submitBtn    = document.getElementById('formSubmitBtn');
  const formSuccess  = document.getElementById('formSuccess');

  if (submitBtn && formSuccess) {
    submitBtn.addEventListener('click', () => {
      const name    = document.getElementById('fname')?.value.trim();
      const email   = document.getElementById('femail')?.value.trim();
      const message = document.getElementById('fmessage')?.value.trim();

      if (!name || !email || !message) {
        alert('Please fill in your name, email, and message before submitting.');
        return;
      }

      /* Show success message */
      formSuccess.classList.remove('hidden');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
    });
  }

});
