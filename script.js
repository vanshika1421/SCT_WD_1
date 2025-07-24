// Loading Screen
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// Optimized scroll handler with throttling
let scrollTimeout;
function handleScroll() {
    const navbar = document.getElementById('navbar');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Scroll to top button visibility
    const scrollTopBtn = document.querySelector('.scroll-to-top');
    if (scrollTopBtn) {
        if (scrollPosition > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
    
    // Parallax effect
    const parallax = document.querySelector('.hero');
    if (parallax) {
        const speed = scrollPosition * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
}

// Throttled scroll event listener
window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            handleScroll();
            scrollTimeout = null;
        }, 10);
    }
});

// Enhanced Hero Slider with Indicators
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }
    
    init() {
        this.setupIndicators();
        this.startSlider();
    }
    
    setupIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    }
    
    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        this.indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.showSlide(this.currentSlide);
        this.restartSlider();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
    
    startSlider() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    restartSlider() {
        clearInterval(this.slideInterval);
        this.startSlider();
    }
    
    stopSlider() {
        clearInterval(this.slideInterval);
    }
}

// Stats Counter Animation
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.started = false;
        this.init();
    }
    
    init() {
        this.observeCounters();
    }
    
    observeCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.started) {
                    this.started = true;
                    this.startCounting();
                }
            });
        });
        
        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    startCounting() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            updateCounter();
        });
    }
}

// Enhanced Shopping Cart with Local Storage
class ShoppingCart {
    constructor() {
        this.items = this.loadFromStorage() || [];
        this.cartCount = document.querySelector('.cart-count');
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateCartDisplay();
    }
    
    loadFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('stylehub-cart')) || [];
        } catch (e) {
            return [];
        }
    }
    
    saveToStorage() {
        localStorage.setItem('stylehub-cart', JSON.stringify(this.items));
    }
    
    setupEventListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart(e.target);
            });
        });
    }
    
    addToCart(button) {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Try to get current-price first (New Arrivals), then fallback to price (Editor's Pick)
        let priceElement = productCard.querySelector('.current-price');
        if (!priceElement) {
            priceElement = productCard.querySelector('.price');
        }
        const productPrice = priceElement.textContent;
        
        const productImage = productCard.querySelector('img').src;
        
        // Try to get brand (New Arrivals), fallback to empty string (Editor's Pick)
        const brandElement = productCard.querySelector('.brand');
        const productBrand = brandElement ? brandElement.textContent : 'StyleHub';
        
        const existingItem = this.items.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const item = {
                id: Date.now(),
                name: productName,
                price: productPrice,
                image: productImage,
                brand: productBrand,
                quantity: 1
            };
            this.items.push(item);
        }
        
        this.saveToStorage();
        this.updateCartDisplay();
        this.showAddToCartAnimation(button);
        // Item added to cart
        this.addCartBounceEffect();
    }
    
    updateCartDisplay() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            this.cartCount.style.display = 'flex';
        } else {
            this.cartCount.style.display = 'none';
        }
    }
    
    addCartBounceEffect() {
        const cart = document.querySelector('.cart');
        cart.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cart.style.transform = 'scale(1)';
        }, 200);
    }
    
    showAddToCartAnimation(button) {
        const originalText = button.textContent;
        const originalBg = button.style.background;
        
        button.textContent = '✓ Added!';
        button.style.background = 'var(--success)';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBg;
            button.disabled = false;
        }, 2000);
    }
}

// Wishlist Functionality
class Wishlist {
    constructor() {
        this.items = [];
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
        wishlistButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleWishlist(e.target);
            });
        });
    }
    
    toggleWishlist(button) {
        const productCard = button.closest('.product-card');
        const productId = productCard.dataset.id || Date.now();
        
        if (button.classList.contains('active')) {
            this.removeFromWishlist(productId);
            button.classList.remove('active');
            button.style.color = '#333';
            // Removed from wishlist
        } else {
            this.addToWishlist(productCard, productId);
            button.classList.add('active');
            button.style.color = '#ff6b6b';
            // Added to wishlist
        }
    }
    
    addToWishlist(productCard, productId) {
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productImage = productCard.querySelector('img').src;
        
        const item = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage
        };
        
        this.items.push(item);
    }
    
    removeFromWishlist(productId) {
        this.items = this.items.filter(item => item.id !== productId);
    }
}

// Smooth Scrolling for Navigation Links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log('Navigation clicked:', targetId);
            
            // Special handling for orders page
            if (targetId === '#orders') {
                showOrdersPage();
                return;
            }
            
            // Show all main sections when navigating away from orders
            showMainSections();
            
            // Small delay to ensure sections are visible before scrolling
            setTimeout(() => {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    console.log('Scrolled to:', targetId);
                } else {
                    console.log('Target section not found:', targetId);
                }
            }, 100);
        });
    });
}

// Function to show main sections (hide orders page)
function showMainSections() {
    console.log('Showing main sections...');
    
    // Force hide orders section with multiple methods
    const ordersSection = document.getElementById('orders');
    if (ordersSection) {
        ordersSection.style.cssText = 'display: none !important; visibility: hidden !important;';
        ordersSection.classList.add('hidden');
        ordersSection.classList.remove('visible');
    }
    
    // Force show all main sections with multiple methods
    const mainSections = ['home', 'categories', 'offers', 'new-arrivals'];
    mainSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.cssText = 'display: block !important; visibility: visible !important;';
            section.classList.remove('hidden');
            section.classList.add('visible');
        }
    });
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Update URL hash
    window.location.hash = '';
    
    console.log('Main sections restored');
}

// Function to show orders page (works before orderManager is initialized)
function showOrdersPage() {
    console.log('Showing orders page...');
    
    // Force hide all main sections with multiple methods
    const mainSections = ['home', 'categories', 'offers', 'new-arrivals'];
    mainSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.cssText = 'display: none !important; visibility: hidden !important;';
            section.classList.add('hidden');
            section.classList.remove('visible');
        }
    });

    // Force show orders section with multiple methods
    const ordersSection = document.getElementById('orders');
    if (ordersSection) {
        ordersSection.style.cssText = 'display: block !important; visibility: visible !important;';
        ordersSection.classList.remove('hidden');
        ordersSection.classList.add('visible');
        
        // Scroll to orders section
        ordersSection.scrollIntoView({ behavior: 'smooth' });
        
        // If orderManager is available, update stats and display
        if (window.orderManager) {
            window.orderManager.displayOrders();
            window.orderManager.updateOrderStats();
        } else {
            // Initialize basic display if orderManager not ready
            setTimeout(() => {
                if (window.orderManager) {
                    window.orderManager.displayOrders();
                    window.orderManager.updateOrderStats();
                }
            }, 100);
        }
    }

    // Update URL hash
    window.location.hash = '#orders';
    
    // Scroll to top of orders section
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    console.log('Orders page shown');
}

