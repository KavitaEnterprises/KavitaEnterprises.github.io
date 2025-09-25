// --- CONFIGURATION ---
const WHATSAPP_PHONE_NUMBER = "919821560609"; // ⚠️ **CHANGE THIS to your WhatsApp number with country code**
const currency = '₹';

// --- PRODUCT DATABASE LOGIC ---
const ProductDB = {
    async getAllProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Network response was not ok.');
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch products:", error);
            return []; // Return empty array on error
        }
    },
    async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find(p => p.id === parseInt(id));
    }
};

// --- CART LOGIC ---
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
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'flex' : 'none';
        }
    },
    clearCart() {
        localStorage.removeItem('cart');
        this.updateCartIcon();
    }
};

// --- WHATSAPP MESSAGE GENERATOR ---
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
                message += `*${product.name}*\n`;
                message += `  - SKU: ${product.sku}\n`;
                message += `  - Quantity: ${item.quantity}\n`;
                message += `  - Price: ${currency}${product.price.toLocaleString()}\n\n`;
                total += product.price * item.quantity;
            }
        });

        message += `*Total Estimated Price: ${currency}${total.toLocaleString()}*`;
        return encodeURIComponent(message);
    },
    send(message) {
        // Check if message is already encoded (contains %)
        const encodedMessage = message.includes('%') ? message : encodeURIComponent(message);
        const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
        window.open(url, '_blank');
    }
};

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateCartIcon();
});