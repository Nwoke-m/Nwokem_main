/* Nwoke'm — site behaviour. Settings live in js/config.js. */
(function () {
  'use strict';
  var C = window.NWOKEM || {};
  var digits = String(C.whatsapp || '').replace(/\D/g, '');
  var hasWA = digits.length >= 10;

  function wa(text) {
    return 'https://wa.me/' + digits + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  function naira(n) {
    return '₦' + Number(n).toLocaleString('en-NG');
  }

  // WhatsApp links: <a data-wa="message text">
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = hasWA ? wa(a.getAttribute('data-wa')) : '#';
    a.target = '_blank';
    a.rel = 'noopener';
    if (!hasWA) a.addEventListener('click', function (e) {
      e.preventDefault();
      alertSoft('Add your WhatsApp number in js/config.js to switch on ordering.');
    });
  });

  // Prices: <span data-price="signature">
  document.querySelectorAll('[data-price]').forEach(function (el) {
    var v = (C.prices || {})[el.getAttribute('data-price')];
    el.textContent = (v === null || v === undefined || v === '') ? 'Price on request' : naira(v);
  });

  // Text settings: <span data-setting="delivery">
  document.querySelectorAll('[data-setting]').forEach(function (el) {
    var v = C[el.getAttribute('data-setting')];
    if (v) el.textContent = v;
  });

  // Social + email links: <a data-social="instagram|tiktok|email">
  document.querySelectorAll('[data-social]').forEach(function (a) {
    var k = a.getAttribute('data-social'), v = C[k];
    if (!v) { (a.parentElement.tagName === 'LI' ? a.parentElement : a).hidden = true; return; }
    if (k === 'instagram') a.href = 'https://www.instagram.com/' + v + '/';
    if (k === 'tiktok') a.href = 'https://www.tiktok.com/@' + v;
    if (k === 'email') { a.href = 'mailto:' + v; a.textContent = v; }
  });

  // Year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Enquiry forms -> composed WhatsApp message
  document.querySelectorAll('form[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var lines = [form.getAttribute('data-wa-form')];
      form.querySelectorAll('[name]').forEach(function (f) {
        if (f.type === 'checkbox' && !f.checked) return;
        if (!f.value.trim()) return;
        var label = form.querySelector('label[for="' + f.id + '"]');
        lines.push((label ? label.textContent.trim() : f.name) + ': ' + f.value.trim());
      });
      if (!hasWA) {
        alertSoft('Add your WhatsApp number in js/config.js to switch on enquiries.');
        return;
      }
      window.open(wa(lines.join('\n')), '_blank', 'noopener');
      var done = form.querySelector('.form-done');
      if (done) done.hidden = false;
    });
  });

  function alertSoft(msg) {
    var t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('show'); }, 4000);
  }
})();
