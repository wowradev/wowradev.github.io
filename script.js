(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Sticky nav state ---------- */
    const nav = document.getElementById('nav');
    const setNavScrolled = () => {
        if (!nav) return;
        nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    setNavScrolled();
    window.addEventListener('scroll', setNavScrolled, { passive: true });

    /* ---------- Mobile menu toggle ---------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(open));
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- Reveal on scroll ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    }

    /* ---------- Animated counters ---------- */
    const counters = document.querySelectorAll('[data-count]');
    const animateCounter = (el) => {
        const target = Number(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        counters.forEach(el => {
            el.textContent = (el.dataset.count || '0') + (el.dataset.suffix || '');
        });
    } else {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    /* ---------- Scroll-spy active nav link ---------- */
    const sections = ['services', 'stack', 'process', 'contact']
        .map(id => document.getElementById(id))
        .filter(Boolean);
    const navAnchors = document.querySelectorAll('.nav-links a');

    if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                navAnchors.forEach(a => {
                    const hash = a.getAttribute('href') || '';
                    a.classList.toggle('active', hash === `#${id}`);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach(s => spyObserver.observe(s));
    }
})();
