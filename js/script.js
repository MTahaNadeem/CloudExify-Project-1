/* ============================================
   DOM READY WRAPPER
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------
     PAGE LOADER
     ------------------------------------------ */
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 600);
  });

  /* ------------------------------------------
     THEME SWITCHER (localStorage)
     ------------------------------------------ */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('portfolio-theme');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    localStorage.setItem('portfolio-theme', theme);
  };

  if (savedTheme) {
    applyTheme(savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  /* ------------------------------------------
     MOBILE NAV
     ------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');
  const allNavLinks = document.querySelectorAll('.nav-link');

  const toggleNav = () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    navOverlay.classList.toggle('show');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleNav);
  navOverlay.addEventListener('click', toggleNav);

  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleNav();
      }
    });
  });

  /* ------------------------------------------
     NAVBAR SCROLL EFFECT & ACTIVE LINK
     ------------------------------------------ */
  const nav = document.getElementById('main-nav');
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    const scrollY = window.scrollY;

    /* Navbar background */
    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    /* Active link highlight */
    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        currentSection = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------
     TYPEWRITER EFFECT
     ------------------------------------------ */
  const typewriterEl = document.getElementById('typewriter-text');
  const lines = [
    'Software Engineering Student',
    'Freelance UI/UX Designer',
    'CloudExify Intern',
    'Full-Stack Web Developer',
    'AI Integration Specialist',
  ];
  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeDelay = 70;

  const typewrite = () => {
    const currentLine = lines[lineIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentLine.substring(0, charIndex - 1);
      charIndex--;
      typeDelay = 35;
    } else {
      typewriterEl.textContent = currentLine.substring(0, charIndex + 1);
      charIndex++;
      typeDelay = 70;
    }

    if (!isDeleting && charIndex === currentLine.length) {
      typeDelay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
      typeDelay = 400;
    }

    setTimeout(typewrite, typeDelay);
  };

  typewrite();

  /* ------------------------------------------
     SCROLL-TRIGGERED SKILL BARS
     ------------------------------------------ */
  const skillFills = document.querySelectorAll('.skill-bar-fill');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const target = fill.getAttribute('data-width');
          fill.style.width = target;
          fill.classList.add('animated');
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillFills.forEach(fill => skillObserver.observe(fill));

  /* ------------------------------------------
     SCROLL REVEAL ANIMATIONS
     ------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------
     PROJECT FILTER
     ------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      /* Activate button */
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags');

        if (filter === 'all' || tags.includes(filter)) {
          card.classList.remove('fade-out');
          card.classList.remove('hidden-card');
          /* Force reflow then add fade-in */
          void card.offsetWidth;
          card.classList.add('fade-in');
        } else {
          card.classList.add('fade-out');
          card.classList.remove('fade-in');
          setTimeout(() => { card.classList.add('hidden-card'); }, 300);
        }
      });
    });
  });

  /* ------------------------------------------
     CONTACT FORM VALIDATION
     ------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const formFields = document.getElementById('form-fields');
  const formSuccess = document.getElementById('form-success');
  const nameInput = document.getElementById('input-name');
  const emailInput = document.getElementById('input-email');
  const messageInput = document.getElementById('input-message');
  const nameError = document.getElementById('error-name');
  const emailError = document.getElementById('error-email');
  const messageError = document.getElementById('error-message');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, errorEl, validationFn, errorMsg) => {
    const value = input.value.trim();
    if (!validationFn(value)) {
      errorEl.textContent = errorMsg;
      errorEl.classList.add('show');
      return false;
    }
    errorEl.classList.remove('show');
    return true;
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(
      nameInput, nameError,
      v => v.length > 0,
      'Please enter your name.'
    );

    const isEmailValid = validateField(
      emailInput, emailError,
      v => emailRegex.test(v),
      'Please enter a valid email address.'
    );

    const isMessageValid = validateField(
      messageInput, messageError,
      v => v.length > 0,
      'Please enter a message.'
    );

    if (isNameValid && isEmailValid && isMessageValid) {
      formFields.style.display = 'none';
      formSuccess.classList.add('show');

      /* Reset after 4s */
      setTimeout(() => {
        contactForm.reset();
        formFields.style.display = '';
        formSuccess.classList.remove('show');
      }, 4000);
    }
  });

  /* Live validation on blur */
  nameInput.addEventListener('blur', () => {
    validateField(nameInput, nameError, v => v.length > 0, 'Please enter your name.');
  });
  emailInput.addEventListener('blur', () => {
    validateField(emailInput, emailError, v => v.length === 0 || emailRegex.test(v), 'Please enter a valid email address.');
  });
  messageInput.addEventListener('blur', () => {
    validateField(messageInput, messageError, v => v.length > 0, 'Please enter a message.');
  });

  /* Clear error on input */
  [nameInput, emailInput, messageInput].forEach((input, i) => {
    const errorEls = [nameError, emailError, messageError];
    input.addEventListener('input', () => {
      errorEls[i].classList.remove('show');
    });
  });
});
