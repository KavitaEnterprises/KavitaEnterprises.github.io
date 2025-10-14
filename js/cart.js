// --- CONFIGURATION ---
const WHATSAPP_PHONE_NUMBER = "919821560609";
const currency = '₹';

// --- CART LOGIC ---
const Cart = {
    storageKey: 'cart',

    getCart() {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('Invalid cart data detected. Resetting cart.', error);
            localStorage.removeItem(this.storageKey);
            return [];
        }
    },

    saveCart(cart) {
        if (!Array.isArray(cart)) {
            console.warn('Attempted to save non-array cart payload. Ignoring save request.');
            return;
        }

        localStorage.setItem(this.storageKey, JSON.stringify(cart));
        this.updateCartIcon();
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
    },

    addItem(productId, productName, productSku, productPrice, productImage, quantity = 1, triggerButton = null) {
        const cart = this.getCart();
        const normalizedId = String(productId);

        // Support legacy signature: addItem(id, quantity)
        if (arguments.length <= 2) {
            const legacyQuantity = Math.max(1, Number(productName) || 1);
            const existingLegacyItem = cart.find(item => String(item.id) === normalizedId);

            if (existingLegacyItem) {
                existingLegacyItem.quantity = Math.max(1, Number(existingLegacyItem.quantity) || 0) + legacyQuantity;
            } else {
                cart.push({ id: productId, quantity: legacyQuantity });
            }

            this.saveCart(cart);
            this.showAddedFeedback(triggerButton);
            return cart;
        }

        const normalizedQuantity = Math.max(1, Number(quantity) || 1);
        const existingItem = cart.find(item => String(item.id) === normalizedId);

        if (existingItem) {
            existingItem.quantity = Math.max(1, Number(existingItem.quantity) || 0) + normalizedQuantity;
            existingItem.name = productName ?? existingItem.name;
            existingItem.sku = productSku ?? existingItem.sku;
            existingItem.price = Number(productPrice ?? existingItem.price) || existingItem.price || 0;
            existingItem.image = productImage || existingItem.image;
        } else {
            cart.push({
                id: productId,
                name: productName,
                sku: productSku,
                price: Number(productPrice) || 0,
                image: productImage,
                quantity: normalizedQuantity
            });
        }

        this.saveCart(cart);
        this.showAddedFeedback(triggerButton);
        return cart;
    },

    updateItemQuantity(id, quantity) {
        const normalizedId = String(id);
        const normalizedQuantity = Math.max(0, Number(quantity) || 0);

        const updatedCart = this.getCart()
            .map(item => {
                if (String(item.id) !== normalizedId) {
                    return item;
                }

                return { ...item, quantity: normalizedQuantity };
            })
            .filter(item => Number(item.quantity) > 0);

        this.saveCart(updatedCart);
    },

    removeItem(id) {
        const normalizedId = String(id);
        const cart = this.getCart().filter(item => String(item.id) !== normalizedId);
        this.saveCart(cart);
    },

    getCartCount() {
        return this.getCart().reduce((count, item) => count + Math.max(0, Number(item.quantity) || 0), 0);
    },

    updateCartIcon() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getCartCount();

        cartCountElements.forEach(element => {
            if (!element) return;

            if (count > 0) {
                element.textContent = count;
                element.classList.remove('hidden');
                element.setAttribute('aria-hidden', 'false');
            } else {
                element.textContent = '';
                element.classList.add('hidden');
                element.setAttribute('aria-hidden', 'true');
            }
        });
    },

    clearCart() {
        localStorage.removeItem(this.storageKey);
        this.updateCartIcon();
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: [] } }));
    },

    showAddedFeedback(triggerButton = null) {
        const targets = triggerButton ? [triggerButton] : document.querySelectorAll('[data-cart-feedback]');

        targets.forEach(btn => {
            if (!btn) return;

            const originalHTML = btn.dataset.originalLabel || btn.innerHTML;
            if (!btn.dataset.originalLabel) {
                btn.dataset.originalLabel = originalHTML;
            }

            btn.innerHTML = `
                <span class="material-symbols-rounded">check_circle</span>
                <span>Added to Cart!</span>
            `;
            btn.classList.add('bg-green-600', 'hover:bg-green-700', 'text-white');
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = btn.dataset.originalLabel;
                btn.classList.remove('bg-green-600', 'hover:bg-green-700', 'text-white');
                btn.disabled = false;
            }, 2000);
        });
    }
};

