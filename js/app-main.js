/**
 * FinGaurd - Unified Application Script
 * Handles: Component loading, Products, Cart, WhatsApp messaging, Forms, and Animations
 */

// ============================================================================
// 1. CONFIGURATION
// ============================================================================
const WHATSAPP_PHONE_NUMBER = "919821560609"; // Change to your WhatsApp number
const currency = '₹';

// ============================================================================
// 2. PRODUCT DATABASE
// ============================================================================
const ProductDB = {
    async getAllProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Network response was not ok.');
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch products:", error);
            return [];
        }
    },
    
    async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find(p => p.id === parseInt(id));
    }
};

function getPrimaryImage(product) {
    if (product && Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
    }
    return 'assets/images/placeholder.jpg';
}

function getStructuredImageList(product) {
    if (product && Array.isArray(product.images) && product.images.length > 0) {
        return product.images;
    }
    return ['assets/images/placeholder.jpg'];
}

// ============================================================================
// 3. CART MANAGEMENT
// ============================================================================
const Cart = {
    getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },
    
    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartIcon();
    },
    
    addItem(id, quantity) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id, quantity });
        }
        this.saveCart(cart);
        showAlert('Product added to cart successfully!', 'success');
    },
    
    updateItemQuantity(id, quantity) {
        let cart = this.getCart();
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                cart = cart.filter(cartItem => cartItem.id !== id);
            }
        }
        this.saveCart(cart);
    },
    
    removeItem(id) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== id);
        this.saveCart(cart);
    },
    
    getCartCount() {
        return this.getCart().reduce((count, item) => count + item.quantity, 0);
    },
    
    updateCartIcon() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const count = this.getCartCount();
            if (count > 0) {
                cartCountElement.textContent = count;
                cartCountElement.classList.remove('hidden');
            } else {
                cartCountElement.classList.add('hidden');
                cartCountElement.textContent = '';
            }
        }
    },
    
    clearCart() {
        localStorage.removeItem('cart');
        this.updateCartIcon();
    }
};

// ============================================================================
// 4. WHATSAPP MESSAGING
// ============================================================================
const WhatsApp = {
    generateSingleProductMessage(product, quantity) {
        const message = `Hello, I'm interested in this product:\n\n*Product:* ${product.name}\n*SKU:* ${product.sku}\n*Quantity:* ${quantity}\n\nPlease provide more details.`;
        return encodeURIComponent(message);
    },
    
    async generateCartMessage() {
        const cart = Cart.getCart();
        const products = await ProductDB.getAllProducts();
        let message = "Hello, I'd like to place an order for the following items:\n\n";
        let total = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const price = product.sellingPrice || product.price || 0;
                message += `*${product.name}*\n`;
                message += `  - SKU: ${product.sku}\n`;
                message += `  - Quantity: ${item.quantity}\n`;
                message += `  - Price: ${currency}${price.toLocaleString()}\n\n`;
                total += price * item.quantity;
            }
        });

        message += `*Total Estimated Price: ${currency}${total.toLocaleString()}*`;
        return encodeURIComponent(message);
    },
    
    send(message) {
        const encodedMessage = message.includes('%') ? message : encodeURIComponent(message);
        const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
        window.open(url, '_blank');
    }
};

