/* ============================================================
   Elderly Eats — main.js
   All site-wide functionality
   ============================================================ */

/* ── Page Loader ─────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      setTimeout(() => loader.remove(), 500);
    }, 800);
  }
});

/* ── Theme (Dark / Light) ────────────────────────────────── */
const THEME_KEY = 'ee_theme';
const RTL_KEY   = 'ee_rtl';

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  
  const sunIcon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path></svg>`;
  const moonIcon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  
  document.querySelectorAll('[data-theme-icon]').forEach(el => {
    el.innerHTML = dark ? sunIcon : moonIcon;
  });
  document.querySelectorAll('[data-theme-label]').forEach(el => {
    el.textContent = dark ? 'Light Mode' : 'Dark Mode';
  });
}

function applyRTL(rtl) {
  document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
  localStorage.setItem(RTL_KEY, rtl ? '1' : '0');
  document.querySelectorAll('[data-rtl-label]').forEach(el => {
    el.textContent = rtl ? 'LTR' : 'RTL';
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme === 'dark' || (!savedTheme && prefersDark));
  applyRTL(localStorage.getItem(RTL_KEY) === '1');
}

function initializeApp() {
  initTheme();
  setupNavigation();

  /* ── Dynamic Navigation & Dashboard Link & Active States ── */
  function setupNavigation() {
    const rawPath = window.location.pathname || 'index.html';
    const normalizePage = p => {
      let s = (p || '').split('?')[0].split('#')[0].split('/').pop() || 'index';
      if (!s || s === '') s = 'index';
      return s.replace(/\.html$/i, '').toLowerCase();
    };

    const currentPageName = normalizePage(rawPath);
    const isHome = (currentPageName === 'index' || currentPageName === 'home-2');

    const desktopNav = document.querySelector('#site-header nav');
    const mobileNav = document.querySelector('#mobile-menu nav');

    // 1. Ensure Dashboard link exists in Desktop Nav
    if (desktopNav) {
      let dashLink = desktopNav.querySelector('a[href="dashboard.html"], a[href="dashboard"]');
      if (!dashLink) {
        dashLink = document.createElement('a');
        dashLink.href = 'dashboard.html';
        dashLink.textContent = 'Dashboard';
        dashLink.className = 'text-[15px] font-medium text-sage-800 hover:text-sage-600 dark:text-gray-200 dark:hover:text-white py-1 transition-colors whitespace-nowrap';
        desktopNav.appendChild(dashLink);
      }
    }

    // 2. Ensure Dashboard link exists in Mobile Nav
    if (mobileNav) {
      let mobileDashLink = mobileNav.querySelector('a[href="dashboard.html"], a[href="dashboard"]');
      if (!mobileDashLink) {
        mobileDashLink = document.createElement('a');
        mobileDashLink.href = 'dashboard.html';
        mobileDashLink.textContent = 'Dashboard';
        mobileDashLink.className = 'block font-medium text-sage-800 dark:text-gray-200 px-4 py-2.5 border-b border-cream-200/40 dark:border-gray-800/60 transition-all mb-1';
        mobileNav.appendChild(mobileDashLink);
      }
    }

    // 3. Desktop Nav Active States
    if (desktopNav) {
      const homeTrigger = document.getElementById('home-dropdown-trigger');
      if (homeTrigger) {
        if (isHome) {
          homeTrigger.className = 'flex items-center space-x-1 text-[15px] font-bold text-sage-700 dark:text-sage-300 border-b-2 border-sage-500 dark:border-sage-400 py-1 transition-all focus:outline-none whitespace-nowrap';
        } else {
          homeTrigger.className = 'flex items-center space-x-1 text-[15px] font-medium text-sage-800 hover:text-sage-600 dark:text-gray-200 dark:hover:text-white py-1 transition-colors focus:outline-none whitespace-nowrap';
        }
      }

      desktopNav.querySelectorAll(':scope > a').forEach(link => {
        const hrefPage = normalizePage(link.getAttribute('href'));
        const isActive = (hrefPage === currentPageName);
        if (isActive) {
          link.className = 'text-[15px] font-bold text-sage-700 dark:text-sage-300 border-b-2 border-sage-500 dark:border-sage-400 py-1 transition-all whitespace-nowrap';
        } else {
          link.className = 'text-[15px] font-medium text-sage-800 hover:text-sage-600 dark:text-gray-200 dark:hover:text-white py-1 transition-colors whitespace-nowrap';
        }
      });
    }

    // 4. Mobile Nav Active States
    if (mobileNav) {
      const mobileHomeToggle = document.getElementById('mobile-home-toggle');
      if (mobileHomeToggle) {
        if (isHome) {
          mobileHomeToggle.className = 'flex items-center justify-between w-full text-left font-bold text-sage-700 dark:text-sage-300 border-l-4 border-sage-500 dark:border-sage-400 pl-3 py-2.5 transition-all mb-1';
        } else {
          mobileHomeToggle.className = 'flex items-center justify-between w-full text-left font-medium text-sage-800 dark:text-gray-200 px-4 py-2.5 border-b border-cream-200/40 dark:border-gray-800/60 transition-all mb-1';
        }
      }

      mobileNav.querySelectorAll(':scope > a').forEach(link => {
        const hrefPage = normalizePage(link.getAttribute('href'));
        const isActive = (hrefPage === currentPageName);
        if (isActive) {
          link.className = 'block font-bold text-sage-700 dark:text-sage-300 border-l-4 border-sage-500 dark:border-sage-400 pl-3 py-2.5 transition-all mb-1';
        } else {
          link.className = 'block font-medium text-sage-800 dark:text-gray-200 px-4 py-2.5 border-b border-cream-200/40 dark:border-gray-800/60 transition-all mb-1';
        }
      });
    }

    // 5. Home 1 vs Home 2 Submenu Highlights
    document.querySelectorAll('#home-dropdown-menu a, #mobile-home-submenu a').forEach(link => {
      const hrefPage = normalizePage(link.getAttribute('href'));
      const isCurrentPage = (hrefPage === currentPageName);
      const isMobileSub = link.closest('#mobile-home-submenu');

      if (isCurrentPage) {
        if (isMobileSub) {
          link.className = 'block py-2 px-3.5 text-sm font-bold text-sage-700 dark:text-sage-300 border-l-2 border-sage-500 dark:border-sage-400 flex items-center justify-between';
        } else {
          link.className = 'block px-5 py-2.5 text-sm font-bold text-sage-700 dark:text-sage-300 border-l-2 border-sage-500 dark:border-sage-400 flex items-center justify-between';
        }
      } else {
        if (isMobileSub) {
          link.className = 'block py-2 px-3.5 text-sm font-medium text-sage-700 dark:text-gray-300 hover:text-sage-900 dark:hover:text-white hover:bg-cream-100/50 dark:hover:bg-gray-800 rounded-lg transition-colors';
        } else {
          link.className = 'block px-5 py-2.5 text-sm font-medium text-sage-800 dark:text-gray-200 hover:bg-cream-50 dark:hover:bg-gray-700/50 transition-colors';
        }
      }
    });
  }

  /* Theme toggles */
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(!document.documentElement.classList.contains('dark'));
    });
  });

  /* RTL toggles */
  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyRTL(document.documentElement.getAttribute('dir') !== 'rtl');
    });
  });

  /* ── Mobile Nav ──────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function openMobileMenu() {
    setupNavigation();
    mobileMenu?.classList.remove('translate-x-full');
    mobileOverlay?.classList.remove('opacity-0', 'pointer-events-none');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    mobileMenu?.classList.add('translate-x-full');
    mobileOverlay?.classList.add('opacity-0', 'pointer-events-none');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    expanded ? closeMobileMenu() : openMobileMenu();
  });
  mobileOverlay?.addEventListener('click', closeMobileMenu);
  document.getElementById('mobile-close')?.addEventListener('click', closeMobileMenu);

  /* ── Desktop Home Dropdown ───────────────────────────── */
  const dropdownTrigger = document.getElementById('home-dropdown-trigger');
  const dropdownMenu    = document.getElementById('home-dropdown-menu');

  if (dropdownTrigger && dropdownMenu) {
    let closeTimer;
    const showDrop = () => { clearTimeout(closeTimer); dropdownMenu.classList.remove('opacity-0','pointer-events-none','translate-y-2'); };
    const hideDrop = () => { closeTimer = setTimeout(() => { dropdownMenu.classList.add('opacity-0','pointer-events-none','translate-y-2'); }, 150); };
    dropdownTrigger.addEventListener('mouseenter', showDrop);
    dropdownMenu.addEventListener('mouseenter', showDrop);
    dropdownTrigger.addEventListener('mouseleave', hideDrop);
    dropdownMenu.addEventListener('mouseleave', hideDrop);
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('opacity-0');
      dropdownMenu.classList.toggle('pointer-events-none');
      dropdownMenu.classList.toggle('translate-y-2');
    });
    document.addEventListener('click', hideDrop);
  }

  /* ── Mobile Home Accordion ───────────────────────────── */
  const mobileHomeToggle = document.getElementById('mobile-home-toggle');
  const mobileHomeSubmenu = document.getElementById('mobile-home-submenu');
  mobileHomeToggle?.addEventListener('click', () => {
    mobileHomeSubmenu?.classList.toggle('hidden');
    const arrow = mobileHomeToggle.querySelector('[data-arrow]');
    if (arrow) arrow.style.transform = mobileHomeSubmenu?.classList.contains('hidden') ? '' : 'rotate(180deg)';
  });

  /* ── Sticky Header Shadow ────────────────────────────── */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (header) {
      header.classList.toggle('shadow-lg', window.scrollY > 10);
    }
  }, { passive: true });

  /* ── Back to Top ─────────────────────────────────────── */
  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btt?.classList.toggle('opacity-0', window.scrollY < 400);
    btt?.classList.toggle('pointer-events-none', window.scrollY < 400);
  }, { passive: true });
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Scroll Reveal ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  }

  /* ── Counter Animation ───────────────────────────────── */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.counter, 10);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current.toLocaleString() + suffix;
            if (current >= target) clearInterval(timer);
          }, 25);
          cObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  }

  /* ── Accordion ───────────────────────────────────────── */
  document.querySelectorAll('[data-accordion-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item    = trigger.closest('[data-accordion-item]');
      const content = item?.querySelector('[data-accordion-content]');
      const icon    = trigger.querySelector('[data-acc-icon]');
      const isOpen  = !content?.classList.contains('hidden');
      /* Close all siblings */
      item?.parentElement?.querySelectorAll('[data-accordion-item]').forEach(sib => {
        sib.querySelector('[data-accordion-content]')?.classList.add('hidden');
        sib.querySelector('[data-acc-icon]')?.setAttribute('style', '');
      });
      if (!isOpen) {
        content?.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  /* ── Auth Guard ──────────────────────────────────────── */
  if (document.body.dataset.requireAuth) {
    if (!localStorage.getItem('ee_logged_in')) {
      window.location.href = 'login.html';
    }
  }
  updateNavAuth();

  /* ── Tab System ──────────────────────────────────────── */
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const groupId = group.dataset.tabGroup;
    const triggers = group.querySelectorAll('[data-tab]');
    const panels   = document.querySelectorAll(`[data-tab-panel="${groupId}"]`);
    triggers.forEach(t => {
      t.addEventListener('click', () => {
        triggers.forEach(x => x.classList.remove('tab-active'));
        t.classList.add('tab-active');
        const target = t.dataset.tab;
        panels.forEach(p => p.classList.toggle('hidden', p.dataset.tabId !== target));
      });
    });
    triggers[0]?.click();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

/* ── Auth Helpers ────────────────────────────────────────── */
function updateNavAuth() {
  const loggedIn = !!localStorage.getItem('ee_logged_in');
  document.querySelectorAll('[data-show-auth]').forEach(el => {
    el.style.display = el.dataset.showAuth === (loggedIn ? 'in' : 'out') ? '' : 'none';
  });
}

function doLogin(email, password) {
  const users = JSON.parse(localStorage.getItem('ee_users') || '[]');
  const user  = users.find(u => u.email === email && u.password === password);
  /* demo fallback */
  if (user || (email === 'demo@elderlyeats.com' && (password === 'demo123' || password === 'demo1234'))) {
    const profile = user || { name: 'Sarah Mitchell', email, phone: '(555) 012-3456', relationship: 'Daughter' };
    localStorage.setItem('ee_logged_in', '1');
    localStorage.setItem('ee_profile', JSON.stringify(profile));
    return { success: true };
  }
  return { success: false, message: 'Invalid email or password.' };
}

function doRegister(data) {
  const users = JSON.parse(localStorage.getItem('ee_users') || '[]');
  if (users.find(u => u.email === data.email)) {
    return { success: false, message: 'Email is already registered.' };
  }
  users.push(data);
  localStorage.setItem('ee_users', JSON.stringify(users));
  localStorage.setItem('ee_logged_in', '1');
  localStorage.setItem('ee_profile', JSON.stringify(data));
  return { success: true };
}

function doLogout() {
  localStorage.removeItem('ee_logged_in');
  window.location.href = 'login.html';
}

/* ── Form Validation Helper ──────────────────────────────── */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[data-required]').forEach(input => {
    const err = form.querySelector(`[data-error="${input.name}"]`);
    const empty = !input.value.trim();
    const emailFail = input.type === 'email' && input.value && !/\S+@\S+\.\S+/.test(input.value);
    if (empty || emailFail) {
      valid = false;
      err?.classList.remove('hidden');
      input.classList.add('border-red-500');
    } else {
      err?.classList.add('hidden');
      input.classList.remove('border-red-500');
    }
  });
  return valid;
}

/* ── Notification Toast ──────────────────────────────────── */
function showToast(msg, type = 'success') {
  const colors = { success: 'bg-green-600', error: 'bg-red-500', info: 'bg-green-700' };
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl transition-all duration-300 ${colors[type] || colors.success}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

/* ── Modal Helper ────────────────────────────────────────── */
function openModal(id) {
  const m = document.getElementById(id);
  m?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const m = document.getElementById(id);
  m?.classList.add('hidden');
  document.body.style.overflow = '';
}
document.addEventListener('click', e => {
  if (e.target.matches('[data-modal-close]')) closeModal(e.target.dataset.modalClose);
  if (e.target.matches('[data-modal-open]'))  openModal(e.target.dataset.modalOpen);
});

/* ── LocalStorage Helpers ────────────────────────────────── */
const Store = {
  get:    (k, def = null) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
  set:    (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  push:   (k, item) => { const arr = Store.get(k, []); arr.push(item); Store.set(k, arr); return arr; },
  remove: (k) => localStorage.removeItem(k),
};
