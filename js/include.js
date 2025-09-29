async function loadIncludes() {
  const includes = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(includes).map(async el => {
    const src = el.getAttribute('data-include');
    try {
      const res = await fetch(src, { cache: 'no-cache' });
      if (!res.ok) throw new Error('Failed to fetch ' + src);
      el.innerHTML = await res.text();
    } catch (e) {
      console.error('Include error:', e);
    }
  }));
  // After header/footer load, update cart count
  if (window.Cart && Cart.updateCartIcon) {
    Cart.updateCartIcon();
  }

  // Wire mobile nav toggle after header is included
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav .nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close menu when a link is clicked (mobile UX)
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Add floating WhatsApp include (once)
  if (!document.getElementById('floating-whatsapp-link')) {
    const wrap = document.createElement('div');
    wrap.setAttribute('data-include', 'components/whatsapp-float.html');
    document.body.appendChild(wrap);
    try {
      const res = await fetch('components/whatsapp-float.html', { cache: 'no-cache' });
      if (res.ok) wrap.innerHTML = await res.text();
    } catch {}
  }

  // Ensure Google Material Symbols stylesheet is loaded
  if (!document.getElementById('material-symbols-outlined-css')) {
    const link = document.createElement('link');
    link.id = 'material-symbols-outlined-css';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400..700,0..1,-50..200';
    document.head.appendChild(link);
  }

  // Wire WhatsApp button to configured number if present
  const w = document.getElementById('floating-whatsapp-link');
  if (w && typeof WHATSAPP_PHONE_NUMBER !== 'undefined') {
    const msg = encodeURIComponent('Hello! I have a quick question about FinGaurd RO systems.');
    w.href = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${msg}`;
  }


}

document.addEventListener('DOMContentLoaded', loadIncludes);