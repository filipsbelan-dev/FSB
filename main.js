/* =============================================
   FILIP S. BELAN — main.js
   ============================================= */

// ---- NAVBAR scroll effect ----
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- MOBILE NAV toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll(
  '.intro-inner, .service-card, .service-block, .portfolio-item, .stat, .contact-inner, .cta-band-inner, .review-card'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// ---- COUNT-UP ANIMATION ----
function animateCount(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1800;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const countEls = document.querySelectorAll('.count-stat');
if (countEls.length) {
  const countObserved = new Set();
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countObserved.has(entry.target)) {
        countObserved.add(entry.target);
        animateCount(entry.target);
      }
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));
}

// ---- PORTFOLIO FILTER ----
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

// ---- LIGHTBOX ----
// ---- LIGHTBOX (Uprataná a stopercentne funkčná verzia) ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');

// Načítame položky presne podľa triedy vo tvojom HTML
const polozkyPortfolia = document.querySelectorAll('.gallery-item');

let currentAlbumImages = []; 
let currentIndex = 0;        
let currentZoom = 1;

// Premenné pre držanie a posúvanie priblíženej fotky
let isDragging = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;

function getAlbumImages(item) {
  const images = [];
  const mainImg = item.querySelector('img');
  if (mainImg) images.push(mainImg.src);
  
  const hiddenImgs = item.querySelectorAll('.hidden-album img');
  hiddenImgs.forEach(img => images.push(img.src));
  
  return images;
}

function updateImageTransform() {
  if (lightboxImg) {
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
  }
}

function resetZoom() {
  currentZoom = 1;
  translateX = 0;
  translateY = 0;
  updateImageTransform();
}

function openLightbox(images, index) {
  currentAlbumImages = images;
  currentIndex = index;
  
  resetZoom(); 
  if (lightboxImg) lightboxImg.src = currentAlbumImages[currentIndex];
  if (lightbox) lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Zobrazenie alebo skrytie šípok podľa toho, či má projekt album
  if (currentAlbumImages.length > 1) {
    if (lightboxPrev) lightboxPrev.style.display = 'flex';
    if (lightboxNext) lightboxNext.style.display = 'flex';
  } else {
    if (lightboxPrev) lightboxPrev.style.display = 'none';
    if (lightboxNext) lightboxNext.style.display = 'none';
  }
}

function closeLightbox() {
  if (lightbox) lightbox.classList.remove('active');
  document.body.style.overflow = '';
  if (lightboxImg) lightboxImg.src = '';
  resetZoom();
}

function showNext() {
  if (currentAlbumImages.length <= 1) return;
  currentIndex = (currentIndex + 1) % currentAlbumImages.length;
  if (lightboxImg) lightboxImg.src = currentAlbumImages[currentIndex];
  resetZoom(); 
}

function showPrev() {
  if (currentAlbumImages.length <= 1) return;
  currentIndex = (currentIndex - 1 + currentAlbumImages.length) % currentAlbumImages.length;
  if (lightboxImg) lightboxImg.src = currentAlbumImages[currentIndex];
  resetZoom(); 
}

if (lightbox && polozkyPortfolia.length > 0) {
  // Priradenie kliknutia pre všetky projekty v mriežke
  polozkyPortfolia.forEach((item) => {
    item.addEventListener('click', () => {
      const albumImages = getAlbumImages(item);
      openLightbox(albumImages, 0);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  
  lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation(); 
    showNext();
  });
  
  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation(); 
    showPrev();
  });

  // Tlačidlá priblíženia (+ / -)
  zoomInBtn?.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (currentZoom < 4) { 
      currentZoom += 0.5; 
      updateImageTransform();
    }
  });

  zoomOutBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentZoom > 0.5) { 
      currentZoom -= 0.5; 
      if (currentZoom <= 1) {
        translateX = 0;
        translateY = 0;
      }
      updateImageTransform();
    }
  });

  // Logika pre chytanie a posúvanie zväčšenej fotky myšou
  lightboxImg?.addEventListener('mousedown', (e) => {
    if (currentZoom <= 1) return; 
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateImageTransform();
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Dotykové ovládanie pre posúvanie na mobiloch
  lightboxImg?.addEventListener('touchstart', (e) => {
    if (currentZoom <= 1) return;
    isDragging = true;
    startX = e.touches[0].clientX - translateX;
    startY = e.touches[0].clientY - translateY;
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    translateX = e.touches[0].clientX - startX;
    translateY = e.touches[0].clientY - startY;
    updateImageTransform();
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Kliknutie na prázdne pozadie alebo nezväčšenú fotku zatvorí lightbox
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.id === 'lightbox' || (e.target === lightboxImg && currentZoom <= 1)) {
      closeLightbox();
    }
  });

  // Klávesnica (ESC a šípky)
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}
// ---- CONTACT FORM ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Odoslané ✓';
    btn.style.background = '#2a5c3a';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

// ---- COOKIES BANNER ----
(function() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  const consent = localStorage.getItem('fsb_cookie_consent');
  if (!consent) {
    // Small delay so it slides in after page load
    setTimeout(() => banner.classList.add('visible'), 800);
  }
  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('fsb_cookie_consent', 'accepted');
    banner.classList.remove('visible');
  });
  document.getElementById('cookie-decline')?.addEventListener('click', () => {
    localStorage.setItem('fsb_cookie_consent', 'declined');
    banner.classList.remove('visible');
  });
})();
