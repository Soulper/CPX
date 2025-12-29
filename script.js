document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('header');

    // Custom Cursor & Mouse Glow Tracking
    const cursor = document.querySelector('.cursor-follower');
    const hudData = document.querySelector('.hud-coordinates');

    // Smooth Mouse Tracking with Lerp
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    let glowX = 0, glowY = 0;

    const speed = 0.28; // Snappier cursor
    const glowSpeed = 0.08; // Snappier glow

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Smooth Cursor Follower
        const distX = mouseX - ballX;
        const distY = mouseY - ballY;
        ballX += distX * speed;
        ballY += distY * speed;

        // Smooth Mouse Glow (Lag behind cursor)
        const gdistX = mouseX - glowX;
        const gdistY = mouseY - glowY;
        glowX += gdistX * glowSpeed;
        glowY += gdistY * glowSpeed;

        document.documentElement.style.setProperty('--mouse-x', `${ballX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${ballY}px`);
        document.documentElement.style.setProperty('--glow-x', `${glowX}px`);
        document.documentElement.style.setProperty('--glow-y', `${glowY}px`);

        if (hudData) {
            hudData.innerText = `LOC: ${Math.round(ballX).toString().padStart(3, '0')} // ${Math.round(ballY).toString().padStart(3, '0')}`;
        }

        // Layered Parallax
        const moveX = (ballX - window.innerWidth / 2) * 0.01;
        const moveY = (ballY - window.innerHeight / 2) * 0.01;

        const heroBg = document.querySelector('.hero-bg');
        const heroMid = document.querySelector('.hero-mid');

        if (heroBg) heroBg.style.transform = `scale(1.1) translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
        if (heroMid) heroMid.style.transform = `translate(${moveX * 1.5}px, ${moveY * 1.5}px)`;

        requestAnimationFrame(animate);
    }
    animate();

    // Dynamic Card Tilt (3D Follow) - Refined for smoothness
    const cards = document.querySelectorAll('.member-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xRotation = 20 * ((y - rect.height / 2) / rect.height);
            const yRotation = -20 * ((x - rect.width / 2) / rect.width);

            card.style.setProperty('--x-rot', `${xRotation}deg`);
            card.style.setProperty('--y-rot', `${yRotation}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--x-rot', `0deg`);
            card.style.setProperty('--y-rot', `0deg`);
        });
    });

    // Click Ripples
    document.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    });

    // Decryption Hover Effect
    const decryptElements = document.querySelectorAll('[data-decrypt]');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

    decryptElements.forEach(el => {
        const originalText = el.innerText;
        let iteration = 0;
        let interval = null;

        el.addEventListener('mouseenter', () => {
            clearInterval(interval);
            interval = setInterval(() => {
                el.innerText = originalText.split('')
                    .map((char, index) => {
                        if (index < iteration) return originalText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }
                iteration += 1 / 3;
            }, 30);
        });

        el.addEventListener('mouseleave', () => {
            clearInterval(interval);
            el.innerText = originalText;
            iteration = 0;
        });
    });

    // 3D Tilt Effect for stats
    const statItems = document.querySelectorAll('.stat-item');

    statItems.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (centerY - y) / 10;
            const rotateY = (x - centerX) / 10;

            el.style.setProperty('--x-rot', `${rotateX}deg`);
            el.style.setProperty('--y-rot', `${rotateY}deg`);
        });

        el.addEventListener('mouseleave', () => {
            el.style.setProperty('--x-rot', `0deg`);
            el.style.setProperty('--y-rot', `0deg`);
        });
    });

    // Reactive Cursor
    document.querySelectorAll('a, button, .btn, .gallery-item, .stat-item, .member-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Embers Particles
    const embersContainer = document.getElementById('embers');
    if (embersContainer) {
        for (let i = 0; i < 50; i++) {
            const ember = document.createElement('div');
            ember.className = 'ember';
            const x = Math.random() * 100;
            const duration = 5 + Math.random() * 10;
            const delay = Math.random() * 5;
            ember.style.setProperty('--x', `${x}%`);
            ember.style.setProperty('--d', `${duration}s`);
            ember.style.animationDelay = `${delay}s`;
            embersContainer.appendChild(ember);
        }
    }


    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial styles for reveal elements
    const reveals = document.querySelectorAll('[data-reveal]');
    reveals.forEach(el => {
        const direction = el.getAttribute('data-reveal');
        el.style.opacity = '0';
        el.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';

        if (direction === 'bottom') el.style.transform = 'translateY(50px)';
        if (direction === 'left') el.style.transform = 'translateX(-50px)';
        if (direction === 'right') el.style.transform = 'translateX(50px)';

        observer.observe(el);
    });

    // Custom CSS for revealed state
    const style = document.createElement('style');
    style.innerHTML = `
        [data-reveal].active {
            opacity: 1 !important;
            transform: translate(0, 0) !important;
        }
    `;
    document.head.appendChild(style);

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Cascading Letter Reveals
    const charReveals = document.querySelectorAll('[data-cascade]');
    charReveals.forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${i * 0.03}s`;
            el.appendChild(span);
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    el.querySelectorAll('.char').forEach(c => c.classList.add('revealed'));
                    revealObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        revealObserver.observe(el);
    });

    // Terminal Boot Logic
    const terminalLines = document.querySelectorAll('.terminal-line');
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                terminalLines.forEach((line, i) => {
                    setTimeout(() => line.classList.add('active'), i * 800);
                });
                terminalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) terminalObserver.observe(terminalWindow);

    // Scroll-Aware HUD Status
    const hudStatus = document.querySelector('.hud-status');
    const statusMap = {
        'home': 'SYSTEM: VANGUARD_READY',
        'about': 'ANALYZING: LEGION_DATA',
        'stats': 'CALCULATING: DOMINANCE',
        'roster': 'IDENTIFYING: TARGETS',
        'logs': 'DECRYPTING: WAR_JOURNAL',
        'join': 'WAITING: RECRUITS'
    };

    window.addEventListener('scroll', () => {
        let current = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });
        if (hudStatus && statusMap[current]) {
            hudStatus.innerText = statusMap[current];
        }
    });

    // Duplicate ticker items for seamless loop
    const ticker = document.querySelector('.ticker');
    if (ticker) {
        ticker.innerHTML += ticker.innerHTML;
    }
});