// ============================================================================
// 5. ALERT/NOTIFICATION SYSTEM
// ============================================================================
function showAlert(message, type = 'info', duration = 10000) {
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert ${type}`;
    alertDiv.innerHTML = `
        <div class="custom-alert-content">
            <div class="custom-alert-message">${message}</div>
            <button class="custom-alert-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.classList.add('show'), 100);
    
    setTimeout(() => {
        if (document.body.contains(alertDiv)) {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, duration);
}

// ============================================================================
// 6. COMPONENT LOADING (Header, Footer, WhatsApp Float, Aurora Background)
// ============================================================================
async function loadIncludes() {
    const includes = document.querySelectorAll('[data-include]');
    await Promise.all(Array.from(includes).map(async el => {
        const src = el.getAttribute('data-include');
        try {
            const res = await fetch(src, { cache: 'no-cache' });
            if (!res.ok) throw new Error('Failed to fetch ' + src);
            el.innerHTML = await res.text();
        } catch (e) {
            console.error('Include error:', e);
        }
    }));
    
    // Update cart count after header loads (with small delay to ensure DOM is ready)
    setTimeout(() => {
        Cart.updateCartIcon();
    }, 100);

    // Wire mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav .nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }));
    }

    // Add floating WhatsApp button
    if (!document.getElementById('floating-whatsapp-link')) {
        const wrap = document.createElement('div');
        wrap.setAttribute('data-include', 'components/whatsapp-float.html');
        document.body.appendChild(wrap);
        try {
            const res = await fetch('components/whatsapp-float.html', { cache: 'no-cache' });
            if (res.ok) wrap.innerHTML = await res.text();
        } catch {}
    }

    // Configure WhatsApp button
    const w = document.getElementById('floating-whatsapp-link');
    if (w && typeof WHATSAPP_PHONE_NUMBER !== 'undefined') {
        const msg = encodeURIComponent('Hello! I have a quick question about FinGaurd RO systems.');
        w.href = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${msg}`;
    }

    // Add animated aurora background
    if (!document.querySelector('.bg-aurora')) {
        const bg = document.createElement('div');
        bg.className = 'bg-aurora';
        bg.innerHTML = '<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="blob b4"></div>';
        document.body.appendChild(bg);
    }
}

// ============================================================================
// 7. SCROLL REVEAL ANIMATIONS
// ============================================================================
function setupScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReduced && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }
}

// ============================================================================
// 8. PRODUCT DISPLAY
// ============================================================================
function createProductCard(product) {
    const primaryImage = getPrimaryImage(product);
    const price = product.sellingPrice || product.price || 0;
    return `
        <div class="product-card reveal" itemscope itemtype="http://schema.org/Product">
            <a href="product.html?id=${product.id}">
                <img src="${primaryImage}" alt="${product.name}" itemprop="image" loading="lazy">
                <div class="product-card-content">
                    <h3 itemprop="name">${product.name}</h3>
                    <p class="price" itemprop="price" content="${price}">${currency}${price.toLocaleString()}</p>
                    <p style="margin:0;color:var(--text-secondary);font-size:var(--font-size-sm)">Bulk pricing available — <span style="color:var(--accent-color);font-weight:600">Wholesale</span></p>
                    <meta itemprop="priceCurrency" content="INR">
                    <div itemprop="brand" itemscope itemtype="http://schema.org/Brand">
                        <meta itemprop="name" content="FinGaurd">
                    </div>
                </div>
            </a>
        </div>
    `;
}

function formatSpecLabel(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/Tds/g, 'TDS')
        .replace(/Uv/g, 'UV')
        .replace(/Ro/g, 'RO')
        .replace(/Gpd/g, 'GPD')
        .replace(/Ph/g, 'pH')
        .replace(/Psi/g, 'PSI');
}

// ============================================================================
// 9. PAGE LOADERS
// ============================================================================

// --- HOME PAGE ---
async function loadHomePage() {
    const featuredGrid = document.getElementById('featured-products-grid');
    if (!featuredGrid) return;
    
    const products = await ProductDB.getAllProducts();
    featuredGrid.innerHTML = products.slice(0, 4).map(createProductCard).join('');
}

// --- PRODUCTS PAGE ---
async function loadProductsPage() {
    const products = await ProductDB.getAllProducts();
    const productGrid = document.getElementById('product-grid');
    const categoryFilters = document.getElementById('category-filters');
    const searchBox = document.getElementById('search-box');

    if (!productGrid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const qParam = urlParams.get('q') || '';

    const displayedCategories = [
        { label: 'All', category: 'All' },
        { label: 'RO Systems', category: 'RO Systems' },
        { label: 'Filters', category: 'Filters' },
        { label: 'Accessories', category: 'Spares' },
        { label: 'Membranes', category: 'Spares', q: 'membrane' }
    ];

    categoryFilters.innerHTML = `<ul>${displayedCategories.map(c => 
        `<li data-category="${c.category}"${c.q ? ` data-q="${c.q}"` : ''}>${c.label}</li>`
    ).join('')}</ul>`;

    const categoryItems = categoryFilters.querySelectorAll('li');

    let initialActiveItem = null;
    if (qParam && qParam.toLowerCase().includes('membrane')) {
        initialActiveItem = Array.from(categoryItems).find(li => li.textContent.trim() === 'Membranes') || null;
    }
    if (!initialActiveItem) {
        const desiredCategory = categoryParam || 'All';
        initialActiveItem = Array.from(categoryItems).find(li => 
            li.dataset.category === desiredCategory && (!li.dataset.q)
        ) || Array.from(categoryItems).find(li => li.dataset.category === desiredCategory)
          || Array.from(categoryItems).find(li => li.dataset.category === 'All');
    }
    if (initialActiveItem) {
        initialActiveItem.classList.add('active');
    }
    if (qParam && (!initialActiveItem || !initialActiveItem.dataset.q)) {
        searchBox.value = qParam;
    }

    function displayProducts(filteredProducts) {
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<p>No products found.</p>';
            return;
        }
        productGrid.innerHTML = filteredProducts.map(createProductCard).join('');
    }

    function filterAndDisplay() {
        const activeItem = categoryFilters.querySelector('li.active');
        const activeCategory = activeItem ? activeItem.dataset.category : 'All';
        const qFilter = activeItem && activeItem.dataset.q ? activeItem.dataset.q.toLowerCase() : '';
        const combined = `${qFilter} ${searchBox.value}`.trim().toLowerCase();
        const tokens = combined.split(/\s+/).filter(Boolean);

        const filteredProducts = products.filter(p => {
            const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            if (tokens.length === 0) return matchesCategory;
            const haystack = `${p.name} ${p.tags.join(' ')}`.toLowerCase();
            const matchesTokens = tokens.every(tok => haystack.includes(tok));
            return matchesCategory && matchesTokens;
        });

        displayProducts(filteredProducts);
    }

    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            searchBox.value = item.dataset.q || '';
            filterAndDisplay();
        });
    });

    searchBox.addEventListener('input', filterAndDisplay);
    filterAndDisplay();
}

// --- PRODUCT DETAIL PAGE ---
async function loadProductDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const container = document.getElementById('product-detail-container');
    if (!productId || !container) return;

    const product = await ProductDB.getProductById(productId);

    if (!product) {
        container.innerHTML = '<p>Product not found.</p>';
        return;
    }

    document.title = `${product.name} - FinGaurd RO Water Purifier Systems`;
    
    const price = product.sellingPrice || product.price || 0;
    const structuredData = {
        "@context": "http://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": getStructuredImageList(product),
        "description": product.description,
        "sku": product.sku,
        "brand": { "@type": "Brand", "name": "FinGaurd" },
        "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "INR",
            "availability": "http://schema.org/InStock"
        },
        "category": product.category
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    container.innerHTML = generateDetailedProductHTML(product);

    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value) || 1;
        const productImage = getPrimaryImage(product);
        Cart.addItem(
            product.id,
            product.name,
            product.sku,
            product.price,
            productImage,
            quantity,
            addToCartButton
        );
    });

    document.getElementById('query-whatsapp').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        const message = WhatsApp.generateSingleProductMessage(product, quantity);
        WhatsApp.send(message);
    });
}

function generateDetailedProductHTML(product) {
    const primaryImage = getPrimaryImage(product);
    const price = product.sellingPrice || product.price || 0;
    let html = `
        <div class="product-image" itemscope itemtype="http://schema.org/Product">
            <img src="${primaryImage}" alt="${product.name}" itemprop="image">
        </div>
        <div class="product-info" itemprop="mainEntity" itemscope itemtype="http://schema.org/Product">
            <h1 itemprop="name">${product.name}</h1>
            <p class="sku">SKU: <span itemprop="sku">${product.sku}</span></p>
            <p class="price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
                <span itemprop="price" content="${price}">${currency}${price.toLocaleString()}</span>
                <meta itemprop="priceCurrency" content="INR">
                <meta itemprop="availability" content="http://schema.org/InStock">
            </p>
            <p class="description" itemprop="description">${product.description}</p>
            <p style="margin:0;color:var(--success-color);font-weight:600">GST invoice available • PAN India Shipping</p>
            
            <div class="product-actions">
                <div class="quantity-section">
                    <label class="quantity-label" for="quantity">Quantity:</label>
                    <input type="number" id="quantity" value="1" min="1" max="10" aria-label="Quantity">
                </div>
                <div class="action-buttons">
                    <button class="btn-primary" id="add-to-cart">Add to Cart</button>
                    <button class="btn-whatsapp" id="query-whatsapp">Query on WhatsApp</button>
                </div>
            </div>
            <div class="cta-guarantee" style="justify-content:flex-start;gap:var(--spacing-sm);margin-top:var(--spacing-sm)">
                <a href="wholesale.html" class="btn-outline">Request Wholesale Quote</a>
            </div>
    `;

    if (product.specifications) {
        html += `<div class="product-specifications"><h3>Specifications</h3><div class="spec-grid">`;
        Object.entries(product.specifications).forEach(([key, value]) => {
            if (value && value !== "" && value !== null) {
                const label = formatSpecLabel(key);
                const formattedValue = Array.isArray(value) ? value.join(', ') : value.toString();
                html += `<div class="spec-item"><span class="spec-label">${label}:</span><span class="spec-value">${formattedValue}</span></div>`;
            }
        });
        html += `</div></div>`;
    }

    if (product.features) {
        html += `<div class="product-features"><h3>Key Features</h3>`;
        Object.entries(product.features).forEach(([category, items]) => {
            if (items && items.length > 0) {
                const categoryLabel = formatSpecLabel(category);
                html += `<div class="feature-category"><h4>${categoryLabel}</h4><ul>`;
                items.forEach(item => { html += `<li>${item}</li>`; });
                html += `</ul></div>`;
            }
        });
        html += `</div>`;
    }

    if (product.waterQuality) {
        html += `<div class="water-quality"><h3>Water Quality Performance</h3><div class="spec-grid">`;
        Object.entries(product.waterQuality).forEach(([key, value]) => {
            if (value && value !== "" && value !== null) {
                const label = formatSpecLabel(key);
                html += `<div class="spec-item"><span class="spec-label">${label}:</span><span class="spec-value">${value}</span></div>`;
            }
        });
        html += `</div></div>`;
    }

    if (product.installation) {
        html += `<div class="installation-info"><h3>Installation Information</h3><div class="spec-grid">`;
        Object.entries(product.installation).forEach(([key, value]) => {
            if (value && value !== "" && value !== null) {
                const label = formatSpecLabel(key);
                html += `<div class="spec-item"><span class="spec-label">${label}:</span><span class="spec-value">${value}</span></div>`;
            }
        });
        html += `</div></div>`;
    }

    html += `<div itemprop="brand" itemscope itemtype="http://schema.org/Brand"><meta itemprop="name" content="FinGaurd"></div></div>`;
    return html;
}

// --- CART PAGE ---
async function loadCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    const checkoutButton = document.getElementById('checkout-whatsapp');
    if (!cartItemsContainer) return;

    const cart = Cart.getCart();
    const allProducts = await ProductDB.getAllProducts();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any water purifiers to your cart yet.</p>
                <a href="products.html" class="btn-primary">Browse Products</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }

    let cartHTML = '';
    let total = 0;

    cart.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (product) {
            const price = product.sellingPrice || product.price || 0;
            total += price * item.quantity;
            const primaryImage = getPrimaryImage(product);
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-top">
                        <img src="${primaryImage}" alt="${product.name}" onclick="goToProduct('${product.sku}')">
                        <div class="cart-item-info">
                            <h3 onclick="goToProduct('${product.sku}')">${product.name}</h3>
                            <p>SKU: ${product.sku}</p>
                            <p>Unit Price: ${currency}${price.toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <label>Qty:</label>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        </div>
                        <div class="cart-item-price">${currency}${(price * item.quantity).toLocaleString()}</div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
        }
    });

    cartItemsContainer.innerHTML = cartHTML;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartSummary.querySelector('#total-price').textContent = `${currency}${total.toLocaleString()}`;
    cartSummary.querySelector('#total-items').textContent = `${totalItems} Item${totalItems === 1 ? '' : 's'}`;
    
    const cartSubtitle = document.getElementById('cart-subtitle');
    if (cartSubtitle) {
        cartSubtitle.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'} in your cart`;
    }

    cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const quantity = parseInt(e.target.value);
            Cart.updateItemQuantity(id, quantity);
            loadCartPage();
        });
    });

    cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            Cart.removeItem(id);
            loadCartPage();
        });
    });

    checkoutButton.addEventListener('click', async () => {
        const message = await WhatsApp.generateCartMessage();
        WhatsApp.send(message);
        Cart.clearCart();
        loadCartPage();
    });
}

