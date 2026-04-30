/* main.js — Portfolio interactions */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════
     SCROLL-IN ANIMATION
  ══════════════════════════════════ */
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
  sections.forEach(s => observer.observe(s));

  /* ══════════════════════════════════
     ACTIVE NAV ON SCROLL
  ══════════════════════════════════ */
  const navLinks = document.querySelectorAll('nav ul li a');
  const sectionEls = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    let current = '';
    sectionEls.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ══════════════════════════════════
     MOBILE SIDEBAR
  ══════════════════════════════════ */
  const toggle = document.getElementById('mobileToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  const openSidebar = () => { sidebar.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeSidebar = () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };

  toggle?.addEventListener('click', openSidebar);
  overlay?.addEventListener('click', closeSidebar);
  navLinks.forEach(link => link.addEventListener('click', () => { if (window.innerWidth <= 900) closeSidebar(); }));

  /* ══════════════════════════════════
     LAST UPDATED DATE
  ══════════════════════════════════ */
  const dateEl = document.getElementById('lastUpdated');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  /* ══════════════════════════════════
     COLLAPSIBLE UTILITY
  ══════════════════════════════════ */
  function makeCollapsible(trigger, body, chevron, startOpen) {
    const setOpen = (open) => {
      body.classList.toggle('open', open);
      if (chevron) chevron.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };
    setOpen(startOpen);
    trigger.addEventListener('click', (e) => {
      // Don't bubble up if a nested trigger is clicked
      if (e.target.closest('.semester-label') && trigger !== e.target.closest('.semester-label')) return;
      setOpen(!body.classList.contains('open'));
    });
    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger.click(); }
    });
  }

  /* ══════════════════════════════════
     EXPERIENCE CARDS — top-level
  ══════════════════════════════════ */
  document.querySelectorAll('.exp-card').forEach((card, idx) => {
    const header  = card.querySelector('.exp-card-header');
    const body    = card.querySelector('.exp-body');
    const chevron = header?.querySelector('.chevron');
    if (!header || !body) return;

    // First card (Data Engineer, current) starts open
    const startOpen = idx === 0;
    makeCollapsible(header, body, chevron, startOpen);

    // Stop clicks on nested semester-labels from toggling the card
    card.querySelectorAll('.semester-label').forEach(sl => {
      sl.addEventListener('click', (e) => e.stopPropagation());
    });
  });

  /* ══════════════════════════════════
     NESTED SEMESTER DROPDOWNS (inside TA card)
  ══════════════════════════════════ */
  document.querySelectorAll('.exp-semester').forEach((sem, idx) => {
    const label   = sem.querySelector('.semester-label');
    const courses = sem.querySelector('.course-list');
    if (!label || !courses) return;

    const bodyWrapper = document.createElement('div');
    bodyWrapper.className = 'collapsible-body';
    courses.parentNode.insertBefore(bodyWrapper, courses);
    bodyWrapper.appendChild(courses);

    const count = courses.querySelectorAll('.course-item').length;

    const badge = document.createElement('span');
    badge.className = 'pub-count-badge';
    badge.textContent = `${count} course${count !== 1 ? 's' : ''}`;

    const chevron = document.createElement('span');
    chevron.className = 'chevron';
    chevron.style.cssText = 'width:16px;height:16px;font-size:0.55rem;';
    chevron.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';

    const line = label.querySelector('.semester-line');
    if (line) {
      label.insertBefore(badge, line.nextSibling);
      label.appendChild(chevron);
    }

    // Most recent semester (index 0 = Spring 2020) starts open
    const setOpen = (open) => {
      bodyWrapper.classList.toggle('open', open);
      chevron.classList.toggle('open', open);
      label.setAttribute('aria-expanded', String(open));
    };
    setOpen(idx === 0);

    label.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!bodyWrapper.classList.contains('open'));
    });
    label.setAttribute('tabindex', '0');
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); label.click(); }
    });
  });

  /* ══════════════════════════════════
     THESIS CARDS — collapsible
  ══════════════════════════════════ */
  document.querySelectorAll('.thesis-card').forEach((card, idx) => {
    const trigger = card.querySelector('.thesis-header');
    const body    = card.querySelector('.thesis-body');
    const chevron = card.querySelector('.chevron');
    if (!trigger || !body) return;
    makeCollapsible(trigger, body, chevron, idx === 0);
  });

  /* ══════════════════════════════════
     PROJECT CARDS — collapsible
  ══════════════════════════════════ */
  document.querySelectorAll('.project-card').forEach((card) => {
    const trigger = card.querySelector('.project-header');
    const body    = card.querySelector('.project-body');
    const chevron = card.querySelector('.chevron');
    if (!trigger || !body) return;
    makeCollapsible(trigger, body, chevron, false);
  });

  /* ══════════════════════════════════
     PUBLICATIONS — collapsible year groups
  ══════════════════════════════════ */
  document.querySelectorAll('.pub-year-group').forEach((group, idx) => {
    const header = group.querySelector('.pub-year');
    const list   = group.querySelector('.pub-list');
    if (!header || !list) return;

    const bodyWrapper = document.createElement('div');
    bodyWrapper.className = 'collapsible-body';
    list.parentNode.insertBefore(bodyWrapper, list);
    bodyWrapper.appendChild(list);

    const count = list.querySelectorAll('.pub-item').length;
    const yearText = header.textContent.trim();
    header.innerHTML = '';

    const inner = document.createElement('div');
    inner.style.cssText = 'display:flex;align-items:center;width:100%;gap:0.75rem;';

    const yearLabel = document.createElement('span');
    yearLabel.textContent = yearText;
    inner.appendChild(yearLabel);

    const line = document.createElement('span');
    line.style.cssText = 'flex:1;height:1px;background:var(--border);display:block;';
    inner.appendChild(line);

    const badge = document.createElement('span');
    badge.className = 'pub-count-badge';
    badge.textContent = `${count} paper${count !== 1 ? 's' : ''}`;
    inner.appendChild(badge);

    const chevron = document.createElement('span');
    chevron.className = 'chevron';
    chevron.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    inner.appendChild(chevron);

    header.appendChild(inner);
    makeCollapsible(header, bodyWrapper, chevron, idx === 0);
  });

  /* ══════════════════════════════════
     SKILLS — show more / less
  ══════════════════════════════════ */
  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) {
    const VISIBLE_COUNT = 4;
    const allCats = [...skillsGrid.querySelectorAll('.skill-category')];
    if (allCats.length > VISIBLE_COUNT) {
      const extras = allCats.slice(VISIBLE_COUNT);
      extras.forEach(c => c.classList.add('hidden-skill'));

      const btn = document.createElement('button');
      btn.className = 'show-more-btn';
      const updateBtn = (open) => {
        btn.classList.toggle('open', open);
        btn.innerHTML = open
          ? `Show fewer <span class="btn-icon"><i class="fa-solid fa-chevron-down"></i></span>`
          : `Show ${extras.length} more categories <span class="btn-icon"><i class="fa-solid fa-chevron-down"></i></span>`;
      };
      updateBtn(false);
      skillsGrid.after(btn);
      btn.addEventListener('click', () => {
        const open = !btn.classList.contains('open');
        extras.forEach(c => c.classList.toggle('hidden-skill', !open));
        updateBtn(open);
      });
    }
  }

  /* ══════════════════════════════════
     BIO — read more / read less
     .bio-extra is BEFORE .read-more-btn
  ══════════════════════════════════ */
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    const extra = btn.previousElementSibling;
    if (!extra || !extra.classList.contains('bio-extra')) return;
    btn.addEventListener('click', () => {
      const open = !extra.classList.contains('open');
      extra.classList.toggle('open', open);
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      const label = btn.querySelector('.btn-label');
      if (label) label.textContent = open ? 'Read less' : 'Read more';
    });
  });

});
