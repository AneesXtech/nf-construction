document.addEventListener('DOMContentLoaded', () => {
    
    // Sticky Header & Active Nav Links
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.header .nav-link');
    
    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Nav Links
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Sidebar Logic
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('mobile-sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    sidebarLinks.forEach(link => link.addEventListener('click', closeSidebar));

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };
    
    // Trigger once on load
    revealOnScroll();
    
    // Trigger on scroll
    window.addEventListener('scroll', revealOnScroll);
    
    // Form submission handling (prevent default for demo)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you! Your message has been sent successfully.');
            form.reset();
        });
    });

    // Position-Aware Button Hover (Aurox-style)
    const hoverButtons = document.querySelectorAll('.btn');
    hoverButtons.forEach(btn => {
        const hoverBg = btn.querySelector('.btn-hover-bg');
        if (!hoverBg) return;

        btn.addEventListener('mouseenter', (e) => {
            const rect = btn.getBoundingClientRect();
            hoverBg.style.left = (e.clientX - rect.left) + 'px';
            hoverBg.style.top = (e.clientY - rect.top) + 'px';
        });

        btn.addEventListener('mouseleave', (e) => {
            const rect = btn.getBoundingClientRect();
            hoverBg.style.left = (e.clientX - rect.left) + 'px';
            hoverBg.style.top = (e.clientY - rect.top) + 'px';
        });
    });

    // ─── Testimonials Carousel ────────────────────────────────
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let currentIndex = 0;
        let visibleCards = 3;
        const gap = 24; // 1.5rem = 24px

        // Determine visible cards based on screen width
        function getVisibleCards() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        // Calculate total "pages" (dot count)
        function getMaxIndex() {
            return Math.max(0, totalCards - visibleCards);
        }

        // Build dots
        function buildDots() {
            dotsContainer.innerHTML = '';
            const maxIndex = getMaxIndex();
            const dotCount = maxIndex + 1;
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            }
        }

        // Slide to index
        function goTo(index) {
            const maxIndex = getMaxIndex();
            currentIndex = Math.max(0, Math.min(index, maxIndex));

            const wrapperWidth = track.parentElement.offsetWidth;
            const cardWidth = (wrapperWidth - gap * (visibleCards - 1)) / visibleCards;
            const offset = currentIndex * (cardWidth + gap);

            track.style.transform = `translateX(-${offset}px)`;

            // Update dots
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });

            // Update arrow states
            prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            nextBtn.style.opacity = currentIndex === maxIndex ? '0.4' : '1';
            nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
        }

        // Arrow clicks
        prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
        nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

        // Initialize
        function initCarousel() {
            visibleCards = getVisibleCards();
            if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
            buildDots();
            goTo(currentIndex);
        }

        initCarousel();

        // Recalculate on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(initCarousel, 200);
        });

        // Touch / Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goTo(currentIndex + 1);  // swipe left
                else goTo(currentIndex - 1);             // swipe right
            }
        }, { passive: true });
    }
});
