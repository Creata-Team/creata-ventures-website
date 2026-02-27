/**
 * Creata Ventures Website - Main JavaScript
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initMobileMenu();
  initLanguageSwitcher();
  initSmoothScroll();
  initScrollAnimations();
  initFormValidation();
  initPortfolioFilter();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');

      // Toggle aria-expanded
      const isExpanded = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * Language Switcher
 */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');

  langButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.dataset.lang;
      switchLanguage(lang);
    });
  });

  // Set active language based on current URL
  updateActiveLang();
}

function switchLanguage(lang) {
  const currentPath = window.location.pathname;
  const currentPage = getCurrentPage(currentPath);

  let newPath;

  if (lang === 'en') {
    // Switch to English (root)
    if (currentPath.includes('/ru/')) {
      newPath = currentPath.replace('/ru/', '/');
    } else {
      newPath = currentPath; // Already in English
    }
  } else if (lang === 'ru') {
    // Switch to Russian
    if (!currentPath.includes('/ru/')) {
      // Add /ru/ to the path
      const pathParts = currentPath.split('/').filter(p => p);
      if (pathParts.length === 0) {
        newPath = '/ru/';
      } else {
        newPath = '/ru/' + pathParts.join('/');
      }
    } else {
      newPath = currentPath; // Already in Russian
    }
  }

  // Navigate to new path
  if (newPath && newPath !== currentPath) {
    window.location.href = newPath;
  }
}

function getCurrentPage(path) {
  const cleanPath = path.replace('/ru/', '/').replace(/\/$/, '');
  const parts = cleanPath.split('/').filter(p => p);
  return parts.length > 0 ? parts[parts.length - 1] : 'index';
}

function updateActiveLang() {
  const currentPath = window.location.pathname;
  const isRussian = currentPath.includes('/ru/');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.lang === 'ru' && isRussian) {
      btn.classList.add('active');
    } else if (btn.dataset.lang === 'en' && !isRussian) {
      btn.classList.add('active');
    }
  });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        if (navLinks?.classList.contains('active')) {
          navLinks.classList.remove('active');
          menuToggle?.classList.remove('active');
        }
      }
    });
  });
}

/**
 * Scroll Animations (Intersection Observer)
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll('.card, .team-card, .stat, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add CSS for animated state
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Form Validation
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-netlify="true"]');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        // Remove previous error styling
        field.classList.remove('error');

        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        }

        // Email validation
        if (field.type === 'email' && field.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
          }
        }
      });

      if (!isValid) {
        e.preventDefault();

        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });

  // Add error styling
  const style = document.createElement('style');
  style.textContent = `
    .form-input.error,
    .form-textarea.error,
    .form-select.error {
      border-color: var(--color-error) !important;
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Portfolio Vertical Filter
 */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card[data-vertical]');

  if (!filterBtns.length || !cards.length) return;

  // Handle hash-based initial filter
  const hash = window.location.hash.replace('#', '');
  if (hash === 'creative' || hash === 'deeptech') {
    applyFilter(hash, filterBtns, cards);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      applyFilter(filter, filterBtns, cards);
    });
  });
}

function applyFilter(filter, btns, cards) {
  btns.forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  cards.forEach(card => {
    if (filter === 'all' || card.dataset.vertical === filter) {
      card.classList.remove('hidden-filter');
      card.style.display = '';
    } else {
      card.classList.add('hidden-filter');
    }
  });
}

/**
 * Header Scroll Effect
 */
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

// Add scrolled header style
const headerStyle = document.createElement('style');
headerStyle.textContent = `
  .header.scrolled {
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;
document.head.appendChild(headerStyle);
