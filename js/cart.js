// --- CONFIGURATION ---
const WHATSAPP_PHONE_NUMBER = "919821560609";
const currency = '₹';

// --- CART LOGIC ---
const Cart = {
    getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },
    
    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartIcon();
    },
    
    addItem(productId, productName, productSku, productPrice, productImage, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: productName,
                sku: productSku,
                price: productPrice,
                image: productImage,
                quantity: quantity
            });
        }
        
        this.saveCart(cart);
        this.showAddedFeedback();
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
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getCartCount();
        
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'inline-flex';
        });
    },
    
    clearCart() {
        localStorage.removeItem('cart');
        this.updateCartIcon();
    },
    
    showAddedFeedback() {
        // Find any "Add to Cart" buttons and show feedback
        const addButtons = document.querySelectorAll('[data-cart-feedback]');
        addButtons.forEach(btn => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <span class="material-symbols-rounded">check_circle</span>
                <span>Added to Cart!</span>
            `;
            btn.classList.add('bg-green-600');
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('bg-green-600');
                btn.disabled = false;
            }, 2000);
        });
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
        const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${message}`;
        window.open(url, '_blank');
    }
};

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateCartIcon();
});
