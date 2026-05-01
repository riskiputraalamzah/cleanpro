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

  if (btn && menu) {
    btn.addEventListener('click', function () {
      var isOpen = menu.style.display === 'flex';
      menu.style.display        = isOpen ? 'none' : 'flex';
      menu.style.flexDirection  = 'column';
      menu.style.position       = 'absolute';
      menu.style.top            = '68px';
      menu.style.left           = '0';
      menu.style.right          = '0';
      menu.style.background     = '#fff';
      menu.style.padding        = '16px 24px';
      menu.style.borderBottom   = '1px solid #e5e7eb';
      menu.style.zIndex         = '999';
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
        if (menu && window.innerWidth <= 991.98 && menu.style.display === 'flex') {
          menu.style.display = 'none';
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
  var navbar    = document.querySelector('.site-navbar');
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
      if (menu && menu.style.display === 'flex') {
        menu.style.display = 'none';
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
