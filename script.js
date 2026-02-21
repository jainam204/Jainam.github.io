document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        menuToggle.classList.toggle('active');

        // Animate hamburger to X
        const bars = menuToggle.querySelectorAll('.bar');
        if (mobileMenu.classList.contains('open')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.transform = 'none';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.classList.remove('active');
            const bars = menuToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.transform = 'none';
        });
    });

    // --- Projects Loading ---
    const projectsContainer = document.getElementById('projects-container');

    async function loadProjects() {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) throw new Error('Failed to load projects');

            const projects = await response.json();

            // Clear loading/fallback content if fetch successful
            if (projects.length > 0) {
                projectsContainer.innerHTML = '';
            }

            projects.forEach(project => {
                const card = document.createElement('article');
                card.className = 'project-card';

                // Determine tags based on description or type if not explicit
                // Use project.tags if available, otherwise fallback to type
                const tags = project.tags || (project.type ? [project.type] : ['Web']);

                card.innerHTML = `
                    <div class="card-border"></div>
                    <div class="card-content">
                        <div class="card-header">
                            <h3>${project.title}</h3>
                            ${project.type === 'Featured' ? '<span class="badge">Featured</span>' : ''}
                        </div>
                        <p>${project.description}</p>
                        <div class="card-tags">
                            ${tags.map(tag => `<span>${tag}</span>`).join('')}
                        </div>
                    </div>
                `;

                // Add Spotlight Effect
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                });

                projectsContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading projects:', error);
            // Fallback content is already in HTML
        }
    }

    loadProjects();

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .project-card, .bento-item, .feature-card').forEach(el => {
        el.style.opacity = '0'; // Initial state
        el.classList.add('fade-in-up'); // Add class to trigger animation when visible
        // Actually, let's do it properly: remove the class first, then add it via observer
        el.classList.remove('fade-in-up');
        observer.observe(el);
    });

    // --- Custom Cursor (Optional) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            if (cursorDot) {
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;
            }

            if (cursorOutline) {
                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 500, fill: "forwards" });
            }
        });
    }
});
