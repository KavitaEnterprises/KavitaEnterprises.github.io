// Product Management Dashboard
class ProductDashboard {
	constructor() {
		this.products = [];
		this.filteredProducts = [];
		this.currentEditId = null;
		this.hasUnsavedChanges = false;
		this.useAPI = false; // Set to true when server is running
		this.apiBaseUrl = 'http://localhost:3000/api';
		this.init();
	}

	async init() {
		// Check if API is available
		await this.checkAPIAvailability();
		await this.loadProducts();
		this.setupEventListeners();
		this.renderProducts();
		this.updateStats();
		
		// Warn before leaving with unsaved changes
		window.addEventListener('beforeunload', (e) => {
			if (this.hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = '';
			}
		});
	}

	async checkAPIAvailability() {
		try {
			const response = await fetch(`${this.apiBaseUrl}/products`, { 
				method: 'GET',
				headers: { 'Accept': 'application/json' }
			});
			if (response.ok) {
				this.useAPI = true;
				console.log('✅ API Server is running - Real-time editing enabled!');
				this.showNotification('🚀 Server connected! Real-time editing enabled.', 'success');
			}
		} catch (error) {
			this.useAPI = false;
			console.log('⚠️ API Server not running - Using offline mode (JSON download only)');
			this.showNotification('⚠️ Offline mode: Changes will be downloaded as JSON file.', 'info');
		}
	}

	async loadProducts() {
		try {
			const url = this.useAPI ? `${this.apiBaseUrl}/products` : '/data/products.json';
			const response = await fetch(url);
			this.products = await response.json();
			this.filteredProducts = [...this.products];
		} catch (error) {
			console.error('Failed to load products:', error);
			alert('Error loading products. Please refresh the page.');
		}
	}

	setupEventListeners() {
		// Add Product
		document.getElementById('add-product-btn').addEventListener('click', () => this.openModal());
		
		// Save All
		document.getElementById('save-all-btn').addEventListener('click', () => this.saveAllProducts());
		
		// Modal controls
		document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
		document.getElementById('cancel-btn').addEventListener('click', () => this.closeModal());
		document.getElementById('save-product-btn').addEventListener('click', () => this.saveProduct());
		
		// Search and filter
		document.getElementById('search-products').addEventListener('input', (e) => this.filterProducts(e.target.value));
		document.getElementById('filter-category').addEventListener('change', (e) => this.filterByCategory(e.target.value));
		
		// Close modal on backdrop click
		document.getElementById('edit-modal').addEventListener('click', (e) => {
			if (e.target.id === 'edit-modal') this.closeModal();
		});
	}

	filterProducts(searchTerm) {
		const category = document.getElementById('filter-category').value;
		
		this.filteredProducts = this.products.filter(product => {
			const matchesSearch = !searchTerm || 
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.description.toLowerCase().includes(searchTerm.toLowerCase());
			
			const matchesCategory = category === 'all' || product.category === category;
			
			return matchesSearch && matchesCategory;
		});
		
		this.renderProducts();
	}

	filterByCategory(category) {
		const searchTerm = document.getElementById('search-products').value;
		this.filterProducts(searchTerm);
	}

	renderProducts() {
		const tbody = document.getElementById('products-table-body');
		const emptyState = document.getElementById('empty-state');
		
		if (this.filteredProducts.length === 0) {
			tbody.innerHTML = '';
			emptyState.classList.remove('hidden');
			return;
		}
		
		emptyState.classList.add('hidden');
		
		tbody.innerHTML = this.filteredProducts.map(product => {
			const sellingPrice = product.sellingPrice || product.price || 0;
			const mrp = product.mrp || null;
			let priceHTML = `₹${sellingPrice.toLocaleString('en-IN')}`;
			
			if (mrp && mrp > sellingPrice) {
				const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
				priceHTML = `
					<div class="flex flex-col">
						<span class="text-xs text-gray-400 line-through">₹${mrp.toLocaleString('en-IN')}</span>
						<span class="font-bold text-gray-900">₹${sellingPrice.toLocaleString('en-IN')}</span>
						<span class="text-xs text-green-600 font-semibold">${discount}% OFF</span>
					</div>
				`;
			}
			
			return `
			<tr class="hover:bg-gray-50 transition-colors">
				<td class="px-6 py-4">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
							${product.images && product.images[0] ? 
								`<img src="/${product.images[0]}" alt="${product.name}" class="w-full h-full object-cover" />` :
								'<span class="material-symbols-rounded text-gray-400 flex items-center justify-center w-full h-full">image</span>'
							}
						</div>
						<div>
							<p class="font-medium text-gray-900 text-sm">${product.name}</p>
							<p class="text-xs text-gray-500">${product.description.substring(0, 50)}...</p>
						</div>
					</div>
				</td>
				<td class="px-6 py-4 text-sm text-gray-700">${product.sku}</td>
				<td class="px-6 py-4">
					<span class="px-2.5 py-1 text-xs font-medium rounded-full ${this.getCategoryColor(product.category)}">
						${product.category}
					</span>
				</td>
				<td class="px-6 py-4 text-sm">${priceHTML}</td>
				<td class="px-6 py-4 text-right">
					<div class="flex items-center justify-end gap-2">
						<button onclick="dashboard.openModal(${product.id})" class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
							<span class="material-symbols-rounded text-lg">edit</span>
						</button>
						<button onclick="dashboard.deleteProduct(${product.id})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
							<span class="material-symbols-rounded text-lg">delete</span>
						</button>
					</div>
				</td>
			</tr>
		`;
		}).join('');
	}

