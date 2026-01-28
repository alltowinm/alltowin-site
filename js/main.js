document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll header effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            header.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const body = document.body;

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuOverlay.classList.toggle('active');
            // Toggle body scroll lock
            if (menuOverlay.classList.contains('active')) {
                body.style.overflow = 'hidden';
                menuBtn.innerHTML = '<i class="ri-close-line"></i>';
                menuBtn.style.color = '#fff';
            } else {
                body.style.overflow = 'auto';
                menuBtn.innerHTML = '<i class="ri-menu-3-line"></i>';
                menuBtn.style.color = 'var(--text-primary)';
            }
        });

        // Close menu when link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                body.style.overflow = 'auto';
                menuBtn.innerHTML = '<i class="ri-menu-3-line"></i>';
                menuBtn.style.color = 'var(--text-primary)';
            });
        });
    }

    // Scroll Animations (Reveal)
    const revealElements = document.querySelectorAll('.section-header, .solution-card, .insight-card, .hero h1, .hero p, .hero-btns');

    // Add reveal class to elements
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
});