// --- FAVORITES / WISHLIST LOGIC ---
const Favorites = {
    storageKey: 'favorites',

    getAll() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    },

    save(favorites) {
        localStorage.setItem(this.storageKey, JSON.stringify(favorites));
        document.dispatchEvent(new CustomEvent('favorites:updated', { detail: { favorites } }));
    },

    isSaved(id) {
        const normalizedId = Number(id);
        return this.getAll().some(savedId => Number(savedId) === normalizedId);
    },

    toggle(id) {
        const normalizedId = Number(id);
        const favorites = this.getAll().map(Number);
        const index = favorites.indexOf(normalizedId);

        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push(normalizedId);
        }

        this.save(favorites);
        return favorites.includes(normalizedId);
    },

    set(id, shouldSave) {
        const normalizedId = Number(id);
        const favorites = this.getAll().map(Number);
        const index = favorites.indexOf(normalizedId);

        if (shouldSave && index === -1) {
            favorites.push(normalizedId);
        }

        if (!shouldSave && index !== -1) {
            favorites.splice(index, 1);
        }

        this.save(favorites);
        return shouldSave;
    }
};

// --- WHATSAPP MESSAGE GENERATOR ---
const WhatsApp = {
    generateProductMessage(product, quantity) {
        let message = `💧 *PRODUCT INQUIRY*\n\n`;
        message += `📦 *Product Details:*\n`;
        message += `${product.name}\n`;
        message += `SKU: ${product.sku}\n`;
        message += `Quantity: ${quantity}\n`;
        message += `Price: ${currency}${product.price.toLocaleString('en-IN')} per unit\n\n`;
        message += `I would like more information about this product.\n\n`;
        message += `---\n`;
        message += `Inquiry from: ${window.location.origin}`;

        return encodeURIComponent(message);
    },

    async generateCartMessage() {
        const cart = Cart.getCart();

        if (cart.length === 0) {
            return encodeURIComponent('Hello, I would like to inquire about your products.');
        }

        let message = `🛒 *NEW ORDER REQUEST*\n\n`;
        message += `🛍️ *Order Items:*\n`;

        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            message += `${index + 1}. ${item.name}\n`;
            message += `   SKU: ${item.sku}\n`;
            message += `   Qty: ${item.quantity} × ${currency}${item.price.toLocaleString('en-IN')} = ${currency}${itemTotal.toLocaleString('en-IN')}\n\n`;
        });

        message += `💰 *Total Amount: ${currency}${total.toLocaleString('en-IN')}*\n`;
        message += `✅ Free Delivery • Free Installation • 1 Year Warranty\n\n`;
        message += `Please confirm availability and delivery timeline.\n\n`;
        message += `---\n`;
        message += `Order from: ${window.location.origin}`;

        return encodeURIComponent(message);
    },

    send(message) {
        if (!message) {
            return;
        }

        let encodedMessage = message;
        try {
            // If decoding succeeds, the message was encoded; otherwise encode it now.
            if (decodeURIComponent(message) === message) {
                encodedMessage = encodeURIComponent(message);
            }
        } catch (error) {
            encodedMessage = encodeURIComponent(message);
        }

        const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
        window.open(url, '_blank');
    }
};

// --- GLOBAL EXPORTS & INITIALIZE ---
window.Cart = Cart;
window.Favorites = Favorites;
window.WhatsApp = WhatsApp;

document.addEventListener('DOMContentLoaded', () => {
    Cart.updateCartIcon();
});
