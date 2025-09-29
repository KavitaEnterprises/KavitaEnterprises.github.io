// --- CUSTOM ALERT SYSTEM ---
function showAlert(message, type = 'info', duration = 10000) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert ${type}`;
    
    alertDiv.innerHTML = `
        <div class="custom-alert-content">
            <div class="custom-alert-message">${message}</div>
            <button class="custom-alert-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(alertDiv);
    
    // Show alert with animation
    setTimeout(() => alertDiv.classList.add('show'), 100);
    
    // Auto remove after duration
    setTimeout(() => {
        if (document.body.contains(alertDiv)) {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }
    }, duration);
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split("/").pop();

    if (path === 'index.html' || path === '') {
        loadHomePage();
        setupExpertAdviceForm();
        if (window.setupWholesaleForm) window.setupWholesaleForm();
    } else if (path === 'products.html') {
        loadProductsPage();
    } else if (path === 'product.html') {
        loadProductDetailPage();
    } else if (path === 'cart.html') {
        loadCartPage();
    } else if (path === 'wholesale.html') {
        if (window.setupWholesaleForm) window.setupWholesaleForm();
    }
});

function createProductCard(product) {
    return `
        <div class="product-card" itemscope itemtype="http://schema.org/Product">
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" itemprop="image" loading="lazy">
                <div class="product-card-content">
                    <h3 itemprop="name">${product.name}</h3>
                    <p class="price" itemprop="price" content="${product.price}">${currency}${product.price.toLocaleString()}</p>
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

// --- HOME PAGE ---
async function loadHomePage() {
    const featuredGrid = document.getElementById('featured-products-grid');
    if (!featuredGrid) return;
    
    const products = await ProductDB.getAllProducts();
    // Show first 4 products as featured
    featuredGrid.innerHTML = products.slice(0, 4).map(createProductCard).join('');
}

// --- PRODUCTS PAGE ---
async function loadProductsPage() {
    const products = await ProductDB.getAllProducts();
    const productGrid = document.getElementById('product-grid');
    const categoryFilters = document.getElementById('category-filters');
    const searchBox = document.getElementById('search-box');

    if (!productGrid) return;

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const qParam = urlParams.get('q') || '';

    // Define displayed categories to align with footer
    const displayedCategories = [
        { label: 'All', category: 'All' },
        { label: 'RO Systems', category: 'RO Systems' },
        { label: 'Filters', category: 'Filters' },
        { label: 'Accessories', category: 'Spares' },
        { label: 'Membranes', category: 'Spares', q: 'membrane' }
    ];

    // Render category filters with optional q filters
    categoryFilters.innerHTML = `<ul>${displayedCategories.map(c => `<li data-category="${c.category}"${c.q ? ` data-q="${c.q}"` : ''}>${c.label}</li>`).join('')}</ul>`;

    const categoryItems = categoryFilters.querySelectorAll('li');

    // Determine initial active item
    let initialActiveItem = null;
    // Priority: if q=membrane and category is Spares (or missing), activate Membranes
    if (qParam && qParam.toLowerCase().includes('membrane')) {
        initialActiveItem = Array.from(categoryItems).find(li => li.textContent.trim() === 'Membranes') || null;
    }
    if (!initialActiveItem) {
        // If category matches a displayed item, use it; map 'Spares' -> Accessories by default
        const desiredCategory = categoryParam || 'All';
        initialActiveItem = Array.from(categoryItems).find(li => li.dataset.category === desiredCategory && (!li.dataset.q))
            || Array.from(categoryItems).find(li => li.dataset.category === desiredCategory)
            || Array.from(categoryItems).find(li => li.dataset.category === 'All');
    }
    if (initialActiveItem) {
        initialActiveItem.classList.add('active');
    }
    // If URL provides q, reflect it in search box unless Membranes virtual filter will set it
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
        // Combine the virtual filter q with user-entered search
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
            // Reflect virtual q filter in search box for clarity
            searchBox.value = item.dataset.q || '';
            filterAndDisplay();
        });
    });

    searchBox.addEventListener('input', filterAndDisplay);

    // Initial display with category filtering
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

    // Update page title and meta description
    document.title = `${product.name} - FinGaurd RO Water Purifier Systems`;
    
    // Add structured data
    const structuredData = {
        "@context": "http://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": product.description,
        "sku": product.sku,
        "brand": {
            "@type": "Brand",
            "name": "FinGaurd"
        },
        "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "INR",
            "availability": "http://schema.org/InStock"
        },
        "category": product.category
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Generate detailed product information
    const detailedHTML = generateDetailedProductHTML(product);
    
    container.innerHTML = detailedHTML;

    document.getElementById('add-to-cart').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        Cart.addItem(product.id, quantity);
    });

    document.getElementById('query-whatsapp').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        const message = WhatsApp.generateSingleProductMessage(product, quantity);
        WhatsApp.send(message);
    });
}

// --- DETAILED PRODUCT HTML GENERATOR ---
function generateDetailedProductHTML(product) {
    let html = `
        <div class="product-image" itemscope itemtype="http://schema.org/Product">
            <img src="${product.image}" alt="${product.name}" itemprop="image">
        </div>
        <div class="product-info" itemprop="mainEntity" itemscope itemtype="http://schema.org/Product">
            <h1 itemprop="name">${product.name}</h1>
            <p class="sku">SKU: <span itemprop="sku">${product.sku}</span></p>
            <p class="price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
                <span itemprop="price" content="${product.price}">${currency}${product.price.toLocaleString()}</span>
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

    // Add specifications if available
    if (product.specifications) {
        html += `<div class="product-specifications">
            <h3>Specifications</h3>
            <div class="spec-grid">`;
        
        Object.entries(product.specifications).forEach(([key, value]) => {
            if (value && value !== "" && value !== null) {
                const label = formatSpecLabel(key);
                const formattedValue = Array.isArray(value) ? value.join(', ') : value.toString();
                html += `
                    <div class="spec-item">
                        <span class="spec-label">${label}:</span>
                        <span class="spec-value">${formattedValue}</span>
                    </div>`;
            }
        });
        
        html += `</div></div>`;
    }

    // Add features if available
    if (product.features) {
        html += `<div class="product-features">
            <h3>Key Features</h3>`;
        
        Object.entries(product.features).forEach(([category, items]) => {
            if (items && items.length > 0) {
                const categoryLabel = formatSpecLabel(category);
                html += `
                    <div class="feature-category">
                        <h4>${categoryLabel}</h4>
                        <ul>`;
                items.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += `</ul>
                    </div>`;
            }
        });
        
        html += `</div>`;
    }

    // Add water quality specs if available
    if (product.waterQuality) {
        html += `<div class="water-quality">
            <h3>Water Quality Performance</h3>
            <div class="spec-grid">`;
        
        Object.entries(product.waterQuality).forEach(([key, value]) => {
            if (value && value !== "" && value !== null) {
                const label = formatSpecLabel(key);
                html += `
                    <div class="spec-item">
                        <span class="spec-label">${label}:</span>
                        <span class="spec-value">${value}</span>
                    </div>`;
            }
        });
        
        html += `</div></div>`;
    }

    // Add installation info if available
    if (product.installation) {
        html += `<div class="installation-info">
            <h3>Installation Information</h3>
            <div class="spec-grid">`;
        
        Object.entries(product.installation).forEach(([key, value]) => {
            if (value && value !== "" && value !== null) {
                const label = formatSpecLabel(key);
                html += `
                    <div class="spec-item">
                        <span class="spec-label">${label}:</span>
                        <span class="spec-value">${value}</span>
                    </div>`;
            }
        });
        
        html += `</div></div>`;
    }

    html += `
            <div itemprop="brand" itemscope itemtype="http://schema.org/Brand">
                <meta itemprop="name" content="FinGaurd">
            </div>
        </div>`;

    return html;
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
            total += product.price * item.quantity;
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-top">
                        <img src="${product.image}" alt="${product.name}" onclick="goToProduct('${product.sku}')">
                        <div class="cart-item-info">
                            <h3 onclick="goToProduct('${product.sku}')">${product.name}</h3>
                            <p>SKU: ${product.sku}</p>
                            <p>Unit Price: ${currency}${product.price.toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <label>Qty:</label>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        </div>
                        <div class="cart-item-price">${currency}${(product.price * item.quantity).toLocaleString()}</div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
        }
    });

    cartItemsContainer.innerHTML = cartHTML;
    
    // Update cart summary
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartSummary.querySelector('#total-price').textContent = `${currency}${total.toLocaleString()}`;
    cartSummary.querySelector('#total-items').textContent = `${totalItems} Item${totalItems === 1 ? '' : 's'}`;
    
    // Update cart subtitle
    const cartSubtitle = document.getElementById('cart-subtitle');
    if (cartSubtitle) {
        cartSubtitle.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'} in your cart`;
    }

    cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const quantity = parseInt(e.target.value);
            Cart.updateItemQuantity(id, quantity);
            loadCartPage(); // Refresh the cart display
        });
    });

    cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            Cart.removeItem(id);
            loadCartPage(); // Refresh the cart display
        });
    });

    checkoutButton.addEventListener('click', async () => {
        const message = await WhatsApp.generateCartMessage();
        WhatsApp.send(message);
        Cart.clearCart();
        loadCartPage();
    });
}

