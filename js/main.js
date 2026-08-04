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

  // Reservation form -> WhatsApp
  var form = document.getElementById('reserveForm');
  var formMsg = document.getElementById('formMsg');

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

      var lineas = [
        'Hola Pizzería Roma, quiero reservar mesa:',
        'Nombre: ' + nombre,
        'Teléfono: ' + telefono,
        'Fecha: ' + formatFecha(fecha),
        'Hora: ' + hora,
        'Personas: ' + personas
      ];
      if (comentarios) lineas.push('Comentarios: ' + comentarios);

      var mensaje = encodeURIComponent(lineas.join('\n'));
      var url = 'https://wa.me/' + RESTAURANT_PHONE_INTL + '?text=' + mensaje;

      setMsg('Abriendo WhatsApp con tu solicitud de reserva…', 'is-ok');
      window.open(url, '_blank', 'noopener');
      form.reset();
    });
  }
})();