	getCategoryColor(category) {
		const colors = {
			'RO Systems': 'bg-blue-100 text-blue-700',
			'Filters': 'bg-green-100 text-green-700',
			'Parts': 'bg-purple-100 text-purple-700',
			'Accessories': 'bg-orange-100 text-orange-700'
		};
		return colors[category] || 'bg-gray-100 text-gray-700';
	}

	updateStats() {
		const total = this.products.length;
		const roCount = this.products.filter(p => p.category === 'RO Systems').length;
		const avgPrice = total > 0 ? Math.round(this.products.reduce((sum, p) => {
			const price = p.sellingPrice || p.price || 0;
			return sum + price;
		}, 0) / total) : 0;
		
		document.getElementById('stat-total').textContent = total;
		document.getElementById('stat-ro').textContent = roCount;
		document.getElementById('stat-avg-price').textContent = `₹${avgPrice.toLocaleString('en-IN')}`;
		document.getElementById('stat-unsaved').textContent = this.hasUnsavedChanges ? '1' : '0';
	}

	openModal(productId = null) {
		this.currentEditId = productId;
		const modal = document.getElementById('edit-modal');
		const title = document.getElementById('modal-title');
		
		if (productId) {
			const product = this.products.find(p => p.id === productId);
			if (product) {
				title.textContent = 'Edit Product';
				this.populateForm(product);
			}
		} else {
			title.textContent = 'Add New Product';
			document.getElementById('product-form').reset();
			document.getElementById('product-id').value = '';
		}
		
		modal.classList.remove('hidden');
		modal.classList.add('flex');
	}

	closeModal() {
		document.getElementById('edit-modal').classList.add('hidden');
		document.getElementById('edit-modal').classList.remove('flex');
		document.getElementById('product-form').reset();
		this.currentEditId = null;
	}

	populateForm(product) {
		document.getElementById('product-id').value = product.id;
		document.getElementById('product-name').value = product.name;
		document.getElementById('product-sku').value = product.sku;
		document.getElementById('product-mrp').value = product.mrp || product.price || 0;
		document.getElementById('product-selling-price').value = product.sellingPrice || product.price || 0;
		document.getElementById('product-category').value = product.category;
		document.getElementById('product-description').value = product.description;
		document.getElementById('product-tags').value = product.tags ? product.tags.join(', ') : '';
		document.getElementById('product-images').value = product.images ? product.images.join(', ') : '';
		
		// Populate JSON fields
		if (product.specifications) {
			document.getElementById('product-specifications').value = JSON.stringify(product.specifications, null, 2);
		}
		if (product.features) {
			document.getElementById('product-features').value = JSON.stringify(product.features, null, 2);
		}
	}

	saveProduct() {
		const form = document.getElementById('product-form');
		
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}
		
		// Parse JSON fields
		let specifications = {};
		let features = {};
		
		try {
			const specsText = document.getElementById('product-specifications').value.trim();
			if (specsText) {
				specifications = JSON.parse(specsText);
			}
		} catch (e) {
			alert('Invalid JSON in Specifications field. Please check syntax.');
			return;
		}
		
		try {
			const featuresText = document.getElementById('product-features').value.trim();
			if (featuresText) {
				features = JSON.parse(featuresText);
			}
		} catch (e) {
			alert('Invalid JSON in Features field. Please check syntax.');
			return;
		}
		
		const productData = {
			id: this.currentEditId || this.getNextId(),
			name: document.getElementById('product-name').value.trim(),
			sku: document.getElementById('product-sku').value.trim(),
			mrp: parseInt(document.getElementById('product-mrp').value),
			sellingPrice: parseInt(document.getElementById('product-selling-price').value),
			category: document.getElementById('product-category').value,
			description: document.getElementById('product-description').value.trim(),
			tags: document.getElementById('product-tags').value.split(',').map(t => t.trim()).filter(t => t),
			images: document.getElementById('product-images').value.split(',').map(i => i.trim()).filter(i => i),
			specifications: specifications,
			features: features
		};
		
