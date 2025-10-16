/**
 * Favorites/Wishlist Module - ES6
 * Handles product favorites functionality
 * @module favorites
 */

import { CONFIG } from '../config.js';

class FavoritesManager {
	constructor() {
		this.storageKey = CONFIG.favorites.storageKey || 'favorites';
		this.maxItems = CONFIG.favorites.maxItems || 50;
	}

	/**
	 * Get all favorite items
	 * @returns {Array<number>} Array of product IDs
	 */
	getAll() {
		try {
			const data = localStorage.getItem(this.storageKey);
			const favorites = data ? JSON.parse(data) : [];
			return Array.isArray(favorites) ? favorites : [];
		} catch (error) {
			console.warn('Invalid favorites data. Resetting.', error);
			localStorage.removeItem(this.storageKey);
			return [];
		}
	}

	/**
	 * Save favorites to localStorage
	 * @param {Array<number>} favorites - Array of product IDs
	 */
	save(favorites) {
		if (!Array.isArray(favorites)) {
			console.warn('Attempted to save non-array favorites. Ignoring.');
			return;
		}

		// Limit to max items
		const limited = favorites.slice(0, this.maxItems);
		
		localStorage.setItem(this.storageKey, JSON.stringify(limited));
		document.dispatchEvent(new CustomEvent('favorites:updated', { detail: { favorites: limited } }));
	}

	/**
	 * Check if product is in favorites
	 * @param {string|number} id - Product ID
	 * @returns {boolean}
	 */
	isSaved(id) {
		const normalizedId = Number(id);
		return this.getAll().some(savedId => Number(savedId) === normalizedId);
	}

	/**
	 * Toggle favorite status
	 * @param {string|number} id - Product ID
	 * @returns {boolean} New favorite status
	 */
	toggle(id) {
		const normalizedId = Number(id);
		const favorites = this.getAll().map(Number);
		const index = favorites.indexOf(normalizedId);

		if (index >= 0) {
			favorites.splice(index, 1);
		} else {
			if (favorites.length >= this.maxItems) {
				console.warn(`Maximum ${this.maxItems} favorites reached`);
				return false;
			}
			favorites.push(normalizedId);
		}

		this.save(favorites);
		return favorites.includes(normalizedId);
	}

	/**
	 * Set favorite status explicitly
	 * @param {string|number} id - Product ID
	 * @param {boolean} shouldSave - Whether to add or remove
	 * @returns {boolean} Final status
	 */
	set(id, shouldSave) {
		const normalizedId = Number(id);
		const favorites = this.getAll().map(Number);
		const index = favorites.indexOf(normalizedId);

		if (shouldSave && index === -1) {
			if (favorites.length >= this.maxItems) {
				console.warn(`Maximum ${this.maxItems} favorites reached`);
				return false;
			}
			favorites.push(normalizedId);
		}

		if (!shouldSave && index !== -1) {
			favorites.splice(index, 1);
		}

		this.save(favorites);
		return shouldSave;
	}

	/**
	 * Add product to favorites
	 * @param {string|number} id - Product ID
	 * @returns {boolean} Success status
	 */
	add(id) {
		return this.set(id, true);
	}

	/**
	 * Remove product from favorites
	 * @param {string|number} id - Product ID
	 * @returns {boolean} Success status
	 */
	remove(id) {
		return this.set(id, false);
	}

	/**
	 * Clear all favorites
	 */
	clearAll() {
		localStorage.removeItem(this.storageKey);
		document.dispatchEvent(new CustomEvent('favorites:updated', { detail: { favorites: [] } }));
	}

	/**
	 * Get count of favorites
	 * @returns {number}
	 */
	getCount() {
		return this.getAll().length;
	}

	/**
	 * Check if favorites is full
	 * @returns {boolean}
	 */
	isFull() {
		return this.getCount() >= this.maxItems;
	}
}

// Create and export singleton instance
const favorites = new FavoritesManager();

// Make available globally for backward compatibility
if (typeof window !== 'undefined') {
	window.Favorites = favorites;
}

export default favorites;
export { FavoritesManager };