// --- UTILITY ---
function goToProduct(sku) {
    ProductDB.getAllProducts().then(products => {
        const product = products.find(p => p.sku === sku);
        if (product) {
            window.location.href = `product.html?id=${product.id}`;
        }
    });
}

// ============================================================================
// 10. FORM HANDLERS
// ============================================================================

// --- EXPERT ADVICE FORM ---
function setupExpertAdviceForm() {
    const form = document.getElementById('expert-advice-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const phone = formData.get('phone').trim();
        const address = formData.get('address').trim();
        const familySize = formData.get('familySize');
        const waterSource = formData.get('waterSource');

        let isValid = true;

        if (!name || name.length < 2) {
            document.getElementById('name-error').textContent = 'Please enter a valid name (at least 2 characters)';
            document.getElementById('user-name').classList.add('error');
            isValid = false;
        }

        const phonePattern = /^[6-9]\d{9}$/;
        if (!phone || !phonePattern.test(phone)) {
            document.getElementById('phone-error').textContent = 'Please enter a valid 10-digit Indian mobile number';
            document.getElementById('user-phone').classList.add('error');
            isValid = false;
        }

        if (!address || address.length < 5) {
            document.getElementById('address-error').textContent = 'Please enter your complete address/locality';
            document.getElementById('user-address').classList.add('error');
            isValid = false;
        }

        if (isValid) {
            let message = `🏠 *Expert Consultation Request*\n\n`;
            message += `👤 *Customer Details:*\n`;
            message += `• *Name:* ${name}\n`;
            message += `• *Phone:* ${phone}\n`;
            message += `• *Location:* ${address}\n`;
            
            if (familySize || waterSource) {
                message += `\n📋 *Requirements:*\n`;
                if (familySize) message += `• *Family Size:* ${familySize}\n`;
                if (waterSource) message += `• *Water Source:* ${waterSource}\n`;
            }
            
            message += `\n✨ *Request:*\nI'm interested in getting expert advice for choosing the right RO water purifier for my home. Please help me with the best recommendations based on my requirements.\n\n`;
            message += `Thank you! 🙏`;

            WhatsApp.send(message);
            form.reset();
            showAlert('Thank you! Your consultation request has been sent. Our expert will contact you shortly.', 'success');
        }
    });
}