// --- UTILITY FUNCTIONS ---
function goToProduct(sku) {
    // Find product by SKU
    ProductDB.getAllProducts().then(products => {
        const product = products.find(p => p.sku === sku);
        if (product) {
            window.location.href = `product.html?id=${product.id}`;
        }
    });
}



// --- EXPERT ADVICE FORM ---
function setupExpertAdviceForm() {
    const form = document.getElementById('expert-advice-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const phone = formData.get('phone').trim();
        const address = formData.get('address').trim();
        const familySize = formData.get('familySize');
        const waterSource = formData.get('waterSource');

        let isValid = true;

        // Validate name
        if (!name || name.length < 2) {
            document.getElementById('name-error').textContent = 'Please enter a valid name (at least 2 characters)';
            document.getElementById('user-name').classList.add('error');
            isValid = false;
        }

        // Validate phone
        const phonePattern = /^[6-9]\d{9}$/;
        if (!phone || !phonePattern.test(phone)) {
            document.getElementById('phone-error').textContent = 'Please enter a valid 10-digit Indian mobile number';
            document.getElementById('user-phone').classList.add('error');
            isValid = false;
        }

        // Validate address
        if (!address || address.length < 5) {
            document.getElementById('address-error').textContent = 'Please enter your complete address/locality';
            document.getElementById('user-address').classList.add('error');
            isValid = false;
        }

        if (isValid) {
            // Generate WhatsApp message
            let message = `🏠 *Expert Consultation Request*\n\n`;
            message += `� *Customer Details:*\n`;
            message += `• *Name:* ${name}\n`;
            message += `• *Phone:* ${phone}\n`;
            message += `• *Location:* ${address}\n`;
            
            if (familySize || waterSource) {
                message += `\n� *Requirements:*\n`;
                if (familySize) {
                    message += `• *Family Size:* ${familySize}\n`;
                }
                if (waterSource) {
                    message += `• *Water Source:* ${waterSource}\n`;
                }
            }
            
            message += `\n✨ *Request:*\nI'm interested in getting expert advice for choosing the right RO water purifier for my home. Please help me with the best recommendations based on my requirements.\n\n`;
            message += `Thank you! 🙏`;

            // Send via WhatsApp
            WhatsApp.send(message);
            
            // Reset form
            form.reset();
            
            // Show success message
            showAlert('Thank you! Your consultation request has been sent. Our expert will contact you shortly.', 'success');
        }
    });
}

// --- WHOLESALE RFQ FORM ---
window.setupWholesaleForm = function setupWholesaleForm() {
    const form = document.getElementById('wholesale-form');
    if (!form) return;

    form.addEventListener('submit', function(e){
        e.preventDefault();

        // Clear errors
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
        if (bizName.length < 2) { document.getElementById('biz-name-error').textContent = 'Please enter your business name'; document.getElementById('biz-name').classList.add('error'); ok = false; }
        if (contactPerson.length < 2) { document.getElementById('contact-person-error').textContent = 'Please enter contact person'; document.getElementById('contact-person').classList.add('error'); ok = false; }
        const phonePattern = /^[6-9]\d{9}$/; 
        if (!phonePattern.test(phone)) { document.getElementById('phone-error').textContent = 'Enter a valid 10‑digit Indian mobile number'; document.getElementById('phone').classList.add('error'); ok = false; }
        if (!city) { document.getElementById('city-error').textContent = 'Enter City/State'; document.getElementById('city').classList.add('error'); ok = false; }

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