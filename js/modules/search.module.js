/**
 * Search Module - ES6
 * Handles product search functionality
 * @module search
 */

import { CONFIG } from '../config.js';

class SearchManager {
	constructor() {
		this.products = [];
		this.searchIndex = new Map();
		this.initialized = false;
	}

	/**
	 * Initialize search with product data
	 * @param {Array} products - Array of product objects
	 */
	initialize(products) {
		this.products = products || [];
		this.buildIndex();
		this.initialized = true;
	}

	/**
	 * Build search index for faster lookups
	 */
	buildIndex() {
		this.searchIndex.clear();

		this.products.forEach((product, index) => {
			const searchableText = this.getSearchableText(product).toLowerCase();
			const words = searchableText.split(/\s+/);

			words.forEach(word => {
				if (word.length < 2) return; // Skip very short words

				if (!this.searchIndex.has(word)) {
					this.searchIndex.set(word, []);
				}
				this.searchIndex.get(word).push(index);
			});
		});
	}

	/**
	 * Get searchable text from product
	 * @param {Object} product - Product object
	 * @returns {string} Concatenated searchable text
	 */
	getSearchableText(product) {
		const parts = [
			product.name || '',
			product.sku || '',
			product.category || '',
			product.description || '',
			product.brand || '',
			...(product.tags || [])
		];
		return parts.join(' ');
	}

	/**
	 * Search products
	 * @param {string} query - Search query
	 * @param {Object} options - Search options
	 * @returns {Array} Matching products
	 */
	search(query, options = {}) {
		if (!this.initialized) {
			console.warn('Search not initialized. Call initialize() first.');
			return [];
		}

		if (!query || query.trim().length === 0) {
			return options.returnAll ? this.products : [];
		}

		const normalizedQuery = query.toLowerCase().trim();
		const words = normalizedQuery.split(/\s+/);

		// Use index for multi-word queries
		if (words.length > 1) {
			return this.searchMultiWord(words, options);
		}

		// Simple search for single word or phrase
		return this.products.filter(product => {
			const searchableText = this.getSearchableText(product).toLowerCase();
			return searchableText.includes(normalizedQuery);
		});
	}

	/**
	 * Search with multiple words
	 * @param {Array<string>} words - Array of search words
	 * @param {Object} options - Search options
	 * @returns {Array} Matching products
	 */
	searchMultiWord(words, options = {}) {
		const matchCounts = new Map();

		words.forEach(word => {
			const indices = this.searchIndex.get(word) || [];
			indices.forEach(index => {
				const count = matchCounts.get(index) || 0;
				matchCounts.set(index, count + 1);
			});
		});

		// Sort by match count (most matches first)
		const sortedIndices = Array.from(matchCounts.entries())
			.sort((a, b) => b[1] - a[1])
			.map(([index]) => index);

		return sortedIndices.map(index => this.products[index]);
	}

	/**
	 * Filter products by category
	 * @param {string} category - Category name
	 * @returns {Array} Filtered products
	 */
	filterByCategory(category) {
		if (!category) return this.products;

		const normalizedCategory = category.toLowerCase().trim();
		return this.products.filter(product => {
			const productCategory = (product.category || '').toLowerCase();
			return productCategory === normalizedCategory || productCategory.includes(normalizedCategory);
		});
	}

	/**
	 * Filter products by price range
	 * @param {number} minPrice - Minimum price
	 * @param {number} maxPrice - Maximum price
	 * @returns {Array} Filtered products
	 */
	filterByPrice(minPrice, maxPrice) {
		return this.products.filter(product => {
			const price = Number(product.price) || 0;
			return price >= minPrice && price <= maxPrice;
		});
	}

	/**
	 * Sort products
	 * @param {Array} products - Products to sort
	 * @param {string} sortBy - Sort criteria
	 * @returns {Array} Sorted products
	 */
	sort(products, sortBy = 'name') {
		const sorted = [...products];

		switch (sortBy) {
			case 'price-asc':
				return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
			case 'price-desc':
				return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
			case 'name-asc':
			case 'name':
				return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
			case 'name-desc':
				return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
			case 'newest':
				return sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
			case 'popular':
				// Could be based on sales, views, etc.
				return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
			default:
				return sorted;
		}
	}

	/**
	 * Get all unique categories
	 * @returns {Array<string>} Array of category names
	 */
	getCategories() {
		const categories = new Set();
		this.products.forEach(product => {
			if (product.category) {
				categories.add(product.category);
			}
		});
		return Array.from(categories).sort();
	}

	/**
	 * Get product by ID
	 * @param {string|number} id - Product ID
	 * @returns {Object|null} Product object or null
	 */
	getProductById(id) {
		return this.products.find(p => String(p.id) === String(id)) || null;
	}

	/**
	 * Get products by IDs
	 * @param {Array<string|number>} ids - Array of product IDs
	 * @returns {Array} Array of product objects
	 */
	getProductsByIds(ids) {
		return ids.map(id => this.getProductById(id)).filter(Boolean);
	}

	/**
	 * Advanced search with filters
	 * @param {Object} params - Search parameters
	 * @returns {Array} Filtered and sorted products
	 */
	advancedSearch(params = {}) {
		let results = this.products;

		// Text search
		if (params.query) {
			results = this.search(params.query);
		}

		// Category filter
		if (params.category) {
			results = results.filter(product => {
				const productCategory = (product.category || '').toLowerCase();
				const searchCategory = params.category.toLowerCase();
				return productCategory === searchCategory || productCategory.includes(searchCategory);
			});
		}

		// Price range filter
		if (params.minPrice !== undefined || params.maxPrice !== undefined) {
			results = results.filter(product => {
				const price = Number(product.price) || 0;
				const min = params.minPrice !== undefined ? params.minPrice : 0;
				const max = params.maxPrice !== undefined ? params.maxPrice : Infinity;
				return price >= min && price <= max;
			});
		}

		// Availability filter
		if (params.inStock !== undefined) {
			results = results.filter(product => {
				const stock = product.inStock !== undefined ? product.inStock : true;
				return stock === params.inStock;
			});
		}

		// Sort
		if (params.sortBy) {
			results = this.sort(results, params.sortBy);
		}

		// Limit
		if (params.limit) {
			results = results.slice(0, params.limit);
		}

		return results;
	}
}

// Create and export singleton instance
const search = new SearchManager();

// Make available globally
if (typeof window !== 'undefined') {
	window.Search = search;
}

export default search;
export { SearchManager };
