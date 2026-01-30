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
    // Scroll Animations (Reveal)
    const revealSelectors = [
        '.section-header',
        '.solution-card',
        '.insight-card-new', /* Updated from insight-card */
        '.hero h1', '.hero p', '.hero-btns',
        '.about-highlight', '.about-desc', '.about-philosophy', '.about-differentiation', '.about-closing', '.about-final'
    ];

    const revealElements = document.querySelectorAll(revealSelectors.join(', '));

    // Staggering Logic for Groups
    const staggeredGroups = ['.solutions-grid', '.insights-grid', '.about-content'];
    staggeredGroups.forEach(groupSelector => {
        const group = document.querySelector(groupSelector);
        if (group) {
            const children = group.querySelectorAll('.solution-card, .insight-card-new, .about-desc, .about-highlight, .about-philosophy, .about-differentiation');
            children.forEach((child, index) => {
                child.style.transitionDelay = `${index * 0.1}s`;
            });
        }
    });

    // Add reveal class to elements
    revealElements.forEach(el => el.classList.add('reveal'));

    // Floating Effect for Headings
    document.querySelectorAll('.section-title').forEach(el => {
        el.classList.add('floating-element');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Admin Visibility & Session Logic
    const sessionAuth = sessionStorage.getItem('adminAuth') === 'true';
    const loginSuccess = sessionStorage.getItem('loginSuccess') === 'true';
    const logoutSuccess = sessionStorage.getItem('logoutSuccess') === 'true';
    const toast = document.getElementById('toast');

    // Helper: Show Toast
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    if (sessionAuth) {
        // Show Admin UI
        document.querySelectorAll('.admin-only').forEach(el => {
            if (el.tagName === 'LI') el.style.display = 'block';
            else if (el.tagName === 'BUTTON') el.style.display = 'inline-block';
            else el.style.display = 'block';
        });

        // Show Logged In Toast (One-time)
        if (loginSuccess) {
            showToast('관리자님 로그인되었습니다');
            sessionStorage.removeItem('loginSuccess');
        }
    }

    // Show Logged Out Toast (One-time)
    if (logoutSuccess) {
        showToast('로그아웃 되었습니다');
        sessionStorage.removeItem('logoutSuccess');
    }

    // Logout Logic
    const logoutBtns = document.querySelectorAll('#logoutBtnNav, #logoutBtnMobile');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('adminAuth');
            // Check if we are on a protected page
            const protectedPages = ['admin_dashboard.html', 'insight_write.html'];
            const currentPage = window.location.pathname.split('/').pop();

            sessionStorage.setItem('logoutSuccess', 'true');

            if (protectedPages.includes(currentPage)) {
                window.location.href = 'index.html';
            } else {
                window.location.reload();
            }
        });
    });
});
