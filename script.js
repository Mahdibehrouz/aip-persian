// ========================================
// Modern Persian AI Website - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // DOM Elements
    // ========================================
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const heroInput = document.getElementById('hero-input');
    const generateButton = document.getElementById('generate-button');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // ========================================
    // Sticky Header Behavior
    // ========================================
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Optimized scroll event with throttling
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        requestTick();
        ticking = false;
    });
    
    // ========================================
    // Mobile Menu Toggle
    // ========================================
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                // Transform to X
                switch(index) {
                    case 0:
                        bar.style.transform = 'translateY(7px) rotate(45deg)';
                        break;
                    case 1:
                        bar.style.opacity = '0';
                        break;
                    case 2:
                        bar.style.transform = 'translateY(-7px) rotate(-45deg)';
                        break;
                }
            } else {
                // Transform back to hamburger
                bar.style.transform = '';
                bar.style.opacity = '';
            }
        });
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // ========================================
    // Generate Button Functionality
    // ========================================
    function simulateGeneration() {
        const userInput = heroInput.value.trim();
        
        if (!userInput) {
            // Shake animation for empty input
            heroInput.style.animation = 'shake 0.5s ease-in-out';
            heroInput.focus();
            
            setTimeout(() => {
                heroInput.style.animation = '';
            }, 500);
            
            return;
        }
        
        // Add loading state
        generateButton.classList.add('loading');
        generateButton.disabled = true;
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Remove loading state and add success state
            generateButton.classList.remove('loading');
            generateButton.classList.add('success');
            
            // Show success message
            showNotification('ایده شما با موفقیت پردازش شد! 🎉', 'success');
            
            // Reset button after animation
            setTimeout(() => {
                generateButton.classList.remove('success');
                generateButton.disabled = false;
                heroInput.value = '';
            }, 2000);
            
        }, 2000);
    }
    
    if (generateButton) {
        generateButton.addEventListener('click', simulateGeneration);
    }
    
    // Handle Enter key in input field
    if (heroInput) {
        heroInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                simulateGeneration();
            }
        });
        
        // Add focus/blur effects
        heroInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        heroInput.addEventListener('blur', function() {
            this.parentElement.style.transform = '';
        });
    }
    
    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontFamily: 'Vazirmatn, sans-serif',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            direction: 'rtl'
        });
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #06d6a0, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #6366f1, #4f46e5)';
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // ========================================
    // Smooth Scrolling for Navigation Links
    // ========================================
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    // Add smooth scrolling to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                event.preventDefault();
                const targetId = href.substring(1);
                smoothScrollTo(targetId);
            }
        });
    });
    
    // ========================================
    // Intersection Observer for Animations
    // ========================================
    function createObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements that should animate on scroll
        const animateElements = document.querySelectorAll('.project-card, .about-content, .section-header');
        
        animateElements.forEach(element => {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            observer.observe(element);
        });
    }
    
    // Initialize observer when DOM is ready
    createObserver();
    
    // ========================================
    // Keyboard Navigation Support
    // ========================================
    document.addEventListener('keydown', function(event) {
        // ESC key closes mobile menu
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // Ctrl/Cmd + K opens search (focus on hero input)
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            if (heroInput) {
                heroInput.focus();
                heroInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // ========================================
    // Theme System (Optional Enhancement)
    // ========================================
    function initializeTheme() {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Initialize theme
    initializeTheme();
    
    // ========================================
    // Performance Optimizations
    // ========================================
    
    // Preload critical images
    function preloadImages() {
        const imageUrls = [
            // Add any critical image URLs here
        ];
        
        imageUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
        });
    }
    
    // Lazy load non-critical elements
    function initializeLazyLoading() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const src = element.getAttribute('data-lazy');
                        
                        if (src) {
                            element.src = src;
                            element.removeAttribute('data-lazy');
                        }
                        
                        lazyObserver.unobserve(element);
                    }
                });
            });
            
            lazyElements.forEach(element => {
                lazyObserver.observe(element);
            });
        }
    }
    
    // Initialize performance optimizations
    preloadImages();
    initializeLazyLoading();
    
    // ========================================
    // Error Handling
    // ========================================
    window.addEventListener('error', function(event) {
        console.error('JavaScript Error:', event.error);
        
        // Show user-friendly error message in Persian
        showNotification('خطایی رخ داده است. لطفاً صفحه را نوسازی کنید.', 'error');
    });
    
    // ========================================
    // Console Welcome Message
    // ========================================
    console.log(`
    🚀 وب‌سایت هوش مصنوعی پیشرفته
    
    ✨ ویژگی‌ها:
    • طراحی کاملاً RTL و فارسی
    • تم تیره مدرن
    • انیمیشن‌های نرم و زیبا
    • کاملاً ریسپانسیو
    • بهینه‌سازی شده برای عملکرد
    
    📱 کلیدهای میانبر:
    • ESC: بستن منوی موبایل
    • Ctrl/Cmd + K: فوکوس روی فیلد جستجو
    
    Made with ❤️ using Vanilla JavaScript
    `);
    
});

// ========================================
// Additional CSS Animations (Dynamic)
// ========================================

// Add shake animation to CSS dynamically
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Create and append style element
const styleElement = document.createElement('style');
styleElement.textContent = shakeKeyframes;
document.head.appendChild(styleElement);

// ========================================
// PWA Support (Future Enhancement)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker registration would go here
        // This is commented out as we haven't created a service worker file
        // navigator.serviceWorker.register('/sw.js');
    });
}