// --- WHOLESALE RFQ FORM ---
function setupWholesaleForm() {
    const form = document.getElementById('wholesale-form');
    if (!form) return;

    form.addEventListener('submit', function(e){
        e.preventDefault();

        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        const fd = new FormData(form);
        const bizName = (fd.get('bizName') || '').trim();
        const contactPerson = (fd.get('contactPerson') || '').trim();
        const phone = (fd.get('phone') || '').trim();
        const email = (fd.get('email') || '').trim();
        const city = (fd.get('city') || '').trim();
        const gstin = (fd.get('gstin') || '').trim();
        const monthlyVolume = fd.get('monthlyVolume') || '';
        const requirements = (fd.get('requirements') || '').trim();
        const notes = (fd.get('notes') || '').trim();

        let ok = true;
        if (bizName.length < 2) { 
            document.getElementById('biz-name-error').textContent = 'Please enter your business name'; 
            document.getElementById('biz-name').classList.add('error'); 
            ok = false; 
        }
        if (contactPerson.length < 2) { 
            document.getElementById('contact-person-error').textContent = 'Please enter contact person'; 
            document.getElementById('contact-person').classList.add('error'); 
            ok = false; 
        }
        const phonePattern = /^[6-9]\d{9}$/; 
        if (!phonePattern.test(phone)) { 
            document.getElementById('phone-error').textContent = 'Enter a valid 10‑digit Indian mobile number'; 
            document.getElementById('phone').classList.add('error'); 
            ok = false; 
        }
        if (!city) { 
            document.getElementById('city-error').textContent = 'Enter City/State'; 
            document.getElementById('city').classList.add('error'); 
            ok = false; 
        }

        if (!ok) return;

        let msg = `*Wholesale / Dealer RFQ*\n\n`;
        msg += `• *Business:* ${bizName}\n`;
        msg += `• *Contact:* ${contactPerson}\n`;
        msg += `• *Mobile:* ${phone}\n`;
        if (email) msg += `• *Email:* ${email}\n`;
        msg += `• *City/State:* ${city}\n`;
        if (gstin) msg += `• *GSTIN:* ${gstin}\n`;
        if (monthlyVolume) msg += `• *Expected Volume:* ${monthlyVolume}\n`;
        if (requirements) msg += `\n*Requested SKUs & Qty:* ${requirements}\n`;
        if (notes) msg += `\n*Notes:* ${notes}\n`;
        msg += `\nPlease share dealer pricing, MOQs, and lead times. Thank you.`;

        WhatsApp.send(msg);
        showAlert('Your wholesale request has been sent on WhatsApp. We will respond with pricing shortly.', 'success');
        form.reset();
    });
}