// Enhanced Search System with Suggestions
class SearchSystem {
    constructor() {
        this.searchInput = document.querySelector('.nav-search input');
        this.searchButton = document.querySelector('.nav-search button');
        this.searchSuggestions = document.getElementById('searchSuggestions');
        this.products = [];
        this.suggestions = ['Men\'s Shirts', 'Women\'s Dresses', 'Kids Clothing', 'Sneakers', 'Handbags', 'Accessories', 'Leather Jackets', 'Summer Collection'];
        this.init();
    }
    
    init() {
        this.collectProducts();
        this.setupEventListeners();
    }
    
    collectProducts() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const name = card.querySelector('h3').textContent;
            const brand = card.querySelector('.brand').textContent;
            const price = card.querySelector('.current-price').textContent;
            
            this.products.push({
                element: card,
                name: name.toLowerCase(),
                brand: brand.toLowerCase(),
                price: price,
                searchText: `${name} ${brand}`.toLowerCase()
            });
        });
    }
    
    setupEventListeners() {
        this.searchButton.addEventListener('click', () => {
            this.performSearch();
        });
        
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                this.showSuggestions(query);
            } else {
                this.hideSuggestions();
                this.showAllProducts();
            }
        });
        
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim().length > 0) {
                this.showSuggestions(this.searchInput.value.trim());
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search')) {
                this.hideSuggestions();
            }
        });
    }
    
    showSuggestions(query) {
        const filteredSuggestions = this.suggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredSuggestions.length > 0) {
            this.searchSuggestions.innerHTML = filteredSuggestions.map(suggestion => 
                `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
            ).join('');
            this.searchSuggestions.style.opacity = '1';
            this.searchSuggestions.style.visibility = 'visible';
        } else {
            this.hideSuggestions();
        }
    }
    
    hideSuggestions() {
        this.searchSuggestions.style.opacity = '0';
        this.searchSuggestions.style.visibility = 'hidden';
    }
    
    performSearch() {
        const query = this.searchInput.value.toLowerCase().trim();
        this.hideSuggestions();
        
        if (query === '') {
            this.showAllProducts();
            return;
        }
        
        const results = this.products.filter(product => 
            product.searchText.includes(query)
        );
        
        this.displaySearchResults(results);
        this.scrollToProducts();
        
        // Search completed - results shown below
    }
    
    displaySearchResults(results) {
        this.products.forEach(product => {
            product.element.style.display = 'none';
        });
        
        results.forEach(product => {
            product.element.style.display = 'block';
        });
        
        if (results.length === 0) {
            this.showNoResults();
        } else {
            this.hideNoResults();
        }
    }
    
    showAllProducts() {
        this.products.forEach(product => {
            product.element.style.display = 'block';
        });
        this.hideNoResults();
    }
    
    showNoResults() {
        let noResultsMsg = document.querySelector('.no-results');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.style.cssText = `
                text-align: center;
                padding: 4rem;
                font-size: 1.2rem;
                color: #666;
                grid-column: 1 / -1;
                background: white;
                border-radius: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;
            noResultsMsg.innerHTML = `
                <i class="fas fa-search" style="font-size: 4rem; color: var(--light-pink); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--primary-pink); margin-bottom: 1rem;">No products found</h3>
                <p>Try searching with different keywords or browse our categories.</p>
            `;
            document.querySelector('.product-grid').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    }
    
    hideNoResults() {
        const noResultsMsg = document.querySelector('.no-results');
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
    
    scrollToProducts() {
        const productsSection = document.querySelector('#new-arrivals');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Global function for suggestion selection
function selectSuggestion(suggestion) {
    const searchInput = document.querySelector('.nav-search input');
    searchInput.value = suggestion;
    const searchSystem = window.searchSystemInstance;
    if (searchSystem) {
        searchSystem.performSearch();
    }
}

// Newsletter Subscription
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const emailInput = newsletterForm.querySelector('input');
    const submitButton = newsletterForm.querySelector('button');
    
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (validateEmail(email)) {
            submitButton.textContent = 'Subscribed!';
            submitButton.style.background = '#4caf50';
            emailInput.value = '';
            
            alert('Thank you for subscribing to our newsletter!');
            
            setTimeout(() => {
                submitButton.textContent = 'Subscribe';
                submitButton.style.background = '#ff6b6b';
            }, 2000);
        } else {
            alert('Please enter a valid email address');
        }
    });
    
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Quick View Modal
class QuickViewModal {
    constructor() {
        this.modal = null;
        this.init();
    }
    
    init() {
        this.createModal();
        this.setupEventListeners();
    }
    
    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'quick-view-modal';
        this.modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        this.modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 15px;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                animation: modalSlideIn 0.3s ease;
            ">
                <button class="close-modal" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    z-index: 1;
                ">×</button>
                <div class="modal-body" style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    padding: 2rem;
                ">
                    <div class="modal-image">
                        <img style="width: 100%; border-radius: 10px;">
                    </div>
                    <div class="modal-details">
                        <h2 class="product-title"></h2>
                        <p class="product-brand"></p>
                        <div class="product-price"></div>
                        <div class="product-rating"></div>
                        <p class="product-description">
                            High-quality product made with premium materials. 
                            Perfect for everyday wear and special occasions. 
                            Available in multiple sizes and colors.
                        </p>
                        <div class="size-selector" style="margin: 1rem 0;">
                            <label>Size:</label>
                            <select style="margin-left: 10px; padding: 5px;">
                                <option>XS</option>
                                <option>S</option>
                                <option selected>M</option>
                                <option>L</option>
                                <option>XL</option>
                                <option>XXL</option>
                            </select>
                        </div>
                        <div class="quantity-selector" style="margin: 1rem 0;">
                            <label>Quantity:</label>
                            <input type="number" value="1" min="1" max="10" 
                                   style="margin-left: 10px; padding: 5px; width: 60px;">
                        </div>
                        <div class="modal-buttons" style="
                            display: flex;
                            gap: 1rem;
                            margin-top: 2rem;
                        ">
                            <button class="add-to-cart-modal" style="
                                flex: 1;
                                background: #ff6b6b;
                                color: white;
                                border: none;
                                padding: 12px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                            ">Add to Cart</button>
                            <button class="buy-now" style="
                                flex: 1;
                                background: #4caf50;
                                color: white;
                                border: none;
                                padding: 12px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                            ">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
    }
    
    setupEventListeners() {
        const quickViewButtons = document.querySelectorAll('.quick-view');
        quickViewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = button.closest('.product-card');
                this.showModal(productCard);
            });
        });
        
        this.modal.querySelector('.close-modal').addEventListener('click', () => {
            this.hideModal();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }
    
    showModal(productCard) {
        const img = productCard.querySelector('img').src;
        const title = productCard.querySelector('h3').textContent;
        const brand = productCard.querySelector('.brand').textContent;
        const price = productCard.querySelector('.price').innerHTML;
        const rating = productCard.querySelector('.rating').innerHTML;
        
        this.modal.querySelector('.modal-image img').src = img;
        this.modal.querySelector('.product-title').textContent = title;
        this.modal.querySelector('.product-brand').textContent = brand;
        this.modal.querySelector('.product-price').innerHTML = price;
        this.modal.querySelector('.product-rating').innerHTML = rating;
        
        this.modal.style.display = 'flex';
        setTimeout(() => {
            this.modal.style.opacity = '1';
        }, 10);
        
        document.body.style.overflow = 'hidden';
    }
    
    hideModal() {
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(300px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(300px);
            opacity: 0;
        }
    }
    
    @keyframes modalSlideIn {
        from {
            transform: scale(0.7);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .quick-view-modal .modal-content {
        animation: modalSlideIn 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .quick-view-modal .modal-body {
            grid-template-columns: 1fr;
            padding: 1rem;
        }
    }
`;
document.head.appendChild(style);

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    new HeroSlider();
    new StatsCounter();
    
    // Store instances globally for cross-component communication
    window.cart = new ShoppingCart();
    window.cartSidebar = new CartSidebar();
    window.authSystem = new AuthSystem();
    window.wishlistSystem = new WishlistSystem();
    window.checkoutSystem = new CheckoutSystem();
    
    // Store search system instance globally for suggestion selection
    window.searchSystemInstance = new SearchSystem();
    
    new QuickViewModal();
    
    setupSmoothScrolling();
    setupNewsletter();
    addScrollToTop();
    addImageLazyLoading();
    setupBrowserNavigation();
    
    console.log('StyleHub website loaded successfully!');
});

// Handle browser back/forward navigation
function setupBrowserNavigation() {
    // Handle hash changes for proper navigation
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash;
        console.log('Hash changed to:', hash);
        
        if (hash === '#orders') {
            showOrdersPage();
        } else if (hash === '' || hash === '#home') {
            showMainSections();
        } else {
            // For other sections, show main sections and scroll to target
            showMainSections();
            setTimeout(() => {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 150);
        }
    });
    
    // Handle initial page load with hash
    if (window.location.hash === '#orders') {
        setTimeout(() => showOrdersPage(), 100);
    } else {
        // Ensure main sections are visible on initial load
        setTimeout(() => showMainSections(), 100);
    }
}

// Add lazy loading for images
function addImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Add scroll-to-top functionality with enhanced styling
function addScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        box-shadow: var(--shadow-medium);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.transform = 'translateY(-3px) scale(1.1)';
        scrollTopBtn.style.boxShadow = 'var(--shadow-large)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.transform = 'translateY(0) scale(1)';
        scrollTopBtn.style.boxShadow = 'var(--shadow-medium)';
    });
}

// Enhanced Cart Sidebar Management
class CartSidebar {
    constructor() {
        this.sidebar = document.getElementById('cartSidebar');
        this.overlay = document.getElementById('overlay');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        this.isOpen = false;
        this.init();
    }
    
    init() {
        // Cart icon click handler
        document.querySelector('.cart').addEventListener('click', (e) => {
            e.preventDefault();
            this.openCart();
        });
        
        // Close cart handlers
        document.getElementById('closeCart').addEventListener('click', () => {
            this.closeCart();
        });
        
        this.overlay.addEventListener('click', () => {
            this.closeCart();
        });
        
        // Event delegation for cart item controls
        this.cartItems.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const cartItem = e.target.closest('.cart-item');
                const itemId = cartItem.dataset.id;
                const action = e.target.dataset.action;
                
                if (action === 'increase') {
                    this.updateQuantity(itemId, 1);
                } else if (action === 'decrease') {
                    this.updateQuantity(itemId, -1);
                } else if (action === 'remove') {
                    this.removeFromCart(itemId);
                }
            }
        });
        
        // Update cart display when items change
        this.updateCartDisplay();
    }
    
    openCart() {
        this.isOpen = true;
        this.sidebar.classList.add('open');
        this.overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.updateCartDisplay();
    }
    
    closeCart() {
        this.isOpen = false;
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    updateCartDisplay() {
        const cartData = JSON.parse(localStorage.getItem('stylehub-cart')) || [];
        
        if (cartData.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started!</p>
                </div>
            `;
            this.cartTotal.style.display = 'none';
        } else {
            this.cartItems.innerHTML = cartData.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-action="increase">+</button>
                            <button class="quantity-btn" data-action="remove" style="background: #ff4757; color: white; margin-left: 10px;">×</button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            const subtotal = cartData.reduce((sum, item) => {
                const price = parseFloat(item.price.replace('₹', '').replace(',', ''));
                return sum + (price * item.quantity);
            }, 0);
            document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            document.getElementById('totalAmount').textContent = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            this.cartTotal.style.display = 'block';
        }
    }
    
    updateQuantity(itemId, change) {
        let cartData = JSON.parse(localStorage.getItem('stylehub-cart')) || [];
        const itemIndex = cartData.findIndex(item => item.id.toString() === itemId.toString());
        
        if (itemIndex !== -1) {
            cartData[itemIndex].quantity += change;
            
            if (cartData[itemIndex].quantity <= 0) {
                cartData.splice(itemIndex, 1);
            }
            
            localStorage.setItem('stylehub-cart', JSON.stringify(cartData));
            
            // Update displays
            window.cart.updateCartDisplay();
            this.updateCartDisplay();
        }
    }
    
    removeFromCart(itemId) {
        let cartData = JSON.parse(localStorage.getItem('stylehub-cart')) || [];
        cartData = cartData.filter(item => item.id.toString() !== itemId.toString());
        localStorage.setItem('stylehub-cart', JSON.stringify(cartData));
        
        // Update displays
        window.cart.updateCartDisplay();
        this.updateCartDisplay();
    }
}

// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('stylehub-user')) || null;
        this.authModal = document.getElementById('authModal');
        this.profileModal = document.getElementById('profileModal');
        this.init();
    }
    
    init() {
        // Account dropdown handlers using event delegation
        document.querySelector('.dropdown-content').addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.closest('a');
            if (!target) return;
            
            const href = target.getAttribute('href');
            if (href === '#profile') {
                if (this.currentUser) {
                    this.showProfile();
                } else {
                    this.showAuthModal();
                }
            } else if (href === '#logout') {
                this.logout();
            } else if (href === '#wishlist') {
                window.wishlistSystem.showWishlist();
            } else if (href === '#orders') {
                alert('Orders page coming soon!');
            }
        });
        
        // Modal close handlers
        document.getElementById('closeAuthModal').addEventListener('click', () => {
            this.closeAuthModal();
        });
        
        document.getElementById('closeProfileModal').addEventListener('click', () => {
            this.closeProfileModal();
        });
        
        // Form handlers
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        this.updateUI();
    }
    
    showAuthModal() {
        this.authModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeAuthModal() {
        this.authModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    showProfile() {
        if (!this.currentUser) {
            this.showAuthModal();
            return;
        }
        
        document.getElementById('profileName').textContent = this.currentUser.name;
        document.getElementById('profileEmail').textContent = this.currentUser.email;
        document.getElementById('memberSince').textContent = this.currentUser.memberSince;
        document.getElementById('totalOrders').textContent = this.currentUser.totalOrders || 0;
        
        const wishlistData = JSON.parse(localStorage.getItem('stylehub-wishlist')) || [];
        document.getElementById('wishlistCount').textContent = wishlistData.length;
        
        this.profileModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeProfileModal() {
        this.profileModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simple validation (in real app, this would be server-side)
        const users = JSON.parse(localStorage.getItem('stylehub-users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('stylehub-user', JSON.stringify(user));
            this.closeAuthModal();
            this.updateUI();
            alert('Login successful!');
        } else {
            alert('Invalid email or password');
        }
    }
    
    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('stylehub-users')) || [];
        
        if (users.find(u => u.email === email)) {
            alert('Email already exists');
            return;
        }
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            memberSince: new Date().toLocaleDateString(),
            totalOrders: 0
        };
        
        users.push(newUser);
        localStorage.setItem('stylehub-users', JSON.stringify(users));
        
        this.currentUser = newUser;
        localStorage.setItem('stylehub-user', JSON.stringify(newUser));
        
        this.closeAuthModal();
        this.updateUI();
        alert('Registration successful!');
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('stylehub-user');
        this.updateUI();
        alert('Logged out successfully!');
    }
    
    updateUI() {
        const accountDropdown = document.querySelector('.dropdown-content');
        if (this.currentUser) {
            accountDropdown.innerHTML = `
                <a href="#profile"><i class="fas fa-user"></i> ${this.currentUser.name}</a>
                <a href="#orders"><i class="fas fa-box"></i> My Orders</a>
                <a href="#wishlist"><i class="fas fa-heart"></i> Wishlist</a>
                <a href="#logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
            `;
        } else {
            accountDropdown.innerHTML = `
                <a href="#profile"><i class="fas fa-user"></i> Login / Register</a>
                <a href="#orders"><i class="fas fa-box"></i> My Orders</a>
                <a href="#wishlist"><i class="fas fa-heart"></i> Wishlist</a>
            `;
        }
    }
}

