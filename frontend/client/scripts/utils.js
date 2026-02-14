// Utility Functions Module
const Utils = (() => {
    // Create element with class
    const createElement = (tag, className = '', html = '') => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (html) el.innerHTML = html;
        return el;
    };

    // Fade out element
    const fadeOut = (element, duration = 300) => {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.pointerEvents = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.opacity = '0';
    };

    // Fade in element
    const fadeIn = (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in`;
        element.style.pointerEvents = 'auto';
        element.offsetHeight; // Trigger reflow
        element.style.opacity = '1';
    };

    // Slide element
    const slide = (element, direction = 'down', duration = 300) => {
        const distance = element.offsetHeight;
        const transform = direction === 'down' ? `translateY(${distance}px)` : 'translateY(0)';
        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transform = transform;
    };

    // Add class with animation
    const addClass = (element, className, animate = false) => {
        if (animate) fadeOut(element, 150);
        setTimeout(() => {
            element.classList.add(className);
            if (animate) fadeIn(element, 150);
        }, animate ? 150 : 0);
    };

    // Remove class with animation
    const removeClass = (element, className, animate = false) => {
        if (animate) fadeOut(element, 150);
        setTimeout(() => {
            element.classList.remove(className);
            if (animate) fadeIn(element, 150);
        }, animate ? 150 : 0);
    };

    // Toggle class
    const toggleClass = (element, className, force) => {
        element.classList.toggle(className, force);
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Throttle function
    const throttle = (func, limit) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Query selector (shorthand)
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    // Check if element exists
    const exists = (selector) => document.querySelector(selector) !== null;

    // Clone element
    const clone = (element) => element.cloneNode(true);

    // Get element data attributes
    const getData = (element) => {
        return { ...element.dataset };
    };

    // Set multiple attributes
    const setAttributes = (element, attrs) => {
        Object.entries(attrs).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    };

    // Add event listener with cleanup
    const on = (element, event, handler) => {
        if (element.addEventListener) {
            element.addEventListener(event, handler);
        }
    };

    // Remove event listener
    const off = (element, event, handler) => {
        if (element.removeEventListener) {
            element.removeEventListener(event, handler);
        }
    };

    // One-time event listener
    const once = (element, event, handler) => {
        const wrapper = (...args) => {
            handler(...args);
            off(element, event, wrapper);
        };
        on(element, event, wrapper);
    };

    // Get scroll position
    const getScrollPosition = () => {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    };

    // Scroll to top
    const scrollToTop = (smooth = true) => {
        window.scrollTo({
            top: 0,
            behavior: smooth ? 'smooth' : 'auto'
        });
    };

    // Check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // Validate email
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Validate phone
    const isValidPhone = (phone) => {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    return {
        createElement,
        fadeOut,
        fadeIn,
        slide,
        addClass,
        removeClass,
        toggleClass,
        formatDate,
        formatTime,
        debounce,
        throttle,
        $,
        $$,
        exists,
        clone,
        getData,
        setAttributes,
        on,
        off,
        once,
        getScrollPosition,
        scrollToTop,
        isInViewport,
        isValidEmail,
        isValidPhone
    };
})();
