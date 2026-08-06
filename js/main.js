(function () {
  'use strict';

  var RESTAURANT_PHONE_INTL = '34986164639';

  // Mobile navigation toggle
  var header = document.querySelector('.site-header');
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (navToggle && header) {
    navToggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reservation form -> on-page summary to read over the phone
  var form = document.getElementById('reserveForm');
  var formMsg = document.getElementById('formMsg');
  var reserveSummary = document.getElementById('reserveSummary');
  var reserveSummaryList = document.getElementById('reserveSummaryList');

  function setMsg(text, type) {
    formMsg.textContent = text;
    formMsg.classList.remove('is-error', 'is-ok');
    if (type) formMsg.classList.add(type);
  }

  function formatFecha(value) {
    if (!value) return '';
    var parts = value.split('-');
    if (parts.length !== 3) return value;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  if (form) {
    var minDateField = document.getElementById('fecha');
    if (minDateField) {
      var today = new Date();
      var iso = today.toISOString().split('T')[0];
      minDateField.setAttribute('min', iso);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setMsg('', null);
      reserveSummary.classList.remove('is-visible');

      var data = new FormData(form);
      var nombre = (data.get('nombre') || '').toString().trim();
      var telefono = (data.get('telefono') || '').toString().trim();
      var fecha = (data.get('fecha') || '').toString().trim();
      var hora = (data.get('hora') || '').toString().trim();
      var personas = (data.get('personas') || '').toString().trim();
      var comentarios = (data.get('comentarios') || '').toString().trim();

      if (!nombre || !telefono || !fecha || !hora || !personas) {
        setMsg('Por favor, completa todos los campos obligatorios.', 'is-error');
        return;
      }

      var telefonoLimpio = telefono.replace(/[^0-9+]/g, '');
      if (telefonoLimpio.length < 9) {
        setMsg('Introduce un número de teléfono válido.', 'is-error');
        return;
      }

      var rows = [
        ['Nombre', nombre],
        ['Teléfono', telefono],
        ['Fecha', formatFecha(fecha)],
        ['Hora', hora],
        ['Personas', personas]
      ];
      if (comentarios) rows.push(['Comentarios', comentarios]);

      reserveSummaryList.innerHTML = rows.map(function (row) {
        return '<dt>' + row[0] + '</dt><dd>' + row[1].replace(/</g, '&lt;') + '</dd>';
      }).join('');

      setMsg('Listo. Ten esto a mano y llámanos para confirmar.', 'is-ok');
      reserveSummary.classList.add('is-visible');
      reserveSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Save contact as vCard
  var saveContactBtn = document.getElementById('saveContactBtn');
  if (saveContactBtn) {
    saveContactBtn.addEventListener('click', function () {
      var vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:;Pizzería Roma;;;',
        'FN:Pizzería Roma',
        'TEL;TYPE=WORK,VOICE:+' + RESTAURANT_PHONE_INTL,
        'ADR;TYPE=WORK:;;Rúa Fuensanta Rodríguez, 1;Sanxenxo;Pontevedra;36960;España',
        'NOTE:Pizzería frente a la Playa de Silgar',
        'END:VCARD'
      ].join('\r\n');

      var blob = new Blob([vcard], { type: 'text/vcard' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'pizzeria-roma.vcf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // Carta tabs
  var tabButtons = document.querySelectorAll('.tabs__btn');
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');

      tabButtons.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.tabs__panel').forEach(function (panel) {
        panel.classList.toggle('is-active', panel.id === 'tab-' + target);
      });
    });
  });

  // Gallery lightbox
  var galleryCards = Array.prototype.slice.call(document.querySelectorAll('.gallery-card'));
  var lightbox = document.getElementById('lightbox');
  var lightboxFigure = document.getElementById('lightboxFigure');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentIndex = 0;

  function openLightbox(index) {
    if (!galleryCards.length) return;
    currentIndex = (index + galleryCards.length) % galleryCards.length;
    var card = galleryCards[currentIndex];
    var svg = card.querySelector('svg');
    lightboxFigure.innerHTML = '';
    if (svg) lightboxFigure.appendChild(svg.cloneNode(true));
    lightboxCaption.textContent = card.getAttribute('data-caption') || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  galleryCards.forEach(function (card, index) {
    card.addEventListener('click', function () { openLightbox(index); });
  });

  if (lightbox) {
    lightbox.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });
    lightboxPrev.addEventListener('click', function () { openLightbox(currentIndex - 1); });
    lightboxNext.addEventListener('click', function () { openLightbox(currentIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Back to top
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