// Wishlist System
class WishlistSystem {
    constructor() {
        this.wishlistModal = document.getElementById('wishlistModal');
        this.wishlistItems = document.getElementById('wishlistItems');
        this.init();
    }
    
    init() {
        // Wishlist link handler
        document.querySelector('[href="#wishlist"]').addEventListener('click', (e) => {
            e.preventDefault();
            this.showWishlist();
        });
        
        // Close modal handler
        document.getElementById('closeWishlistModal').addEventListener('click', () => {
            this.closeWishlist();
        });
        
        // Add to wishlist button handlers
        this.setupWishlistButtons();
    }
    
    setupWishlistButtons() {
        const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
        wishlistButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addToWishlist(e.target);
            });
        });
    }
    
    addToWishlist(button) {
        const productCard = button.closest('.product-card');
        const productData = {
            id: Date.now().toString(),
            name: productCard.querySelector('h3').textContent,
            price: productCard.querySelector('.current-price').textContent,
            image: productCard.querySelector('img').src
        };
        
        let wishlistData = JSON.parse(localStorage.getItem('stylehub-wishlist')) || [];
        
        // Check if item already exists
        if (!wishlistData.find(item => item.name === productData.name)) {
            wishlistData.push(productData);
            localStorage.setItem('stylehub-wishlist', JSON.stringify(wishlistData));
            // Item added to wishlist
            button.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i>';
        } else {
            alert('Item already in wishlist');
        }
    }
    
    showWishlist() {
        const wishlistData = JSON.parse(localStorage.getItem('stylehub-wishlist')) || [];
        
        if (wishlistData.length === 0) {
            this.wishlistItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love for later!</p>
                </div>
            `;
        } else {
            this.wishlistItems.innerHTML = wishlistData.map(item => `
                <div class="wishlist-item" data-id="${item.id}">
                    <div class="wishlist-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="wishlist-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price}</p>
                        <div class="wishlist-actions">
                            <button class="move-to-cart" onclick="moveToCart('${item.id}')">Add to Cart</button>
                            <button class="remove-wishlist" onclick="removeFromWishlist('${item.id}')">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        this.wishlistModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeWishlist() {
        this.wishlistModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Global functions for cart and wishlist management
function updateQuantity(itemId, change) {
    let cartData = JSON.parse(localStorage.getItem('stylehub-cart')) || [];
    const itemIndex = cartData.findIndex(item => item.id.toString() === itemId.toString());
    
    if (itemIndex !== -1) {
        cartData[itemIndex].quantity += change;
        
        if (cartData[itemIndex].quantity <= 0) {
            cartData.splice(itemIndex, 1);
        }
        
        localStorage.setItem('stylehub-cart', JSON.stringify(cartData));
        
        // Update displays
        window.cart.updateCartDisplay();
        window.cartSidebar.updateCartDisplay();
    }
}

function removeFromCart(itemId) {
    let cartData = JSON.parse(localStorage.getItem('stylehub-cart')) || [];
    cartData = cartData.filter(item => item.id.toString() !== itemId.toString());
    localStorage.setItem('stylehub-cart', JSON.stringify(cartData));
    
    // Update displays
    window.cart.updateCartDisplay();
    window.cartSidebar.updateCartDisplay();
}

function removeFromWishlist(itemId) {
    let wishlistData = JSON.parse(localStorage.getItem('stylehub-wishlist')) || [];
    wishlistData = wishlistData.filter(item => item.id !== itemId);
    localStorage.setItem('stylehub-wishlist', JSON.stringify(wishlistData));
    
    window.wishlistSystem.showWishlist();
    // Item removed from wishlist
}

function moveToCart(itemId) {
    const wishlistData = JSON.parse(localStorage.getItem('stylehub-wishlist')) || [];
    const item = wishlistData.find(item => item.id === itemId);
    
    if (item) {
        // Add to cart
        let cartData = JSON.parse(localStorage.getItem('stylehub-cart')) || [];
        const cartItem = {
            ...item,
            quantity: 1
        };
        cartData.push(cartItem);
        localStorage.setItem('stylehub-cart', JSON.stringify(cartData));
        
        // Remove from wishlist
        removeFromWishlist(itemId);
        
        // Update cart display
        window.cart.updateCartDisplay();
        window.cartSidebar.updateCartDisplay();
        
        // Item moved to cart
    }
}

// Enhanced Authentication Helper Functions
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.querySelector('.auth-tab:first-child');
    const registerTab = document.querySelector('.auth-tab:last-child');
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function closeAuthModal() {
    window.authSystem.closeAuthModal();
}

// Comprehensive Checkout System
class CheckoutSystem {
    constructor() {
        this.checkoutModal = document.getElementById('checkoutModal');
        this.orderModal = document.getElementById('orderModal');
        this.currentStep = 1;
        this.maxSteps = 4;
        this.checkoutData = {
            user: null,
            shipping: {},
            payment: {},
            items: []
        };
        this.init();
    }
    
    init() {
        this.setupStepNavigation();
        this.setupPaymentMethods();
        this.setupCardInputs();
    }
    
    showCheckout() {
        const cartItems = JSON.parse(localStorage.getItem('stylehub-cart')) || [];
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        this.checkoutData.items = cartItems;
        this.currentStep = 1;
        this.updateProgressIndicator();
        this.showStep(1);
        this.checkoutModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    closeCheckout() {
        this.checkoutModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    setupStepNavigation() {
        document.getElementById('nextStep').addEventListener('click', () => {
            this.nextStep();
        });
        
        document.getElementById('prevStep').addEventListener('click', () => {
            this.prevStep();
        });
        
        document.getElementById('placeOrder').addEventListener('click', () => {
            this.placeOrder();
        });
    }
    
    setupPaymentMethods() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => {
                const cardForm = document.getElementById('cardForm');
                if (e.target.value === 'credit') {
                    cardForm.style.display = 'block';
                } else {
                    cardForm.style.display = 'none';
                }
            });
        });
    }
    
    setupCardInputs() {
        const cardNumber = document.getElementById('cardNumber');
        const expiryDate = document.getElementById('expiryDate');
        
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
        
        expiryDate.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            if (this.currentStep < this.maxSteps) {
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgressIndicator();
                this.updateNavigationButtons();
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgressIndicator();
            this.updateNavigationButtons();
        }
    }
    
    showStep(step) {
        // Hide all steps
        for (let i = 1; i <= this.maxSteps; i++) {
            document.getElementById(`checkoutStep${i}`).style.display = 'none';
        }
        
        // Show current step
        document.getElementById(`checkoutStep${step}`).style.display = 'block';
        
        // Special handling for step 4 (summary)
        if (step === 4) {
            this.populateOrderSummary();
        }
        
        this.updateNavigationButtons();
    }
    
    updateProgressIndicator() {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const placeOrderBtn = document.getElementById('placeOrder');
        
        prevBtn.style.display = this.currentStep > 1 ? 'flex' : 'none';
        nextBtn.style.display = this.currentStep < this.maxSteps ? 'flex' : 'none';
        placeOrderBtn.style.display = this.currentStep === this.maxSteps ? 'flex' : 'none';
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateAccountStep();
            case 2:
                return this.validateAddressStep();
            case 3:
                return this.validatePaymentStep();
            case 4:
                return true;
            default:
                return false;
        }
    }
    
    validateAccountStep() {
        const currentUser = window.authSystem.currentUser;
        if (currentUser) {
            this.checkoutData.user = currentUser;
            return true;
        }
        
        // Guest checkout validation
        const guestInfo = document.getElementById('guestInfo');
        if (guestInfo.style.display === 'none') {
            alert('Please select a checkout option');
            return false;
        }
        
        const firstName = document.getElementById('guestFirstName').value;
        const lastName = document.getElementById('guestLastName').value;
        const email = document.getElementById('guestEmail').value;
        const phone = document.getElementById('guestPhone').value;
        
        if (!firstName || !lastName || !email || !phone) {
            alert('Please fill all required fields');
            return false;
        }
        
        this.checkoutData.user = { firstName, lastName, email, phone };
        return true;
    }
    
    validateAddressStep() {
        const requiredFields = ['shippingFirstName', 'shippingLastName', 'shippingAddress1', 
                               'shippingCity', 'shippingState', 'shippingZip', 'shippingCountry'];
        
        for (let field of requiredFields) {
            if (!document.getElementById(field).value.trim()) {
                alert('Please fill all required address fields');
                return false;
            }
        }
        return true;
    }
    
    validatePaymentStep() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        if (paymentMethod === 'credit') {
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardName = document.getElementById('cardName').value;
            
            if (!cardNumber || cardNumber.length < 13 || !expiryDate || !cvv || !cardName) {
                alert('Please fill all card details');
                return false;
            }
        }
        return true;
    }
    
    saveCurrentStepData() {
        switch (this.currentStep) {
            case 2:
                this.saveShippingData();
                break;
            case 3:
                this.savePaymentData();
                break;
        }
    }
    
    saveShippingData() {
        this.checkoutData.shipping = {
            firstName: document.getElementById('shippingFirstName').value,
            lastName: document.getElementById('shippingLastName').value,
            address1: document.getElementById('shippingAddress1').value,
            address2: document.getElementById('shippingAddress2').value,
            city: document.getElementById('shippingCity').value,
            state: document.getElementById('shippingState').value,
            zip: document.getElementById('shippingZip').value,
            country: document.getElementById('shippingCountry').value
        };
    }
    
    savePaymentData() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        this.checkoutData.payment = { method: paymentMethod };
        
        if (paymentMethod === 'credit') {
            this.checkoutData.payment.cardLast4 = document.getElementById('cardNumber').value.slice(-4);
            this.checkoutData.payment.cardName = document.getElementById('cardName').value;
        }
    }
    
    populateOrderSummary() {
        // Populate items
        const itemsContainer = document.getElementById('checkoutItems');
        const cartItems = this.checkoutData.items;
        
        itemsContainer.innerHTML = cartItems.map(item => {
            const price = parseFloat(item.price.replace('₹', '').replace(',', ''));
            return `
                <div class="summary-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₹${(price * item.quantity).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
            `;
        }).join('');
        
        // Populate address
        const shippingData = this.checkoutData.shipping;
        document.getElementById('summaryAddress').innerHTML = `
            <div>${shippingData.firstName} ${shippingData.lastName}</div>
            <div>${shippingData.address1}</div>
            ${shippingData.address2 ? `<div>${shippingData.address2}</div>` : ''}
            <div>${shippingData.city}, ${shippingData.state} ${shippingData.zip}</div>
            <div>${shippingData.country}</div>
        `;
        
        // Populate payment
        const payment = this.checkoutData.payment;
        let paymentText = '';
        switch (payment.method) {
            case 'credit':
                paymentText = `Credit Card ending in ${payment.cardLast4}`;
                break;
            case 'paypal':
                paymentText = 'PayPal';
                break;
            case 'apple':
                paymentText = 'Apple Pay';
                break;
        }
        document.getElementById('summaryPayment').innerHTML = paymentText;
        
        // Calculate totals
        const subtotal = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('₹', '').replace(',', ''));
            return sum + (price * item.quantity);
        }, 0);
        const shippingCost = 497; // ₹497 (equivalent to $5.99)
        const tax = subtotal * 0.18; // 18% GST in India
        const total = subtotal + shippingCost + tax;
        
        document.getElementById('summarySubtotal').textContent = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('summaryShipping').textContent = `₹${shippingCost.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('summaryTax').textContent = `₹${tax.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('summaryTotal').textContent = `₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    placeOrder() {
        const orderNumber = 'SH' + Date.now().toString().slice(-6);
        const total = document.getElementById('summaryTotal').textContent;
        
        // Simulate order processing
        this.checkoutModal.classList.remove('show');
        
        setTimeout(() => {
            document.getElementById('orderNumber').textContent = '#' + orderNumber;
            document.getElementById('orderTotal').textContent = total;
            
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 5);
            document.getElementById('deliveryDate').textContent = deliveryDate.toLocaleDateString();
            
            this.orderModal.classList.add('show');
            
            // Clear cart
            localStorage.removeItem('stylehub-cart');
            window.cartSidebar.updateCartDisplay();
            
            // Save order to user's history
            this.saveOrderToHistory(orderNumber, total);
            
        }, 1000);
    }
    
    saveOrderToHistory(orderNumber, total) {
        const orders = JSON.parse(localStorage.getItem('stylehub-orders')) || [];
        const newOrder = {
            id: orderNumber,
            items: this.checkoutData.items,
            total: total,
            date: new Date().toISOString(),
            status: 'Processing',
            shipping: this.checkoutData.shipping
        };
        
        orders.push(newOrder);
        localStorage.setItem('stylehub-orders', JSON.stringify(orders));
    }
}

// Guest checkout functions
function continueAsGuest() {
    document.getElementById('guestInfo').style.display = 'block';
    document.querySelector('.guest-login-options').style.display = 'none';
}

function showLoginInCheckout() {
    window.checkoutSystem.closeCheckout();
    window.authSystem.showAuthModal();
}

// Checkout navigation functions
function nextCheckoutStep() {
    window.checkoutSystem.nextStep();
}

function prevCheckoutStep() {
    window.checkoutSystem.prevStep();
}

function closeCheckoutModal() {
    window.checkoutSystem.closeCheckout();
}

function placeOrder() {
    window.checkoutSystem.placeOrder();
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function trackOrder() {
    closeOrderModal();
    alert('Order tracking feature coming soon!');
}

// Enhanced checkout function
function proceedToCheckout() {
    const currentUser = window.authSystem.currentUser;
    if (!currentUser) {
        // Show checkout modal for guest users too
        window.checkoutSystem.showCheckout();
    } else {
        window.checkoutSystem.showCheckout();
    }
}

function editProfile() {
    alert('Profile editing feature coming soon!');
}

// Additional helper functions for authentication
function showAuthModal() {
    window.authSystem.showAuthModal();
}

function closeProfileModal() {
    window.authSystem.closeProfileModal();
}

// Orders Management System
class OrdersManager {
    constructor() {
        this.orders = this.loadOrders();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateOrderStats();
        this.displayOrders();
    }

    setupEventListeners() {
        // Navigation to orders page is now handled by the global showOrdersPage function
        
        // Search functionality
        const searchInput = document.getElementById('orderSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchOrders(e.target.value);
            });
        }

        // Filter functionality is handled by the filterOrders function called from HTML
    }

    loadOrders() {
        // In a real application, this would come from a server
        const savedOrders = localStorage.getItem('userOrders');
        if (savedOrders) {
            return JSON.parse(savedOrders);
        }

        // Sample orders data
        return [
            {
                id: 'STH001234',
                date: '2024-01-15',
                status: 'delivered',
                total: 7885,
                items: [
                    {
                        id: 1,
                        name: 'Flower Print Dress',
                        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&h=80&fit=crop',
                        size: 'M',
                        color: 'Blue',
                        quantity: 1,
                        price: 7885
                    }
                ],
                shippingAddress: {
                    name: 'John Doe',
                    address: '123 Main St, Mumbai, Maharashtra 400001',
                    phone: '+91 9876543210'
                },
                trackingId: 'TRK7891234567',
                estimatedDelivery: '2024-01-18'
            },
            {
                id: 'STH001235',
                date: '2024-01-18',
                status: 'shipped',
                total: 12449,
                items: [
                    {
                        id: 2,
                        name: 'Stylish Watch',
                        image: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=80&h=80&fit=crop',
                        color: 'Silver',
                        quantity: 1,
                        price: 12449
                    }
                ],
                shippingAddress: {
                    name: 'John Doe',
                    address: '123 Main St, Mumbai, Maharashtra 400001',
                    phone: '+91 9876543210'
                },
                trackingId: 'TRK7891234568',
                estimatedDelivery: '2024-01-22'
            },
            {
                id: 'STH001236',
                date: '2024-01-20',
                status: 'processing',
                total: 15935,
                items: [
                    {
                        id: 3,
                        name: 'Casual Blazer',
                        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=80&h=80&fit=crop',
                        size: 'L',
                        color: 'Navy',
                        quantity: 1,
                        price: 10375
                    },
                    {
                        id: 4,
                        name: 'Elegant Skirt',
                        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=80&h=80&fit=crop',
                        size: 'M',
                        color: 'Black',
                        quantity: 1,
                        price: 5560
                    }
                ],
                shippingAddress: {
                    name: 'John Doe',
                    address: '123 Main St, Mumbai, Maharashtra 400001',
                    phone: '+91 9876543210'
                },
                trackingId: null,
                estimatedDelivery: '2024-01-25'
            }
        ];
    }

    saveOrders() {
        localStorage.setItem('userOrders', JSON.stringify(this.orders));
    }

    updateOrderStats() {
        const totalOrders = this.orders.length;
        const deliveredOrders = this.orders.filter(order => order.status === 'delivered').length;
        const pendingOrders = this.orders.filter(order => ['shipped', 'processing'].includes(order.status)).length;
        const totalSpent = this.orders.reduce((sum, order) => sum + order.total, 0);

        // Update stats display
        const totalOrdersElement = document.getElementById('totalOrdersCount');
        const deliveredOrdersElement = document.getElementById('deliveredOrdersCount');
        const pendingOrdersElement = document.getElementById('pendingOrdersCount');
        const totalSpentElement = document.getElementById('totalSpentAmount');

        if (totalOrdersElement) totalOrdersElement.textContent = totalOrders;
        if (deliveredOrdersElement) deliveredOrdersElement.textContent = deliveredOrders;
        if (pendingOrdersElement) pendingOrdersElement.textContent = pendingOrders;
        if (totalSpentElement) totalSpentElement.textContent = `₹${totalSpent.toLocaleString('en-IN')}`;
    }

    displayOrders(ordersToShow = null) {
        const ordersList = document.getElementById('ordersList');
        const emptyOrders = document.getElementById('emptyOrders');
        const orders = ordersToShow || this.getFilteredOrders();

        if (!ordersList) return;

        if (orders.length === 0) {
            ordersList.style.display = 'none';
            if (emptyOrders) emptyOrders.style.display = 'block';
            return;
        }

        ordersList.style.display = 'flex';
        if (emptyOrders) emptyOrders.style.display = 'none';

        ordersList.innerHTML = orders.map(order => this.createOrderCard(order)).join('');
    }

    getFilteredOrders() {
        if (this.currentFilter === 'all') {
            return this.orders;
        }
        return this.orders.filter(order => order.status === this.currentFilter);
    }

    createOrderCard(order) {
        const statusClass = order.status;
        const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
        const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const itemsHtml = order.items.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.size ? `Size: ${item.size} | ` : ''}${item.color ? `Color: ${item.color} | ` : ''}Qty: ${item.quantity}</p>
                    <span class="item-price">₹${item.price.toLocaleString('en-IN')}</span>
                </div>
            </div>
        `).join('');

        const trackingHtml = order.status === 'shipped' && order.trackingId ? `
            <div class="tracking-info">
                <div class="tracking-header">
                    <i class="fas fa-truck"></i>
                    <span>Tracking ID: ${order.trackingId}</span>
                    <span class="estimated-delivery">Expected delivery: ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</span>
                </div>
                <div class="tracking-progress">
                    <div class="progress-step completed">
                        <i class="fas fa-check"></i>
                        <span>Order Confirmed</span>
                    </div>
                    <div class="progress-step completed">
                        <i class="fas fa-box"></i>
                        <span>Packed</span>
                    </div>
                    <div class="progress-step active">
                        <i class="fas fa-truck"></i>
                        <span>In Transit</span>
                    </div>
                    <div class="progress-step">
                        <i class="fas fa-home"></i>
                        <span>Delivered</span>
                    </div>
                </div>
            </div>
        ` : '';

        const actionsHtml = this.getOrderActions(order);

        return `
            <div class="order-card" data-status="${order.status}">
                <div class="order-header">
                    <div class="order-info">
                        <h3 class="order-id">Order #${order.id}</h3>
                        <span class="order-date">Placed on ${orderDate}</span>
                    </div>
                    <div class="order-status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <span class="order-total">₹${order.total.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div class="order-items">
                    ${itemsHtml}
                </div>
                ${trackingHtml}
                <div class="order-actions">
                    ${actionsHtml}
                </div>
            </div>
        `;
    }

    getOrderActions(order) {
        let actions = `
            <button class="btn-secondary" onclick="orderManager.viewOrderDetails('${order.id}')">
                <i class="fas fa-eye"></i> View Details
            </button>
        `;

        if (order.status === 'delivered') {
            actions += `
                <button class="btn-primary" onclick="orderManager.reorderItems('${order.id}')">
                    <i class="fas fa-redo"></i> Reorder
                </button>
                <button class="btn-secondary" onclick="orderManager.downloadInvoice('${order.id}')">
                    <i class="fas fa-download"></i> Invoice
                </button>
            `;
        } else if (order.status === 'shipped') {
            actions += `
                <button class="btn-primary" onclick="orderManager.trackOrder('${order.id}')">
                    <i class="fas fa-map-marker-alt"></i> Track Order
                </button>
                <button class="btn-danger" onclick="orderManager.cancelOrder('${order.id}')">
                    <i class="fas fa-times"></i> Cancel
                </button>
            `;
        } else if (order.status === 'processing') {
            actions += `
                <button class="btn-danger" onclick="orderManager.cancelOrder('${order.id}')">
                    <i class="fas fa-times"></i> Cancel Order
                </button>
                <button class="btn-primary" onclick="orderManager.modifyOrder('${order.id}')">
                    <i class="fas fa-edit"></i> Modify
                </button>
            `;
        }

        return actions;
    }

    searchOrders(searchTerm) {
        if (!searchTerm.trim()) {
            this.displayOrders();
            return;
        }

        const filteredOrders = this.getFilteredOrders().filter(order => {
            const searchLower = searchTerm.toLowerCase();
            return (
                order.id.toLowerCase().includes(searchLower) ||
                order.items.some(item => item.name.toLowerCase().includes(searchLower))
            );
        });

        this.displayOrders(filteredOrders);
    }

    filterOrders(status) {
        this.currentFilter = status;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.displayOrders();
    }

    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('orderDetailsModal');
        const content = document.getElementById('orderDetailsContent');
        
        if (!modal || !content) return;

        content.innerHTML = this.createOrderDetailsContent(order);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    createOrderDetailsContent(order) {
        const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const itemsHtml = order.items.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.size ? `Size: ${item.size} | ` : ''}${item.color ? `Color: ${item.color} | ` : ''}Quantity: ${item.quantity}</p>
                    <span class="item-price">₹${item.price.toLocaleString('en-IN')}</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="order-details">
                <div class="order-summary">
                    <h3>Order #${order.id}</h3>
                    <p>Placed on ${orderDate}</p>
                    <span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </div>
                
                <div class="order-items">
                    <h4>Items Ordered</h4>
                    ${itemsHtml}
                </div>
                
                <div class="shipping-info">
                    <h4>Shipping Address</h4>
                    <p><strong>${order.shippingAddress.name}</strong></p>
                    <p>${order.shippingAddress.address}</p>
                    <p>Phone: ${order.shippingAddress.phone}</p>
                </div>
                
                <div class="order-total-details">
                    <h4>Order Summary</h4>
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>₹${order.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <div class="total-row final">
                        <span>Total:</span>
                        <span>₹${order.total.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                
                ${order.trackingId ? `
                    <div class="tracking-details">
                        <h4>Tracking Information</h4>
                        <p>Tracking ID: <strong>${order.trackingId}</strong></p>
                        <p>Expected Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    closeOrderDetails() {
        const modal = document.getElementById('orderDetailsModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    reorderItems(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        // Add all items from the order back to cart
        order.items.forEach(item => {
            const productElement = {
                querySelector: (selector) => {
                    if (selector === '.current-price' || selector === '.price') {
                        return { textContent: `₹${item.price}` };
                    }
                    return null;
                },
                closest: () => ({
                    querySelector: (selector) => {
                        if (selector === 'h3') return { textContent: item.name };
                        if (selector === 'img') return { src: item.image, alt: item.name };
                        return null;
                    }
                })
            };

            // Add to cart for each quantity
            for (let i = 0; i < item.quantity; i++) {
                window.cartManager.addToCart(productElement);
            }
        });

        alert(`${order.items.length} items have been added back to your cart!`);
    }

    downloadInvoice(orderId) {
        alert(`Downloading invoice for order #${orderId}...`);
        // In a real application, this would generate and download a PDF invoice
    }

    trackOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        if (order.trackingId) {
            alert(`Track your order with ID: ${order.trackingId}\n\nExpected delivery: ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}`);
        } else {
            alert('Tracking information is not yet available for this order.');
        }
    }

    cancelOrder(orderId) {
        const confirmed = confirm('Are you sure you want to cancel this order?');
        if (!confirmed) return;

        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            this.orders[orderIndex].status = 'cancelled';
            this.saveOrders();
            this.displayOrders();
            this.updateOrderStats();
            alert('Order has been cancelled successfully.');
        }
    }

    modifyOrder(orderId) {
        alert(`Order modification feature is coming soon for order #${orderId}`);
        // In a real application, this would allow users to modify their order
    }
}

