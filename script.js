document.addEventListener('DOMContentLoaded', () => {

    /* ═══════════════════════════════════════════════════
       1. THEME TOGGLE
    ═══════════════════════════════════════════════════ */
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });


    /* ═══════════════════════════════════════════════════
       2. HEADER SCROLL EFFECT
    ═══════════════════════════════════════════════════ */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });


    /* ═══════════════════════════════════════════════════
       3. MOBILE MENU
    ═══════════════════════════════════════════════════ */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        const bars = menuToggle.querySelectorAll('.bar');
        if (isOpen) {
            bars[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
            bars[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
        } else {
            bars[0].style.transform = '';
            bars[1].style.transform = '';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const bars = menuToggle.querySelectorAll('.bar');
            bars[0].style.transform = '';
            bars[1].style.transform = '';
        });
    });


    /* ═══════════════════════════════════════════════════
       4. PARTICLE CANVAS BACKGROUND
    ═══════════════════════════════════════════════════ */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [], mouse = { x: null, y: null, radius: 200 };
        const PARTICLE_COUNT = 100;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 0.5;
                this.color = `rgba(139, 92, 246, ${Math.random() * 0.6 + 0.2})`;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                // mouse interact (avoidance/push)
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        const pushX = forceDirectionX * force * -2;
                        const pushY = forceDirectionY * force * -2;
                        this.x += pushX;
                        this.y += pushY;
                    }
                }

                if (this.x < -50 || this.x > W + 50 || this.y < -50 || this.y > H + 50) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function init() {
            particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
        }

        function drawConstellations() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 130)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

        function loop() {
            ctx.clearRect(0, 0, W, H);
            drawConstellations();
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(loop);
        }

        window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });
        window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

        resize();
        init();
        loop();
    }


    /* ═══════════════════════════════════════════════════
       5. HACKER TEXT DECODE ANIMATION
    ═══════════════════════════════════════════════════ */
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const hackerElement = document.querySelector('.hacker-text');

    if (hackerElement) {
        const words = ['experiences.', 'applications.', 'solutions.', 'interfaces.', 'algorithms.'];
        let wordIndex = 0;

        function decodeText() {
            const currentWord = words[wordIndex];
            let iterations = 0;

            const interval = setInterval(() => {
                hackerElement.innerText = currentWord.split('')
                    .map((letter, index) => {
                        if (index < iterations) return currentWord[index];
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join('');

                if (iterations >= currentWord.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        wordIndex = (wordIndex + 1) % words.length;
                        decodeText();
                    }, 2500); // Wait before next word
                }
                iterations += 1 / 3;
            }, 30);
        }

        setTimeout(decodeText, 1200);
    }


    /* ═══════════════════════════════════════════════════
       6. SCROLL REVEAL
    ═══════════════════════════════════════════════════ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    /* ═══════════════════════════════════════════════════
       7. LOAD PROJECTS FROM JSON — PREMIUM CARDS
    ═══════════════════════════════════════════════════ */
    const projectsContainer = document.getElementById('projects-container');

    const typeIcons = {
        'Featured': '⭐',
        'Web': '🌐',
        'Mobile': '📱',
        'AI': '🤖',
        'Desktop': '🖥️',
    };

    async function loadProjects() {
        try {
            const res = await fetch('projects.json');
            if (!res.ok) throw new Error('load failed');
            const projects = await res.json();

            projectsContainer.innerHTML = '';

            projects.forEach((project, index) => {
                const tags = project.tags || (project.type ? [project.type] : ['Web']);
                const icon = typeIcons[project.type] || '💡';
                const isFeatured = project.type === 'Featured';

                const card = document.createElement('article');
                card.className = 'project-card reveal reveal-delay-' + Math.min(index % 3 + 1, 5);
                if (isFeatured) card.classList.add('featured');

                card.innerHTML = `
                    <div class="card-border"></div>
                    <div class="card-icon">${icon}</div>
                    <div class="card-content">
                        <span class="badge-type">${project.type || 'Project'}</span>
                        <div class="card-header">
                            <h3>${project.title}</h3>
                            ${isFeatured ? '<span class="badge">Featured</span>' : ''}
                        </div>
                        <p>${project.description}</p>
                        <div class="card-footer">
                            <div class="card-tags">
                                ${tags.map(t => `<span>${t}</span>`).join('')}
                            </div>
                            <div class="card-arrow">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" stroke-width="2.5"
                                     stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                `;

                // — Mouse spotlight tracking —
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                });

                // — Subtle 3D Tilt —
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const rx = ((e.clientY - cy) / (rect.height / 2)) * 4;
                    const ry = ((e.clientX - cx) / (rect.width / 2)) * -4;
                    card.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`;
                    card.style.transformStyle = 'preserve-3d';
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                    card.style.transformStyle = '';
                });

                projectsContainer.appendChild(card);
                // Trigger reveal observer on the newly created card
                revealObserver.observe(card);
            });

        } catch (err) {
            console.error('Projects load error:', err);
        }
    }

    loadProjects();


    /* ═══════════════════════════════════════════════════
       8. SMOOTH ACTIVE NAV LINK ON SCROLL
    ═══════════════════════════════════════════════════ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.style.color = 'var(--text-primary)';
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => navObserver.observe(s));


    /* ═══════════════════════════════════════════════════
       9. CUSTOM CURSOR
    ═══════════════════════════════════════════════════ */
    if (window.matchMedia('(pointer: fine)').matches) {
        const dot = document.querySelector('.cursor-dot');
        const outline = document.querySelector('.cursor-outline');
        let ox = 0, oy = 0;

        window.addEventListener('mousemove', e => {
            if (dot) {
                dot.style.left = `${e.clientX}px`;
                dot.style.top = `${e.clientY}px`;
            }
            if (outline) {
                // smooth lag
                ox += (e.clientX - ox) * 0.12;
                oy += (e.clientY - oy) * 0.12;
            }
        }, { passive: true });

        if (outline) {
            (function animateOutline() {
                outline.style.left = `${ox}px`;
                outline.style.top = `${oy}px`;
                requestAnimationFrame(animateOutline);
            })();
        }

        // Scale cursor on hoverable elements
        document.querySelectorAll('a, button, .feature-card, .project-card, .bento-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (dot) dot.classList.add('hover');
                if (outline) outline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                if (dot) dot.classList.remove('hover');
                if (outline) outline.classList.remove('hover');
            });
        });
    }


    /* ═══════════════════════════════════════════════════
       10. ANIMATED STAT COUNTER
    ═══════════════════════════════════════════════════ */
    const statNumbers = document.querySelectorAll('.stat-number');

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.trim();
            const num = parseInt(raw);
            if (isNaN(num)) return;
            const suffix = raw.replace(/[0-9]/g, '');
            let start = 0;
            const dur = 1400;
            const step = (ts) => {
                if (!start) start = ts;
                const prog = Math.min((ts - start) / dur, 1);
                const eased = 1 - Math.pow(1 - prog, 3);
                el.textContent = Math.floor(eased * num) + suffix;
                if (prog < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            countObserver.unobserve(el);
        });
    }, { threshold: 0.7 });

    statNumbers.forEach(el => countObserver.observe(el));

    /* ═══════════════════════════════════════════════════
       11. SCROLL READING PROGRESS
    ═══════════════════════════════════════════════════ */
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (docHeight > 0) ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = scrollPercent + '%';
        }, { passive: true });
    }

    /* ═══════════════════════════════════════════════════
       12. BENTO GRID 3D TILT
    ═══════════════════════════════════════════════════ */
    const bentoItems = document.querySelectorAll('.bento-item');
    bentoItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const rx = ((e.clientY - cy) / (rect.height / 2)) * 4;
            const ry = ((e.clientX - cx) / (rect.width / 2)) * -4;
            item.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });

    /* ═══════════════════════════════════════════════════
       13. MAGNETIC BUTTONS
    ═══════════════════════════════════════════════════ */
    const magneticElements = document.querySelectorAll('.btn, .social-links a, .contact-link');
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const h = rect.width / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - (rect.height / 2);
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = ``;
        });
    });

});
