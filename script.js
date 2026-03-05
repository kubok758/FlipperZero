document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== SCROLL PROGRESS BAR =====
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = percent + '%';
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ===== CURSOR GLOW (desktop only) =====
    const cursorGlow = document.getElementById('cursorGlow');
    if (!isMobile && !isTouch) {
        let mouseX = -500, mouseY = -500;
        let cursorX = -500, cursorY = -500;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            const ease = 0.12;
            cursorX += (mouseX - cursorX) * ease;
            cursorY += (mouseY - cursorY) * ease;
            cursorGlow.style.left = cursorX + 'px';
            cursorGlow.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // ===== PARTICLES (reduced on mobile) =====
    const particlesContainer = document.getElementById('heroParticles');
    const particleCount = isMobile ? 15 : 50;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 10 + 6) + 's';
        p.style.animationDelay = (Math.random() * 12) + 's';
        const size = (Math.random() * 2.5 + 0.5) + 'px';
        p.style.width = size;
        p.style.height = size;
        particlesContainer.appendChild(p);
    }

    // ===== HERO TECH LINES (reduced on mobile) =====
    const techLinesContainer = document.getElementById('heroTechLines');
    const lineCount = isMobile ? 4 : 8;
    for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('div');
        line.classList.add('tech-line');
        if (i < 5) {
            line.classList.add('horizontal');
            line.style.top = (10 + Math.random() * 80) + '%';
        } else {
            line.classList.add('vertical');
            line.style.left = (10 + Math.random() * 80) + '%';
        }
        line.style.setProperty('--duration', (6 + Math.random() * 10) + 's');
        line.style.setProperty('--delay', (Math.random() * 8) + 's');
        techLinesContainer.appendChild(line);
    }

    // ===== TICKER DUPLICATE =====
    const tickerTrack = document.getElementById('tickerTrack');
    if (tickerTrack) {
        tickerTrack.innerHTML += tickerTrack.innerHTML;
    }

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ===== GSAP =====
    gsap.registerPlugin(ScrollTrigger);

    // ===== HERO ENTRANCE TIMELINE =====
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
        .fromTo('.hero-image-wrapper',
            { opacity: 0, scale: 0.85, rotate: -5 },
            { opacity: 1, scale: 1, rotate: 0, duration: 1.2 }, 0.2)
        .fromTo('.hero-tag',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 }, 0.5)
        .fromTo('.hero-title .title-line-inner',
            { yPercent: 110 },
            { yPercent: 0, duration: 1, stagger: 0.15 }, 0.6)
        .fromTo('.hero-subtitle',
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.8 }, 1)
        .fromTo('.hero-btn',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7 }, 1.2)
        .fromTo('.scroll-indicator',
            { opacity: 0 },
            { opacity: 1, duration: 0.6 }, 1.5);

    // mark hero reveals as visible so ScrollTrigger doesn't re-animate
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));

    // ===== HERO MOUSE PARALLAX (desktop only) =====
    const heroContent = document.querySelector('.hero-content');
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    const heroBg = document.querySelector('.hero-bg-effects');

    if (!isMobile && !isTouch) {
        document.querySelector('.hero').addEventListener('mousemove', (e) => {
            const rect = heroContent.getBoundingClientRect();
            const cx = (e.clientX - rect.left) / rect.width - 0.5;
            const cy = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(heroImageWrapper, {
                x: cx * 25,
                y: cy * 20,
                rotateY: cx * 5,
                rotateX: -cy * 5,
                duration: 0.8,
                ease: 'power2.out'
            });

            gsap.to(heroBg, {
                x: cx * -15,
                y: cy * -10,
                duration: 1,
                ease: 'power2.out'
            });
        });
    }

    // ===== SCROLL PARALLAX (lighter on mobile) =====
    if (!isMobile) {
        gsap.to('.hero-image-wrapper', {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
        });

        gsap.to('.hero-bg-effects', {
            yPercent: 25,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
        });
    }

    gsap.to('.hero-text', {
        yPercent: isMobile ? -5 : -10,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
    });

    // ===== REVEAL ON SCROLL =====
    const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    document.querySelectorAll(revealSelectors).forEach((el) => {
        if (el.closest('.hero')) return;

        const parent = el.closest('.about-cards, .functions-grid, .community-grid, .internals-info, .kit-details');
        let stagger = 0;
        if (parent) {
            const siblings = Array.from(parent.querySelectorAll(revealSelectors));
            stagger = siblings.indexOf(el) * (isMobile ? 0.04 : 0.08);
        }

        const dist = isMobile ? 30 : 60;
        const fromVars = { opacity: 0 };
        const toVars = { opacity: 1, duration: isMobile ? 0.6 : 0.9, delay: stagger, ease: 'power3.out' };

        if (el.classList.contains('reveal-left')) {
            fromVars.x = -dist;
            toVars.x = 0;
        } else if (el.classList.contains('reveal-right')) {
            fromVars.x = dist;
            toVars.x = 0;
        } else if (el.classList.contains('reveal-scale')) {
            fromVars.scale = 0.95;
            toVars.scale = 1;
        } else {
            fromVars.y = isMobile ? 25 : 50;
            toVars.y = 0;
        }

        toVars.scrollTrigger = {
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => el.classList.add('visible')
        };

        gsap.fromTo(el, fromVars, toVars);
    });

    // ===== SECTION LINES SCALE IN =====
    gsap.utils.toArray('.section-line').forEach(line => {
        gsap.fromTo(line,
            { scaleX: 0, transformOrigin: 'left center' },
            {
                scaleX: 1,
                duration: 0.9,
                ease: 'power2.out',
                scrollTrigger: { trigger: line, start: 'top 90%', once: true }
            }
        );
    });

    // ===== FRAME CORNERS ANIMATE IN =====
    gsap.utils.toArray('.image-frame').forEach(frame => {
        const corners = frame.querySelectorAll('.frame-corner');
        gsap.fromTo(corners,
            { opacity: 0, scale: 0 },
            {
                opacity: 0.7,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(2)',
                scrollTrigger: { trigger: frame, start: 'top 85%', once: true }
            }
        );
    });

    // ===== SECTION TAGS SLIDE IN =====
    gsap.utils.toArray('.section-tag').forEach(tag => {
        gsap.fromTo(tag,
            { opacity: 0, x: -30 },
            {
                opacity: 0.8,
                x: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: tag, start: 'top 90%', once: true }
            }
        );
    });

    // ===== SECTION DIVIDER ANIMATIONS =====
    gsap.utils.toArray('.section-divider').forEach(div => {
        gsap.fromTo(div,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1,
                scrollTrigger: { trigger: div, start: 'top 90%', once: true }
            }
        );
    });

    // ===== IMAGE PARALLAX IN SECTIONS (desktop only) =====
    if (!isMobile) {
        gsap.utils.toArray('.about-image, .internals-image, .module-image, .kit-image').forEach(img => {
            gsap.to(img, {
                yPercent: -6,
                ease: 'none',
                scrollTrigger: {
                    trigger: img,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        });
    }

    // ===== 3D TILT EFFECT ON CARDS (desktop only) =====
    if (!isMobile && !isTouch) {
        function addTilt(selector, intensity = 4) {
            document.querySelectorAll(selector).forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;
                    const rx = ((y - cy) / cy) * -intensity;
                    const ry = ((x - cx) / cx) * intensity;

                    gsap.to(card, {
                        rotateX: rx,
                        rotateY: ry,
                        transformPerspective: 800,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                });
            });
        }

        addTilt('.func-card', 5);
        addTilt('.community-card', 4);
        addTilt('.about-card', 3);
    }

    // ===== CURSOR GLOW ON COMMUNITY CARDS (desktop only) =====
    if (!isMobile && !isTouch) {
        document.querySelectorAll('.community-card').forEach(card => {
            const glow = card.querySelector('.community-card-glow');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                glow.style.left = (e.clientX - rect.left - rect.width) + 'px';
                glow.style.top = (e.clientY - rect.top - rect.height) + 'px';
            });
        });
    }

    // ===== TOUCH FEEDBACK (mobile) =====
    if (isTouch) {
        const touchTargets = '.func-card, .community-card, .about-card, .internals-card, .kit-item, .hero-btn';
        document.querySelectorAll(touchTargets).forEach(el => {
            el.addEventListener('touchstart', (e) => {
                const rect = el.getBoundingClientRect();
                const touch = e.touches[0];
                const x = ((touch.clientX - rect.left) / rect.width * 100);
                const y = ((touch.clientY - rect.top) / rect.height * 100);
                el.style.setProperty('--tap-x', x + '%');
                el.style.setProperty('--tap-y', y + '%');
                el.classList.add('touch-active');
            }, { passive: true });

            el.addEventListener('touchend', () => {
                setTimeout(() => el.classList.remove('touch-active'), 150);
            }, { passive: true });
        });

        // tap-to-focus on images: subtle glow on tap
        document.querySelectorAll('.image-frame').forEach(frame => {
            frame.addEventListener('touchstart', () => {
                frame.classList.add('touch-focus');
                const glow = frame.querySelector('.image-glow');
                if (glow) glow.style.opacity = '0.18';
            }, { passive: true });

            frame.addEventListener('touchend', () => {
                setTimeout(() => {
                    frame.classList.remove('touch-focus');
                    const glow = frame.querySelector('.image-glow');
                    if (glow) glow.style.opacity = '';
                }, 400);
            }, { passive: true });
        });
    }

    // ===== HOTSPOT TAP (mobile toggle) =====
    document.querySelectorAll('.hotspot').forEach(spot => {
        spot.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasActive = spot.classList.contains('active');
            document.querySelectorAll('.hotspot.active').forEach(s => s.classList.remove('active'));
            if (!wasActive) spot.classList.add('active');
        });
    });
    // close hotspots on outside tap
    document.addEventListener('click', () => {
        document.querySelectorAll('.hotspot.active').forEach(s => s.classList.remove('active'));
    });

    // ===== EXPANDABLE FUNC CARDS =====
    document.querySelectorAll('.func-card-expand').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.func-card');
            const wasExpanded = card.classList.contains('expanded');
            // on mobile: close others first (accordion)
            if (isMobile && !wasExpanded) {
                document.querySelectorAll('.func-card.expanded').forEach(c => c.classList.remove('expanded'));
            }
            card.classList.toggle('expanded');
        });
    });

    // on mobile, whole card tap toggles expand
    if (isMobile) {
        document.querySelectorAll('.func-card').forEach(card => {
            card.addEventListener('click', () => {
                const wasExpanded = card.classList.contains('expanded');
                document.querySelectorAll('.func-card.expanded').forEach(c => c.classList.remove('expanded'));
                if (!wasExpanded) card.classList.add('expanded');
            });
        });
    }

    // ===== INTERNALS CARDS STAGGER =====
    const internalsCards = gsap.utils.toArray('.internals-card');
    internalsCards.forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, x: -40 },
            {
                opacity: 1,
                x: 0,
                duration: 0.7,
                delay: i * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    once: true,
                    onEnter: () => card.classList.add('visible')
                }
            }
        );
    });

    // ===== KIT ITEMS STAGGER =====
    const kitItems = gsap.utils.toArray('.kit-item');
    kitItems.forEach((item, i) => {
        gsap.fromTo(item,
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: i * 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    once: true,
                    onEnter: () => item.classList.add('visible')
                }
            }
        );
    });

    // ===== MODULE ITEMS SLIDE IN =====
    gsap.utils.toArray('.module-item').forEach((item, i) => {
        const isReverse = item.classList.contains('reverse');
        const xDist = isMobile ? 30 : 80;
        gsap.fromTo(item.querySelector('.module-image-wrap'),
            { opacity: 0, x: isMobile ? 0 : (isReverse ? xDist : -xDist), y: isMobile ? 25 : 0 },
            {
                opacity: 1, x: 0, y: 0, duration: isMobile ? 0.6 : 1,
                ease: 'power3.out',
                scrollTrigger: { trigger: item, start: 'top 85%', once: true }
            }
        );
        gsap.fromTo(item.querySelector('.module-info'),
            { opacity: 0, x: isMobile ? 0 : (isReverse ? -xDist * 0.75 : xDist * 0.75), y: isMobile ? 20 : 0 },
            {
                opacity: 1, x: 0, y: 0, duration: isMobile ? 0.6 : 1, delay: 0.1,
                ease: 'power3.out',
                scrollTrigger: { trigger: item, start: 'top 85%', once: true }
            }
        );
    });

    // ===== FUNC CARDS STAGGERED ENTRANCE =====
    const funcCards = gsap.utils.toArray('.func-card');
    funcCards.forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: isMobile ? 30 : 60, scale: isMobile ? 1 : 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: isMobile ? 0.5 : 0.8,
                delay: isMobile ? i * 0.06 : (i % 3) * 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    once: true,
                    onEnter: () => card.classList.add('visible')
                }
            }
        );
    });

    // ===== COMMUNITY CARDS STAGGERED ENTRANCE =====
    const commCards = gsap.utils.toArray('.community-card');
    commCards.forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: isMobile ? 25 : 50, scale: isMobile ? 1 : 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: isMobile ? 0.5 : 0.8,
                delay: isMobile ? i * 0.06 : (i % 2) * 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    once: true,
                    onEnter: () => card.classList.add('visible')
                }
            }
        );
    });

    // ===== SMOOTH ANCHOR SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = isMobile ? 60 : 80;
                const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });

    // ===== NAVBAR ACTIVE LINK SYNC =====
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 160;
        let currentId = '';

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) {
                currentId = section.getAttribute('id');
            }
        });

        navAnchors.forEach(link => {
            link.classList.toggle('active-link', link.getAttribute('href') === '#' + currentId);
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ===== FOOTER ENTRANCE =====
    gsap.fromTo('.footer-content',
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { trigger: '.footer', start: 'top 90%', once: true }
        }
    );
});
