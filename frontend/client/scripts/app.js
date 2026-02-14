// Main App Module - Vanilla JavaScript Application Framework
const App = (() => {
    const config = {
        apiBase: 'http://localhost:8000',
        animationDuration: 300,
        toastDuration: 3000,
    };

    // Initialize app
    const init = () => {
        console.log('🚀 App initialized');
        setupGlobalEventListeners();
        setupScrollAnimations();
        setupFormHandlers();
        setupButtonHandlers();
        loadDynamicContent();
    };

    // Global event listeners
    const setupGlobalEventListeners = () => {
        // Close modals on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Modal.closeAll();
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });
    };

    // Smooth scroll handler
    const handleSmoothScroll = (e) => {
        const href = e.target.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            return;
        }
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Scroll animations
    const setupScrollAnimations = () => {
        let lastScrollY = 0;
        let ticking = false;

        const updateScrollAnimations = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;
            
            // Update scroll progress bar
            const progressBar = document.querySelector('.scroll-progress');
            if (progressBar) {
                progressBar.style.width = scrollPercentage + '%';
            }
            
            // Apply parallax effect
            const headerVideo = document.querySelector('header video');
            if (headerVideo) {
                headerVideo.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
            
            // Scroll direction detection
            const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
            if (scrollDirection === 'down' && scrollY > lastScrollY + 5) {
                document.body.classList.add('scrolling-down');
                document.body.classList.remove('scrolling-up');
            } else if (scrollDirection === 'up' && scrollY < lastScrollY - 5) {
                document.body.classList.add('scrolling-up');
                document.body.classList.remove('scrolling-down');
            }
            
            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        });
    };

    // Setup form handlers
    const setupFormHandlers = () => {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
        });
    };

    // Form submission handler
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            Toast.show('Message sent successfully!', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1000);
    };

    // Setup button handlers
    const setupButtonHandlers = () => {
        // Enrollment buttons
        document.querySelectorAll('[data-action="enroll"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const program = e.target.closest('[data-program]')?.dataset.program;
                Modal.open('enrollModal', { program });
            });
        });

        // Modal close buttons
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) Modal.close(modal.id);
            });
        });

        // Filter buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', handleFilter);
        });
    };

    // Filter handler
    const handleFilter = (e) => {
        const filter = e.target.dataset.filter;
        document.querySelectorAll('[data-category]').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                Utils.fadeIn(item);
            } else {
                Utils.fadeOut(item);
            }
        });
        
        // Update active filter button
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
    };

    // Load dynamic content
    const loadDynamicContent = () => {
        // This can be expanded to load content from API
        console.log('Loading dynamic content...');
    };

    return {
        init,
        config,
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