// Global functions for HTML onclick handlers
function filterOrders(status) {
    if (window.orderManager) {
        window.orderManager.filterOrders(status);
    }
}

function viewOrderDetails(orderId) {
    if (window.orderManager) {
        window.orderManager.viewOrderDetails(orderId);
    }
}

function closeOrderDetails() {
    if (window.orderManager) {
        window.orderManager.closeOrderDetails();
    }
}

function reorderItems(orderId) {
    if (window.orderManager) {
        window.orderManager.reorderItems(orderId);
    }
}

function downloadInvoice(orderId) {
    if (window.orderManager) {
        window.orderManager.downloadInvoice(orderId);
    }
}

function trackOrder(orderId) {
    if (window.orderManager) {
        window.orderManager.trackOrder(orderId);
    }
}

function cancelOrder(orderId) {
    if (window.orderManager) {
        window.orderManager.cancelOrder(orderId);
    }
}

// Debug functions for testing navigation
window.debugNavigation = {
    showOrders: () => showOrdersPage(),
    showMain: () => showMainSections(),
    checkSections: () => {
        const sections = ['home', 'categories', 'offers', 'new-arrivals', 'orders'];
        sections.forEach(id => {
            const section = document.getElementById(id);
            console.log(`Section ${id}:`, section ? {
                display: section.style.display,
                visibility: section.style.visibility,
                offsetHeight: section.offsetHeight
            } : 'NOT FOUND');
        });
    }
};

function modifyOrder(orderId) {
    if (window.orderManager) {
        window.orderManager.modifyOrder(orderId);
    }
}

// Initialize Orders Manager
document.addEventListener('DOMContentLoaded', function() {
    window.orderManager = new OrdersManager();
    
    // Check if URL has #orders hash on page load
    if (window.location.hash === '#orders') {
        showOrdersPage();
    }
    
    // Add fallback event listener for any orders links that might be missed
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href="#orders"]');
        if (target) {
            e.preventDefault();
            showOrdersPage();
        }
    });
});
