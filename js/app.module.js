/**
 * Main Application Module - ES6
 * Central initialization and coordination
 * @module app
 */

import { CONFIG } from './config.js';
import cart from './modules/cart.module.js';
import favorites from './modules/favorites.module.js';
import whatsapp from './modules/whatsapp.module.js';
import search from './modules/search.module.js';

/**
 * Application class
 */
class App {
	constructor() {
		this.initialized = false;
		this.products = [];
		this.config = CONFIG;
	}

	/**
	 * Initialize the application
	 */
	async init() {
		if (this.initialized) {
			console.warn('App already initialized');
			return;
		}

		try {
			// Load products if enabled
			if (CONFIG.products.dataSource) {
				await this.loadProducts();
			}

			// Initialize modules
			cart.updateCartIcon();

			// Set up event listeners
			this.setupEventListeners();

			this.initialized = true;
			console.log('✅ FinGaurd App initialized successfully');
		} catch (error) {
			console.error('❌ Failed to initialize app:', error);
		}
	}

	/**
	 * Load products from JSON
	 */
	async loadProducts() {
		try {
			const response = await fetch(CONFIG.products.dataSource);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			this.products = await response.json();
			
			// Initialize search with products
			search.initialize(this.products);
			
			console.log(`📦 Loaded ${this.products.length} products`);
			
			// Dispatch event
			document.dispatchEvent(new CustomEvent('products:loaded', { 
				detail: { products: this.products } 
			}));
			
			return this.products;
		} catch (error) {
			console.error('Failed to load products:', error);
			this.products = [];
			return [];
		}
	}

	/**
	 * Get all products
	 * @returns {Array} Products array
	 */
	getProducts() {
		return this.products;
	}

	/**
	 * Get product by ID
	 * @param {string|number} id - Product ID
	 * @returns {Object|null} Product object
	 */
	getProduct(id) {
		return this.products.find(p => String(p.id) === String(id)) || null;
	}

	/**
	 * Setup global event listeners
	 */
	setupEventListeners() {
		// Mobile menu toggle
		const menuBtn = document.getElementById('menu-btn');
		const mobileNav = document.getElementById('mobile-nav');
		
		if (menuBtn && mobileNav) {
			menuBtn.addEventListener('click', () => {
				mobileNav.classList.toggle('hidden');
			});
		}

		// Close mobile menu when clicking outside
		document.addEventListener('click', (e) => {
			if (mobileNav && !mobileNav.classList.contains('hidden')) {
				if (!menuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
					mobileNav.classList.add('hidden');
				}
			}
		});

		// Update cart icon on storage change (for multi-tab sync)
		window.addEventListener('storage', (e) => {
			if (e.key === CONFIG.cart.storageKey) {
				cart.updateCartIcon();
			}
			if (e.key === CONFIG.favorites.storageKey) {
				document.dispatchEvent(new CustomEvent('favorites:updated'));
			}
		});
	}

	/**
	 * Show toast notification
	 * @param {string} message - Message to display
	 * @param {string} type - Type of toast (success, error, info, warning)
	 */
	showToast(message, type = 'info') {
		const toast = document.createElement('div');
		toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white animate-slide-in-right ${
			type === 'success' ? 'bg-green-600' :
			type === 'error' ? 'bg-red-600' :
			type === 'warning' ? 'bg-yellow-600' :
			'bg-blue-600'
		}`;
		toast.textContent = message;

		document.body.appendChild(toast);

		setTimeout(() => {
			toast.classList.add('opacity-0', 'transition-opacity');
			setTimeout(() => toast.remove(), 300);
		}, CONFIG.ui.toast.duration || 3000);
	}

	/**
	 * Format price with currency
	 * @param {number} price - Price value
	 * @returns {string} Formatted price
	 */
	formatPrice(price) {
		return `${CONFIG.site.currencySymbol}${Number(price).toLocaleString('en-IN')}`;
	}

	/**
	 * Get WhatsApp link with custom message
	 * @param {string} message - Message text
	 * @returns {string} WhatsApp URL
	 */
	getWhatsAppLink(message) {
		const encodedMsg = encodeURIComponent(message || CONFIG.social.whatsapp.message);
		return `${CONFIG.social.whatsapp.url}?text=${encodedMsg}`;
	}

	/**
	 * Render products to a container
	 * @param {Array} products - Products to render
	 * @param {HTMLElement} container - Container element
	 * @param {Function} templateFn - Template function
	 */
	renderProducts(products, container, templateFn) {
		if (!container) {
			console.warn('Container element not found');
			return;
		}

		if (!products || products.length === 0) {
			container.innerHTML = '<p class="text-center text-gray-500 py-12">No products found.</p>';
			return;
		}

		container.innerHTML = products.map(templateFn).join('');
	}
}

// Create and export singleton instance
const app = new App();

// Auto-initialize on DOMContentLoaded
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => app.init());
} else {
	app.init();
}

// Make available globally
if (typeof window !== 'undefined') {
	window.App = app;
	window.FinGaurd = app; // Branded name
}

export default app;
export { App };
