// ========================================
// Aloatar Store - JavaScript Functionality
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Hero Slider Functionality
    // ========================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Event listeners for slider navigation
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-play slider
    setInterval(nextSlide, 5000);
    
    // ========================================
    // Product Carousel Functionality
    // ========================================
    const productCarousel = document.querySelector('.products-carousel');
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    
    if (carouselPrev && carouselNext && productCarousel) {
        carouselPrev.addEventListener('click', () => {
            productCarousel.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
        
        carouselNext.addEventListener('click', () => {
            productCarousel.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
    }
    
    // ========================================
    // Shopping Cart Functionality
    // ========================================
    let cart = JSON.parse(localStorage.getItem('aloatar_cart')) || [];
    
    function updateCartDisplay() {
        const cartBadge = document.querySelector('.cart-btn .badge');
        if (cartBadge) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems || '۰';
        }
    }
    
    function addToCart(productId, productName, productPrice, productImage) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        localStorage.setItem('aloatar_cart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification('محصول به سبد خرید اضافه شد', 'success');
    }
    
    // Add to cart button functionality
    document.querySelectorAll('.add-to-cart').forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImage = productCard.querySelector('img').src;
            const productId = `product_${index + 1}`;
            
            addToCart(productId, productName, productPrice, productImage);
            
            // Add animation to button
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
    
    // ========================================
    // Wishlist Functionality
    // ========================================
    let wishlist = JSON.parse(localStorage.getItem('aloatar_wishlist')) || [];
    
    function updateWishlistDisplay() {
        const wishlistBadge = document.querySelector('.header-action .badge');
        if (wishlistBadge) {
            wishlistBadge.textContent = wishlist.length || '۰';
        }
    }
    
    function toggleWishlist(productId, productName, productPrice, productImage) {
        const existingIndex = wishlist.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            wishlist.splice(existingIndex, 1);
            showNotification('محصول از علاقه‌مندی‌ها حذف شد', 'info');
        } else {
            wishlist.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
            showNotification('محصول به علاقه‌مندی‌ها اضافه شد', 'success');
        }
        
        localStorage.setItem('aloatar_wishlist', JSON.stringify(wishlist));
        updateWishlistDisplay();
    }
    
    // Wishlist button functionality
    document.querySelectorAll('.btn-icon').forEach((button, index) => {
        if (button.querySelector('.fa-heart')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const productCard = button.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.current-price').textContent;
                const productImage = productCard.querySelector('img').src;
                const productId = `product_${index + 1}`;
                
                toggleWishlist(productId, productName, productPrice, productImage);
                
                // Toggle heart icon
                const heartIcon = button.querySelector('i');
                if (heartIcon.classList.contains('fas')) {
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                } else {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                }
            });
        }
    });
    
    // ========================================
    // Search Functionality
    // ========================================
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // In a real application, this would redirect to search results
                showNotification(`جستجو برای: ${searchTerm}`, 'info');
                // window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
    
    // ========================================
    // Newsletter Subscription
    // ========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Simulate newsletter subscription
                showNotification('با موفقیت در خبرنامه عضو شدید!', 'success');
                emailInput.value = '';
            }
        });
    }
    
    // ========================================
    // Smooth Scrolling
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ========================================
    // Sticky Header
    // ========================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontFamily: 'Vazirmatn, sans-serif',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            direction: 'rtl',
            minWidth: '200px',
            textAlign: 'center'
        });
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #2d5016, #4a7c59)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #d32f2f, #c62828)';
                break;
            case 'info':
                notification.style.background = 'linear-gradient(135deg, #6b8e23, #2d5016)';
                break;
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
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
    // Product Image Hover Effects
    // ========================================
    document.querySelectorAll('.product-card').forEach(card => {
        const productActions = card.querySelector('.product-actions');
        
        card.addEventListener('mouseenter', () => {
            if (productActions) {
                productActions.style.opacity = '1';
                productActions.style.transform = 'translateY(0)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (productActions) {
                productActions.style.opacity = '0';
                productActions.style.transform = 'translateY(10px)';
            }
        });
    });
    
    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // ========================================
    // Initialize Functions
    // ========================================
    function init() {
        updateCartDisplay();
        updateWishlistDisplay();
        
        // Add loading animation to images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        });
        
        console.log('🌿 آلوتار - فروشگاه محصولات ارگانیک و طبیعی');
        console.log('✅ سیستم سبد خرید فعال');
        console.log('✅ سیستم علاقه‌مندی‌ها فعال');
        console.log('✅ اسلایدر محصولات فعال');
    }
    
    // Initialize the store
    init();
    
});

// ========================================
// Global Functions
// ========================================

// Quick add to cart function for external use
window.quickAddToCart = function(productId, productName, productPrice, productImage) {
    const cart = JSON.parse(localStorage.getItem('aloatar_cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    localStorage.setItem('aloatar_cart', JSON.stringify(cart));
    
    // Update badge if exists
    const cartBadge = document.querySelector('.cart-btn .badge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems || '۰';
    }
};

// Get cart total function
window.getCartTotal = function() {
    const cart = JSON.parse(localStorage.getItem('aloatar_cart')) || [];
    return cart.reduce((total, item) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        return total + (price * item.quantity);
    }, 0);
};