		// Preserve waterQuality if exists
		if (this.currentEditId) {
			const existing = this.products.find(p => p.id === this.currentEditId);
			if (existing && existing.waterQuality) {
				productData.waterQuality = existing.waterQuality;
			}
			
			if (this.useAPI) {
				this.updateProductAPI(productData);
			} else {
				const index = this.products.findIndex(p => p.id === this.currentEditId);
				if (index !== -1) {
					this.products[index] = productData;
				}
				this.saveLocal();
			}
		} else {
			// Add new
			if (this.useAPI) {
				this.createProductAPI(productData);
			} else {
				this.products.push(productData);
				this.saveLocal();
			}
		}
	}

	async createProductAPI(productData) {
		try {
			const response = await fetch(`${this.apiBaseUrl}/products`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(productData)
			});
			
			if (response.ok) {
				const newProduct = await response.json();
				this.products.push(newProduct);
				this.filteredProducts = [...this.products];
				this.renderProducts();
				this.updateStats();
				this.closeModal();
				this.showNotification('✅ Product created successfully!', 'success');
			} else {
				throw new Error('Failed to create product');
			}
		} catch (error) {
			console.error('Error creating product:', error);
			this.showNotification('❌ Failed to create product. Check server connection.', 'error');
		}
	}

	async updateProductAPI(productData) {
		try {
			const response = await fetch(`${this.apiBaseUrl}/products/${productData.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(productData)
			});
			
			if (response.ok) {
				const updated = await response.json();
				const index = this.products.findIndex(p => p.id === updated.id);
				if (index !== -1) {
					this.products[index] = updated;
				}
				this.filteredProducts = [...this.products];
				this.renderProducts();
				this.updateStats();
				this.closeModal();
				this.showNotification('✅ Product updated successfully!', 'success');
			} else {
				throw new Error('Failed to update product');
			}
		} catch (error) {
			console.error('Error updating product:', error);
			this.showNotification('❌ Failed to update product. Check server connection.', 'error');
		}
	}

	saveLocal() {
		this.hasUnsavedChanges = true;
		this.filteredProducts = [...this.products];
		this.renderProducts();
		this.updateStats();
		this.closeModal();
		this.showNotification('Product saved! Click "Save Changes" to download updated JSON.', 'success');
	}

	deleteProduct(productId) {
		if (!confirm('Are you sure you want to delete this product?')) {
			return;
		}
		
		if (this.useAPI) {
			this.deleteProductAPI(productId);
		} else {
			this.products = this.products.filter(p => p.id !== productId);
			this.filteredProducts = this.filteredProducts.filter(p => p.id !== productId);
			this.hasUnsavedChanges = true;
			
			this.renderProducts();
			this.updateStats();
			this.showNotification('Product deleted! Click "Save Changes" to download updated JSON.', 'success');
		}
	}

	async deleteProductAPI(productId) {
		try {
			const response = await fetch(`${this.apiBaseUrl}/products/${productId}`, {
				method: 'DELETE'
			});
			
			if (response.ok) {
				this.products = this.products.filter(p => p.id !== productId);
				this.filteredProducts = this.filteredProducts.filter(p => p.id !== productId);
				this.renderProducts();
				this.updateStats();
				this.showNotification('✅ Product deleted successfully!', 'success');
			} else {
				throw new Error('Failed to delete product');
			}
		} catch (error) {
			console.error('Error deleting product:', error);
			this.showNotification('❌ Failed to delete product. Check server connection.', 'error');
		}
	}

	getNextId() {
		return this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
	}

	saveAllProducts() {
		if (!this.hasUnsavedChanges) {
			this.showNotification('No changes to save!', 'info');
			return;
		}
		
		// Create downloadable JSON file
		const dataStr = JSON.stringify(this.products, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		
		// Create download link
		const link = document.createElement('a');
		link.href = url;
		link.download = `products-${new Date().toISOString().slice(0, 10)}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		
		this.hasUnsavedChanges = false;
		this.updateStats();
		
		this.showNotification('JSON file downloaded! Replace /data/products.json with this file.', 'success');
	}

	showNotification(message, type = 'info') {
		const colors = {
			success: 'bg-green-100 border-green-500 text-green-800',
			error: 'bg-red-100 border-red-500 text-red-800',
			info: 'bg-blue-100 border-blue-500 text-blue-800'
		};
		
		const notification = document.createElement('div');
		notification.className = `fixed top-4 right-4 z-50 ${colors[type]} border-l-4 p-4 rounded-lg shadow-lg max-w-md animate-slide-in`;
		notification.innerHTML = `
			<div class="flex items-center gap-3">
				<span class="material-symbols-rounded">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
				<p class="text-sm font-medium">${message}</p>
			</div>
		`;
		
		document.body.appendChild(notification);
		
		setTimeout(() => {
			notification.remove();
		}, 5000);
	}
}

// Initialize dashboard
const dashboard = new ProductDashboard();
window.dashboard = dashboard;