// ============================================================================
// 11. ACCORDION AUTO-CLOSE FUNCTIONALITY
// ============================================================================
function setupAccordions() {
    const detailsElements = document.querySelectorAll('details');
    
    detailsElements.forEach((details) => {
        details.addEventListener('toggle', () => {
            if (details.open) {
                // Close all other accordions
                detailsElements.forEach((otherDetails) => {
                    if (otherDetails !== details && otherDetails.open) {
                        otherDetails.open = false;
                    }
                });
            }
        });
    });
}

// ============================================================================
// 12. INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load components first
    await loadIncludes();
    
    // Setup scroll reveal
    setupScrollReveal();
    
    // Setup accordions auto-close
    setupAccordions();
    
    // Route to appropriate page loader
    const path = window.location.pathname.split("/").pop();
    
    if (path === 'index.html' || path === '') {
        loadHomePage();
        setupExpertAdviceForm();
        setupWholesaleForm();
    } else if (path === 'products.html') {
        loadProductsPage();
    } else if (path === 'product.html') {
        loadProductDetailPage();
    } else if (path === 'cart.html') {
        loadCartPage();
    } else if (path === 'wholesale.html') {
        setupWholesaleForm();
    } else if (path === 'contact.html' || path === 'service.html') {
        // Re-setup accordions after page specific content loads
        setTimeout(() => setupAccordions(), 500);
    }
    
    // Update cart icon immediately and after delay to ensure DOM is ready
    Cart.updateCartIcon();
    setTimeout(() => Cart.updateCartIcon(), 200);
});

// Export for global access
window.Cart = Cart;
window.setupWholesaleForm = setupWholesaleForm;
window.setupAccordions = setupAccordions;
