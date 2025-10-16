/**
 * Cart Module - ES6
 * Handles all shopping cart operations
 * @module cart
 */

import { CONFIG } from '../config.js';

class CartManager {
	constructor() {
		this.storageKey = CONFIG.cart.storageKey || 'cart';
		this.currency = CONFIG.site.currencySymbol || '₹';
	}

	/**
	 * Get cart items from localStorage
	 * @returns {Array} Array of cart items
	 */
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
	}

	/**
	 * Save cart to localStorage
	 * @param {Array} cart - Cart items array
	 */
	saveCart(cart) {
		if (!Array.isArray(cart)) {
			console.warn('Attempted to save non-array cart payload. Ignoring save request.');
			return;
		}

		localStorage.setItem(this.storageKey, JSON.stringify(cart));
		this.updateCartIcon();
		document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
	}

	/**
	 * Add item to cart
	 * @param {string|number} productId - Product ID
	 * @param {string} productName - Product name
	 * @param {string} productSku - Product SKU
	 * @param {number} productPrice - Product price
	 * @param {string} productImage - Product image URL
	 * @param {number} quantity - Quantity to add
	 * @param {HTMLElement} triggerButton - Button that triggered the action
	 * @returns {Array} Updated cart
	 */
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
	}

	/**
	 * Update item quantity
	 * @param {string|number} id - Product ID
	 * @param {number} quantity - New quantity
	 */
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
	}

	/**
	 * Remove item from cart
	 * @param {string|number} id - Product ID
	 */
	removeItem(id) {
		const normalizedId = String(id);
		const cart = this.getCart().filter(item => String(item.id) !== normalizedId);
		this.saveCart(cart);
	}

	/**
	 * Get total number of items in cart
	 * @returns {number} Total count
	 */
	getCartCount() {
		return this.getCart().reduce((count, item) => count + Math.max(0, Number(item.quantity) || 0), 0);
	}

	/**
	 * Update cart icon badge
	 */
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
	}

	/**
	 * Clear entire cart
	 */
	clearCart() {
		localStorage.removeItem(this.storageKey);
		this.updateCartIcon();
		document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: [] } }));
	}

	/**
	 * Show visual feedback when item is added
	 * @param {HTMLElement} triggerButton - Button to show feedback on
	 */
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

	/**
	 * Get cart total value
	 * @returns {number} Total price
	 */
	getCartTotal() {
		return this.getCart().reduce((total, item) => {
			return total + (Number(item.price) || 0) * (Number(item.quantity) || 0);
		}, 0);
	}

	/**
	 * Check if cart is empty
	 * @returns {boolean}
	 */
	isEmpty() {
		return this.getCartCount() === 0;
	}
}

// Create and export singleton instance
const cart = new CartManager();

// Make available globally for backward compatibility
if (typeof window !== 'undefined') {
	window.Cart = cart;
}

export default cart;
export { CartManager };
