/* ============================================================
   Cleanpro — Main JavaScript
   assets/js/main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. HAMBURGER MENU (Mobile)
  ---------------------------------------------------------- */
  var btn  = document.getElementById('hamburgerBtn');
  var menu = document.querySelector('.nav-menu');
  var navbar = document.querySelector('.site-navbar');

  if (btn && menu) {
    btn.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      btn.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (navbar) {
        navbar.classList.toggle('menu-open', isOpen);
        navbar.classList.remove('nav-hidden');
      }
    });
  }

  /* ----------------------------------------------------------
     2. SMOOTH SCROLL — Anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = this.getAttribute('href');
      if (target !== '#' && document.querySelector(target)) {
        e.preventDefault();
        var el     = document.querySelector(target);
        var offset = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: offset, behavior: 'smooth' });

        // Tutup hamburger menu setelah klik link
        if (menu && window.innerWidth <= 991.98 && menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          if (btn) {
            btn.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
          }
          if (navbar) {
            navbar.classList.remove('menu-open');
          }
        }
      }
    });
  });

  /* ----------------------------------------------------------
     3. PRICE CAROUSEL
  ---------------------------------------------------------- */
  var priceCarousel = document.getElementById('priceCarousel');
  var priceDots     = document.querySelectorAll('#priceCarouselDots .pdot');
  var priceTotal    = 3;
  var priceCur      = 0;
  var priceTimer;

  function priceGoTo(idx) {
    priceCur = (idx + priceTotal) % priceTotal;
    priceCarousel.style.transform = 'translateX(-' + (priceCur * 100) + '%)';
    priceDots.forEach(function (d, i) {
      d.classList.toggle('active', i === priceCur);
    });
  }

  priceDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      priceGoTo(parseInt(dot.dataset.idx));
    });
  });

  function priceStart() {
    priceTimer = setInterval(function () { priceGoTo(priceCur + 1); }, 4000);
  }
  function priceStop() { clearInterval(priceTimer); }

  if (priceCarousel) {
    priceStart();

    // Touch
    var ptx = 0;
    priceCarousel.addEventListener('touchstart', function (e) {
      ptx = e.touches[0].clientX;
      priceStop();
    }, { passive: true });
    priceCarousel.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - ptx;
      if (Math.abs(dx) > 40) priceGoTo(dx < 0 ? priceCur + 1 : priceCur - 1);
      priceStart();
    }, { passive: true });

    // Mouse drag
    var pDrag = false, pdx0 = 0;
    priceCarousel.addEventListener('mousedown', function (e) {
      pDrag = true; pdx0 = e.clientX; priceStop();
    });
    document.addEventListener('mouseup', function (e) {
      if (!pDrag) return;
      pDrag = false;
      var dx = e.clientX - pdx0;
      if (Math.abs(dx) > 40) priceGoTo(dx < 0 ? priceCur + 1 : priceCur - 1);
      priceStart();
    });
  }

  /* ----------------------------------------------------------
     3b. BEFORE-AFTER INTERACTIVE SLIDER
     Drag the handle to reveal before/after images
  ---------------------------------------------------------- */
  var allSliders = document.querySelectorAll('.ba-split-wrap');
  allSliders.forEach(function (wrap) {
    var handle  = wrap.querySelector('.ba-slider-handle');
    var afterImg = wrap.querySelector('.ba-img-after');
    if (!handle || !afterImg) return;

    var dragging = false;

    function updateSlider(clientX) {
      var rect = wrap.getBoundingClientRect();
      var x = clientX - rect.left;
      var pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
      afterImg.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
    }

    // Mouse events
    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      dragging = true;
    });
    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      updateSlider(e.clientX);
    });
    document.addEventListener('mouseup', function () {
      dragging = false;
    });

    // Touch events
    handle.addEventListener('touchstart', function (e) {
      dragging = true;
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', function () {
      dragging = false;
    });

    // Click anywhere on the wrap to jump the slider
    wrap.addEventListener('click', function (e) {
      updateSlider(e.clientX);
    });
  });

  /* ----------------------------------------------------------
     3c. BEFORE-AFTER CAROUSEL (mobile only)
  ---------------------------------------------------------- */
  var baTrack = document.getElementById('baTrack');
  var baPrev  = document.getElementById('baPrev');
  var baNext  = document.getElementById('baNext');
  var baDots  = document.querySelectorAll('#baDots .ba-dot');
  var baTotal = 4;
  var baCur   = 0;
  var baMobile = window.matchMedia('(max-width: 767.98px)');

  function baGoTo(idx) {
    baCur = Math.max(0, Math.min(idx, baTotal - 1));
    baTrack.style.transform = 'translateX(-' + (baCur * 100) + '%)';
    baDots.forEach(function (d, i) {
      d.classList.toggle('active', i === baCur);
    });
  }

  if (baTrack && baPrev && baNext) {
    baPrev.addEventListener('click', function () { baGoTo(baCur - 1); });
    baNext.addEventListener('click', function () { baGoTo(baCur + 1); });

    baDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        baGoTo(parseInt(dot.dataset.idx));
      });
    });

    // Touch swipe for carousel (only on card body, not slider handle)
    var batx = 0;
    var baSwipeOk = true;
    baTrack.addEventListener('touchstart', function (e) {
      // Don't start swipe if touching the slider handle
      if (e.target.closest('.ba-slider-handle') || e.target.closest('.ba-split-wrap')) {
        baSwipeOk = false;
      } else {
        baSwipeOk = true;
      }
      batx = e.touches[0].clientX;
    }, { passive: true });
    baTrack.addEventListener('touchend', function (e) {
      if (!baSwipeOk) return;
      var dx = e.changedTouches[0].clientX - batx;
      if (Math.abs(dx) > 40) baGoTo(dx < 0 ? baCur + 1 : baCur - 1);
    }, { passive: true });

    // Reset position on resize (mobile → desktop)
    function baResetOnResize() {
      if (!baMobile.matches) {
        baTrack.style.transform = '';
        baCur = 0;
        baDots.forEach(function (d, i) {
          d.classList.toggle('active', i === 0);
        });
      }
    }
    window.addEventListener('resize', baResetOnResize);
  }

  /* ----------------------------------------------------------
     4. TESTIMONIAL CAROUSEL
  ---------------------------------------------------------- */
  var testiCarousel = document.getElementById('testiCarousel');
  var testiDots     = document.querySelectorAll('#testiDots .tdot');
  var testiTotal    = 4;
  var testiCur      = 0;
  var testiTimer;

  function testiGoTo(idx) {
    testiCur = (idx + testiTotal) % testiTotal;
    testiCarousel.style.transform = 'translateX(-' + (testiCur * 100) + '%)';
    testiDots.forEach(function (d, i) {
      d.classList.toggle('active', i === testiCur);
    });
  }

  testiDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      testiGoTo(parseInt(dot.dataset.idx));
    });
  });

  function testiStart() {
    testiTimer = setInterval(function () { testiGoTo(testiCur + 1); }, 4500);
  }
  function testiStop() { clearInterval(testiTimer); }

  if (testiCarousel) {
    testiStart();

    // Touch
    var ttx = 0;
    testiCarousel.addEventListener('touchstart', function (e) {
      ttx = e.touches[0].clientX;
      testiStop();
    }, { passive: true });
    testiCarousel.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - ttx;
      if (Math.abs(dx) > 40) testiGoTo(dx < 0 ? testiCur + 1 : testiCur - 1);
      testiStart();
    }, { passive: true });

    // Mouse drag
    var tDrag = false, tdx0 = 0;
    testiCarousel.addEventListener('mousedown', function (e) {
      tDrag = true; tdx0 = e.clientX; testiStop();
    });
    document.addEventListener('mouseup', function (e) {
      if (!tDrag) return;
      tDrag = false;
      var dx = e.clientX - tdx0;
      if (Math.abs(dx) > 40) testiGoTo(dx < 0 ? testiCur + 1 : testiCur - 1);
      testiStart();
    });
  }

  /* ----------------------------------------------------------
     5. SMART AUTOHIDE NAVBAR
     - Scroll ke bawah → navbar hilang (slide up)
     - Scroll ke atas  → navbar muncul kembali (slide down)
     - Di paling atas  → selalu tampil + tanpa shadow
  ---------------------------------------------------------- */
  var lastScroll = 0;
  var ticking   = false;
  var SCROLL_THRESHOLD = 80; // px dari atas sebelum navbar mulai autohide

  function handleNavScroll() {
    var currentScroll = window.scrollY;

    // Tambah/hapus class shadow
    if (currentScroll > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Di paling atas → selalu tampil
    if (currentScroll <= SCROLL_THRESHOLD) {
      navbar.classList.remove('nav-hidden');
      lastScroll = currentScroll;
      ticking = false;
      return;
    }

    // Scroll ke bawah → sembunyikan navbar + tutup hamburger menu
    if (currentScroll > lastScroll && currentScroll > SCROLL_THRESHOLD) {
      navbar.classList.add('nav-hidden');
      // Tutup menu hamburger jika sedang terbuka
      if (menu && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        if (btn) {
          btn.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        }
        navbar.classList.remove('menu-open');
      }
    }
    // Scroll ke atas → tampilkan
    else if (currentScroll < lastScroll) {
      navbar.classList.remove('nav-hidden');
    }

    lastScroll = currentScroll;
    ticking = false;
  }

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(handleNavScroll);
        ticking = true;
      }
    }, { passive: true });
  }

});
