/**
 * WhatsApp Module - ES6
 * Handles WhatsApp message generation and sending
 * @module whatsapp
 */

import { CONFIG, getWhatsAppLink } from '../config.js';
import cart from './cart.module.js';

class WhatsAppManager {
	constructor() {
		this.phoneNumber = CONFIG.social.whatsapp.number;
		this.currency = CONFIG.site.currencySymbol || '₹';
	}

	/**
	 * Generate product inquiry message
	 * @param {Object} product - Product object
	 * @param {number} quantity - Quantity
	 * @returns {string} Encoded message
	 */
	generateProductMessage(product, quantity = 1) {
		let message = `💧 *PRODUCT INQUIRY*\n\n`;
		message += `📦 *Product Details:*\n`;
		message += `${product.name}\n`;
		
		if (product.sku) {
			message += `SKU: ${product.sku}\n`;
		}
		
		message += `Quantity: ${quantity}\n`;
		
		if (product.price) {
			message += `Price: ${this.currency}${product.price.toLocaleString('en-IN')} per unit\n`;
		}
		
		message += `\nI would like more information about this product.\n\n`;
		message += `---\n`;
		message += `Inquiry from: ${window.location.origin}`;

		return encodeURIComponent(message);
	}

	/**
	 * Generate cart checkout message
	 * @returns {Promise<string>} Encoded message
	 */
	async generateCartMessage() {
		const cartItems = cart.getCart();

		if (cartItems.length === 0) {
			const defaultMsg = CONFIG.social.whatsapp.message || 'Hello, I would like to inquire about your products.';
			return encodeURIComponent(defaultMsg);
		}

		let message = `🛒 *NEW ORDER REQUEST*\n\n`;
		message += `🛍️ *Order Items:*\n`;

		let total = 0;

		cartItems.forEach((item, index) => {
			const itemTotal = (item.price || 0) * (item.quantity || 1);
			total += itemTotal;

			message += `${index + 1}. ${item.name}\n`;
			
			if (item.sku) {
				message += `   SKU: ${item.sku}\n`;
			}
			
			message += `   Qty: ${item.quantity} × ${this.currency}${(item.price || 0).toLocaleString('en-IN')} = ${this.currency}${itemTotal.toLocaleString('en-IN')}\n\n`;
		});

		message += `💰 *Total Amount: ${this.currency}${total.toLocaleString('en-IN')}*\n`;
		
		// Add features from config
		const features = [];
		if (CONFIG.features.freeDelivery) features.push('Free Delivery');
		if (CONFIG.features.expertInstallation) features.push('Free Installation');
		if (CONFIG.services.warranty.default) features.push(`${CONFIG.services.warranty.default} Warranty`);
		
		if (features.length > 0) {
			message += `✅ ${features.join(' • ')}\n\n`;
		}
		
		message += `Please confirm availability and delivery timeline.\n\n`;
		message += `---\n`;
		message += `Order from: ${window.location.origin}`;

		return encodeURIComponent(message);
	}

	/**
	 * Generate custom message
	 * @param {string} text - Message text
	 * @returns {string} Encoded message
	 */
	generateCustomMessage(text) {
		return encodeURIComponent(text);
	}

	/**
	 * Send message via WhatsApp
	 * @param {string} message - Message to send (can be encoded or plain)
	 */
	send(message) {
		if (!message) {
			console.warn('No message provided');
			return;
		}

		let encodedMessage = message;
		
		// Check if message is already encoded
		try {
			if (decodeURIComponent(message) === message) {
				encodedMessage = encodeURIComponent(message);
			}
		} catch (error) {
			encodedMessage = encodeURIComponent(message);
		}

		const url = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
		window.open(url, '_blank');
	}

	/**
	 * Send product inquiry
	 * @param {Object} product - Product object
	 * @param {number} quantity - Quantity
	 */
	sendProductInquiry(product, quantity = 1) {
		const message = this.generateProductMessage(product, quantity);
		this.send(message);
	}

	/**
	 * Send cart checkout
	 */
	async sendCartCheckout() {
		const message = await this.generateCartMessage();
		this.send(message);
	}

	/**
	 * Send custom message
	 * @param {string} text - Message text
	 */
	sendCustomMessage(text) {
		const message = this.generateCustomMessage(text);
		this.send(message);
	}

	/**
	 * Open WhatsApp chat without predefined message
	 */
	openChat() {
		const url = `https://wa.me/${this.phoneNumber}`;
		window.open(url, '_blank');
	}
}

// Create and export singleton instance
const whatsapp = new WhatsAppManager();

// Make available globally for backward compatibility
if (typeof window !== 'undefined') {
	window.WhatsApp = whatsapp;
}

export default whatsapp;
export { WhatsAppManager };
