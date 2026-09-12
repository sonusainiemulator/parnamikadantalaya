document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scrolled State ---
  const navbar = document.querySelector('.navbar');
  const navbarContainer = document.querySelector('.navbar-floating-container');
  const checkScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
      if (navbarContainer) navbarContainer.classList.add('scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
      if (navbarContainer) navbarContainer.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll();

  // --- Scroll Reveal Animations (AOS replacement) ---
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-up, .reveal-zoom');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- Stats Counter Animation ---
  const statsElements = document.querySelectorAll('.stat-count');
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'), 10);
        let count = 0;
        const speed = target / 50; // increment speed
        const updateCount = () => {
          count += speed;
          if (count < target) {
            entry.target.innerText = Math.floor(count);
            setTimeout(updateCount, 20);
          } else {
            entry.target.innerText = target;
          }
        };
        updateCount();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsElements.forEach(el => statsObserver.observe(el));

  // --- Interactive Before & After Image Slider ---
  const baSliders = document.querySelectorAll('.ba-slider');
  baSliders.forEach(slider => {
    const resizeImage = slider.querySelector('.ba-resize');
    const handle = slider.querySelector('.ba-handle');
    if (!resizeImage || !handle) return;

    let active = false;

    const slide = (x) => {
      let rect = slider.getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;
      resizeImage.style.width = `${pos}%`;
      handle.style.left = `${pos}%`;
    };

    // Desktop mouse events
    slider.addEventListener('mousedown', (e) => {
      active = true;
      slide(e.clientX);
    });
    window.addEventListener('mouseup', () => { active = false; });
    window.addEventListener('mousemove', (e) => {
      if (!active) return;
      slide(e.clientX);
    });

    // Mobile touch events
    slider.addEventListener('touchstart', (e) => {
      active = true;
      slide(e.touches[0].clientX);
    });
    window.addEventListener('touchend', () => { active = false; });
    window.addEventListener('touchmove', (e) => {
      if (!active) return;
      slide(e.touches[0].clientX);
    });
  });

  // --- Testimonial Slider ---
  const track = document.querySelector('.testimonial-track');
  if (track) {
    const slides = Array.from(track.children);
    const dotContainer = document.querySelector('.testimonial-dots');
    let currentIndex = 0;

    // Create navigation dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('testimonial-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
      dotContainer.appendChild(dot);
    });

    const dots = Array.from(dotContainer.children);

    const goToSlide = (index) => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    };

    // Auto loop slide
    setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }, 6000);
  }

  // --- Gallery Filtering System ---
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // --- Custom Lightbox Popup ---
  const lightbox = document.querySelector('.custom-lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

  if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {
    lightboxTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const img = trigger.querySelector('img');
        const caption = trigger.getAttribute('data-title') || img.alt;
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('show');
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('show');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('show');
      }
    });
  }

  // --- Appointment Booking Form Interactive Logic ---
  const bookingForms = document.querySelectorAll('.booking-form-element');
  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Booking...';
      
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Confirmed!';
        submitBtn.classList.remove('btn-premium', 'btn-secondary-premium');
        submitBtn.classList.add('btn-success');
        
        // Custom interactive response message
        const responseDiv = document.createElement('div');
        responseDiv.className = 'alert alert-success mt-3 text-center border-0 shadow-sm';
        responseDiv.style.borderRadius = '12px';
        responseDiv.innerHTML = '<strong>Success!</strong> Your premium appointment request has been submitted. Our concierge team will call you shortly.';
        form.appendChild(responseDiv);
        
        form.reset();
      }, 2000);
    });
  });

  // --- Dynamic Floating Quick Action Widget ---
  if (!document.querySelector('.floating-action-widget')) {
    const actionWidget = document.createElement('div');
    actionWidget.className = 'floating-action-widget';
    actionWidget.innerHTML = `
      <a href="tel:+917751031224" class="floating-action-btn floating-call-btn" title="Call Clinic Now">
        <i class="fas fa-phone-alt"></i>
      </a>
      <button class="floating-action-btn" data-bs-toggle="modal" data-bs-target="#bookingModal" title="Book Instant Appointment">
        <i class="fas fa-calendar-alt"></i>
      </button>
    `;
    document.body.appendChild(actionWidget);
  }

  // --- Dynamic Promotional Toast Popup ---
  if (!sessionStorage.getItem('promoToastClosed') && !document.querySelector('.promo-toast-popup')) {
    const promoToast = document.createElement('div');
    promoToast.className = 'promo-toast-popup';
    promoToast.innerHTML = `
      <button class="promo-toast-close" aria-label="Close offer">&times;</button>

        <span class="badge bg-primary text-white mb-2 px-3 py-1 rounded-pill" style="font-size: 0.72rem; letter-spacing: 1px;"><i class="fas fa-gift me-1 text-warning"></i>SPECIAL OFFER</span>
        <h6 class="font-headings mb-1 text-dark" style="font-size: 1.05rem;">15% Off Dental Screening</h6>
        <p class="text-muted small mb-3" style="font-size: 0.82rem; line-height: 1.4;">Book your consultation with our dental specialists at Parnamika Dantalaya in Bhadra, Rajasthan online today!</p>
        <button class="btn-premium btn-sm w-100 py-2 fs-6 rounded-pill" data-bs-toggle="modal" data-bs-target="#bookingModal">Claim Special Offer</button>

    `;
    document.body.appendChild(promoToast);

    // Show after 3.5 seconds
    setTimeout(() => {
      promoToast.classList.add('show');
    }, 3500);

    // Close handler
    const closeBtn = promoToast.querySelector('.promo-toast-close');
    const claimBtn = promoToast.querySelector('button[data-bs-target="#bookingModal"]');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        promoToast.classList.remove('show');
        sessionStorage.setItem('promoToastClosed', 'true');
      });
    }

    if (claimBtn) {
      claimBtn.addEventListener('click', () => {
        promoToast.classList.remove('show');
        sessionStorage.setItem('promoToastClosed', 'true');
      });
    }
  }
});

