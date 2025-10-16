// Chat Assistant Logic
class ChatAssistant {
	constructor() {
		this.products = [];
		this.conversationHistory = [];
		this.whatsappNumber = '+919871799666';
		this.storeInfo = {
			name: 'Kavita Enterprises',
			address: '195, Road No-1, Nawada, Near Rajender Nagar Metro Station, Gate No-1, New Delhi, Delhi 110059',
			phone: '+919871799666',
			email: 'info@fingaurd.com',
			officeHours: '11 AM - 5 PM (Monday to Saturday)',
			closedDays: 'Sunday and Public Holidays',
			serviceArea: 'AMC and service available only in Delhi region',
			salesArea: 'Product sales across India',
			responseTime: '48 hours on business days only',
			paymentOffers: {
				b2c: {
					discount: '5% flat discount on prepaid payments',
					maxDiscount: 'upto ₹100',
					note: 'Applicable on all items for B2C consumers'
				},
				moq: {
					dealer: 100,
					distributor: 200,
					superStockist: 500,
					note: 'Rates depend on order type - contact for offers'
				}
			}
		};
		this.init();
	}

	async init() {
		await this.loadProducts();
		this.setupEventListeners();
	}

	async loadProducts() {
		try {
			const response = await fetch('/data/products.json');
			this.products = await response.json();
		} catch (error) {
			console.error('Failed to load products:', error);
		}
	}

	setupEventListeners() {
		const chatButton = document.getElementById('chat-button');
		const closeChat = document.getElementById('close-chat');
		const chatWindow = document.getElementById('chat-window');
		const sendButton = document.getElementById('send-message');
		const chatInput = document.getElementById('chat-input');
		const promptButtons = document.querySelectorAll('.prompt-btn');

		chatButton?.addEventListener('click', () => this.toggleChat(true));
		closeChat?.addEventListener('click', () => this.toggleChat(false));
		sendButton?.addEventListener('click', () => this.handleSendMessage());
		chatInput?.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') this.handleSendMessage();
		});

		promptButtons.forEach(btn => {
			btn.addEventListener('click', () => {
				const prompt = btn.getAttribute('data-prompt');
				this.handleUserMessage(prompt);
			});
		});
	}

	toggleChat(show) {
		const chatWindow = document.getElementById('chat-window');
		const chatButton = document.getElementById('chat-button');
		
		if (show) {
			chatWindow.classList.remove('hidden');
			chatWindow.classList.add('flex');
			chatButton.style.display = 'none';
		} else {
			chatWindow.classList.add('hidden');
			chatWindow.classList.remove('flex');
			chatButton.style.display = 'flex';
		}
	}

	handleSendMessage() {
		const input = document.getElementById('chat-input');
		const message = input.value.trim();
		
		if (message) {
			this.handleUserMessage(message);
			input.value = '';
		}
	}

	handleUserMessage(message) {
		this.addMessage('user', message);
		
		setTimeout(() => {
			const response = this.generateResponse(message);
			this.addMessage('bot', response);
		}, 500);
	}

	addMessage(type, content) {
		const messagesContainer = document.getElementById('chat-messages');
		const messageDiv = document.createElement('div');
		messageDiv.className = `flex gap-3 animate-fade-in ${type === 'user' ? 'justify-end' : ''}`;

		if (type === 'bot') {
			messageDiv.innerHTML = `
				<div class="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
					<span class="material-symbols-rounded text-white text-base">support_agent</span>
				</div>
				<div class="flex-1 max-w-[85%]">
					<div class="bg-white rounded-2xl rounded-tl-sm p-4 shadow-md border border-gray-100/50">
						${content}
					</div>
				</div>
			`;
		} else {
			messageDiv.innerHTML = `
				<div class="max-w-[85%]">
					<div class="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl rounded-tr-sm p-4 shadow-md">
						<p class="text-sm leading-relaxed">${this.escapeHtml(content)}</p>
					</div>
				</div>
			`;
		}

		messagesContainer.appendChild(messageDiv);
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}

	generateResponse(query) {
		const lowerQuery = query.toLowerCase();
		
		console.log('🔍 Processing query:', query);
		
		// Priority-based pattern matching (check specific intents first)
		// Check warranty FIRST (highest priority for specific queries)
		if (/warranty|guarantee/.test(lowerQuery)) {
			console.log('✅ Matched: WARRANTY');
			return this.getWarrantyInfo(lowerQuery);
		}
		
		// Check offers/discounts
		if (/offer|discount|deal|prepaid|payment|moq|dealer|distributor|wholesale|bulk/.test(lowerQuery)) {
			console.log('✅ Matched: OFFERS');
			return this.getOffersInfo();
		}
		
		// Check comparison
		if (/compare|difference|better|best|vs|versus|which one/.test(lowerQuery)) {
			console.log('✅ Matched: COMPARISON');
			return this.getComparisonInfo();
		}
		
		// Check price
		if (/price|cost|expensive|cheap|pricing|rate|how much|rupee|₹/.test(lowerQuery)) {
			console.log('✅ Matched: PRICE');
			return this.getPriceInfo(lowerQuery);
		}
		
		// Check features/specs
		if (/feature|specification|spec|tech|technology|stage|uv|tds|capacity/.test(lowerQuery)) {
			console.log('✅ Matched: FEATURES');
			return this.getFeaturesInfo(lowerQuery);
		}
		
		// Check installation
		if (/install|setup|fitting|mount|place/.test(lowerQuery)) {
			console.log('✅ Matched: INSTALLATION');
			return this.getInstallationInfo();
		}
		
		// Check maintenance
		if (/maintain|maintenance|clean|care|service|amc/.test(lowerQuery)) {
			console.log('✅ Matched: MAINTENANCE');
			return this.getMaintenanceInfo();
		}
		
		// Check location/store info
		if (/location|address|where|store|shop|visit|direction|map|timing|hours|open|close/.test(lowerQuery)) {
			console.log('✅ Matched: LOCATION');
			return this.getLocationInfo();
		}
		
		// Check contact
		if (/contact|phone|call|email|reach|talk|speak|number/.test(lowerQuery)) {
			console.log('✅ Matched: CONTACT');
			return this.getContactInfo();
		}
		
		// Check products (lowest priority - very broad)
		if (/ro|purifier|system|filter|water|product|buy|purchase/.test(lowerQuery)) {
			console.log('✅ Matched: PRODUCT');
			return this.getProductInfo(lowerQuery);
		}

		// Default response if no pattern matches
		console.log('❌ No match - using default response');
		return this.getDefaultResponse();
	}

	getProductInfo(query) {
		const roSystems = this.products.filter(p => p.category === 'RO Systems');
		
		if (roSystems.length === 0) {
			return '<p class="text-gray-800 text-sm">I couldn\'t find product information. Please contact us for details!</p>' + this.getWhatsAppButton();
		}

		let html = '<p class="text-gray-800 text-sm font-medium mb-3">Here are our RO Water Purifiers:</p>';
		html += '<div class="space-y-3">';
		
		roSystems.slice(0, 3).forEach(product => {
			const price = product.sellingPrice || product.price || 0;
			html += `
				<div class="border border-gray-200 rounded-lg p-3 hover:border-primary/50 transition-colors">
					<h4 class="font-bold text-sm text-gray-900 mb-1">${product.name}</h4>
					<p class="text-xs text-gray-600 mb-2">${product.description.substring(0, 80)}...</p>
					<div class="flex items-center justify-between">
						<span class="text-primary font-bold">₹${price.toLocaleString('en-IN')}</span>
						<a href="/product.html?id=${product.id}" class="text-xs text-primary hover:underline">View Details →</a>
					</div>
				</div>
			`;
		});
		
		html += '</div>';
		html += '<p class="text-xs text-gray-500 mt-3"><a href="/products.html" class="text-primary hover:underline">View all products →</a></p>';
		
		return html;
	}

	getPriceInfo(query) {
		if (this.products.length === 0) {
			return '<p class="text-gray-800 text-sm">Loading price information...</p>' + this.getWhatsAppButton();
		}

		// Check if asking about specific product
		const roProducts = this.products.filter(p => p.category === 'RO Systems');
		if (query && (query.includes('cheapest') || query.includes('lowest') || query.includes('budget'))) {
			const cheapest = roProducts.sort((a, b) => {
				const priceA = a.sellingPrice || a.price || 0;
				const priceB = b.sellingPrice || b.price || 0;
				return priceA - priceB;
			})[0];
			if (cheapest) {
				const cheapestPrice = cheapest.sellingPrice || cheapest.price || 0;
				return `
					<p class="text-gray-800 text-sm font-medium mb-3">Our most affordable option:</p>
					<div class="border border-gray-200 rounded-lg p-3 hover:border-primary/50 transition-colors">
						<h4 class="font-bold text-sm text-gray-900 mb-1">${cheapest.name}</h4>
						<p class="text-xs text-gray-600 mb-2">${cheapest.description.substring(0, 100)}...</p>
						<div class="flex items-center justify-between">
							<span class="text-primary font-bold text-lg">₹${cheapestPrice.toLocaleString('en-IN')}</span>
							<a href="/product.html?id=${cheapest.id}" class="text-xs text-primary hover:underline">View Details →</a>
						</div>
					</div>
				`;
			}
		}

		const priceRanges = {
			'Under ₹5,000': this.products.filter(p => {
				const price = p.sellingPrice || p.price || 0;
				return price < 5000;
			}).length,
			'₹5,000 - ₹10,000': this.products.filter(p => {
				const price = p.sellingPrice || p.price || 0;
				return price >= 5000 && price < 10000;
			}).length,
			'₹10,000 - ₹15,000': this.products.filter(p => {
				const price = p.sellingPrice || p.price || 0;
				return price >= 10000 && price < 15000;
			}).length,
			'Above ₹15,000': this.products.filter(p => {
				const price = p.sellingPrice || p.price || 0;
				return price >= 15000;
			}).length,
		};

		let html = '<p class="text-gray-800 text-sm font-medium mb-3">Our price ranges:</p>';
		html += '<div class="space-y-2">';
		
		Object.entries(priceRanges).forEach(([range, count]) => {
			if (count > 0) {
				html += `
					<div class="flex items-center justify-between text-sm">
						<span class="text-gray-700">${range}</span>
						<span class="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-bold">${count} products</span>
					</div>
				`;
			}
		});
		
		html += '</div>';
		html += '<p class="text-xs text-gray-500 mt-3"><a href="/products.html" class="text-primary hover:underline">Browse all products →</a></p>';
		
		return html;
	}

	getLocationInfo() {
		return `
			<p class="text-gray-800 text-sm font-medium mb-2">Visit our store:</p>
			<div class="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-3">
				<p class="text-sm text-gray-800 font-medium mb-1">${this.storeInfo.name}</p>
				<p class="text-xs text-gray-600 leading-relaxed mb-3">${this.storeInfo.address}</p>
				<a href="https://maps.google.com/?q=${encodeURIComponent(this.storeInfo.address)}" target="_blank" class="inline-flex items-center gap-1 text-xs text-primary hover:underline">
					<span class="material-symbols-rounded text-sm">location_on</span>
					Open in Google Maps
				</a>
			</div>
			<div class="space-y-2 text-xs">
				<div class="bg-blue-50 rounded-lg p-2.5 border border-blue-200">
					<span class="material-symbols-rounded text-blue-600 text-sm align-middle">schedule</span>
					<span class="text-blue-900 ml-1"><strong>Office Hours:</strong> ${this.storeInfo.officeHours}</span>
					<p class="text-blue-700 ml-5 mt-1"><strong>Closed:</strong> ${this.storeInfo.closedDays}</p>
				</div>
				<div class="bg-purple-50 rounded-lg p-2.5 border border-purple-200">
					<span class="material-symbols-rounded text-purple-600 text-sm align-middle">handyman</span>
					<span class="text-purple-900 ml-1">${this.storeInfo.serviceArea}</span>
				</div>
				<div class="bg-green-50 rounded-lg p-2.5 border border-green-200">
					<span class="material-symbols-rounded text-green-600 text-sm align-middle">shopping_cart</span>
					<span class="text-green-900 ml-1">${this.storeInfo.salesArea}</span>
				</div>
			</div>
		`;
	}

	getContactInfo() {
		return `
			<p class="text-gray-800 text-sm font-medium mb-2">Contact us:</p>
			<div class="space-y-2 mb-3">
				<div class="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
					<span class="material-symbols-rounded text-primary text-base">call</span>
					<a href="tel:${this.storeInfo.phone}" class="text-gray-800 hover:text-primary">${this.storeInfo.phone}</a>
				</div>
				<div class="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
					<span class="material-symbols-rounded text-primary text-base">email</span>
					<a href="mailto:${this.storeInfo.email}" class="text-gray-800 hover:text-primary">${this.storeInfo.email}</a>
				</div>
				<div class="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded-lg border border-blue-200">
					<span class="material-symbols-rounded text-blue-600 text-base">schedule</span>
					<span class="text-blue-900">${this.storeInfo.officeHours}</span>
				</div>
				<div class="text-xs bg-red-50 p-2 rounded-lg border border-red-200 text-red-800">
					<strong>Closed:</strong> ${this.storeInfo.closedDays}
				</div>
				<div class="text-xs bg-orange-50 p-2 rounded-lg border border-orange-200 text-orange-800">
					<strong>Response Time:</strong> ${this.storeInfo.responseTime}
				</div>
			</div>
			${this.getWhatsAppButton()}
		`;
	}

	getWarrantyInfo(query) {
		// Get warranty info from all products grouped by category
		console.log('Warranty Query - Products loaded:', this.products.length);
		
		if (this.products.length === 0) {
			console.warn('No products loaded, using fallback');
			return this.getWarrantyFallback();
		}
		
		// Group products by category and collect unique warranties
		const warrantyByCategory = {};
		this.products.forEach(product => {
			if (product.specifications && product.specifications.warrantyDetails) {
				const category = product.category || 'Other';
				if (!warrantyByCategory[category]) {
					warrantyByCategory[category] = [];
				}
				const warranty = product.specifications.warrantyDetails;
				// Check if we already have this warranty info
				const exists = warrantyByCategory[category].some(w => 
					w.duration === warranty.duration && w.durationType === warranty.durationType
				);
				if (!exists) {
					warrantyByCategory[category].push({
						...warranty,
						productName: product.name
					});
				}
			}
		});
		
		console.log('Warranties by category:', Object.keys(warrantyByCategory));
		
		if (Object.keys(warrantyByCategory).length === 0) {
			return this.getWarrantyFallback();
		}
		
		// Build comprehensive warranty display
		let warrantyHTML = '<p class="text-gray-800 text-sm font-medium mb-3">📋 Warranty Coverage by Product Type:</p>';
		
		// Display warranties by category
		Object.entries(warrantyByCategory).forEach(([category, warranties]) => {
			warranties.forEach(warranty => {
				const bgColor = category === 'RO Systems' ? 'from-blue-50 to-blue-100 border-blue-300' : 
				               category === 'Filters' ? 'from-amber-50 to-amber-100 border-amber-300' : 
				               category === 'Accessories' ? 'from-purple-50 to-purple-100 border-purple-300' : 
				               'from-green-50 to-green-100 border-green-300';
				
				const iconColor = category === 'RO Systems' ? 'text-blue-600' : 
				                 category === 'Filters' ? 'text-amber-600' : 
				                 category === 'Accessories' ? 'text-purple-600' : 
				                 'text-green-600';
				
				warrantyHTML += `
					<div class="bg-gradient-to-br ${bgColor} border-2 rounded-xl p-4 mb-3 shadow-sm">
						<div class="flex items-center justify-between mb-2">
							<span class="text-gray-900 font-bold text-xs uppercase tracking-wide">${category}</span>
							<span class="material-symbols-rounded ${iconColor} text-2xl">verified</span>
						</div>
						<div class="mb-2">
							<span class="font-bold text-base text-gray-900">${warranty.duration} ${warranty.durationType}</span>
							${warranty.fullText ? `<p class="text-xs text-gray-700 mt-1">${warranty.fullText}</p>` : ''}
						</div>
						${warranty.coverage ? `<p class="text-xs text-gray-700 mb-1"><strong>Coverage:</strong> ${warranty.coverage}</p>` : ''}
						${warranty.exclusions ? `<p class="text-xs text-red-600"><strong>Exclusions:</strong> ${warranty.exclusions}</p>` : ''}
					</div>
				`;
			});
		});
		
		// Add common info
		const firstWarranty = Object.values(warrantyByCategory)[0][0];
		warrantyHTML += `
			<div class="space-y-2 mb-3">
				<div class="flex items-start gap-2 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
					<span class="material-symbols-rounded text-blue-600 text-base mt-0.5">location_on</span>
					<span class="text-sm text-blue-900"><strong>Service Area:</strong> ${firstWarranty.serviceArea || this.storeInfo.serviceArea}</span>
				</div>
				<div class="flex items-start gap-2 bg-orange-50 p-2.5 rounded-lg border border-orange-200">
					<span class="material-symbols-rounded text-orange-600 text-base mt-0.5">schedule</span>
					<span class="text-sm text-orange-900"><strong>Response Time:</strong> ${firstWarranty.responseTime || this.storeInfo.responseTime}</span>
				</div>
			</div>
			<div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
				<p class="text-xs text-blue-900">
					<span class="font-bold">💡 Extended Protection Available!</span><br/>
					Contact us during ${this.storeInfo.officeHours} for extended warranty plans.
				</p>
			</div>
		`;
		
		return warrantyHTML;
	}
	
	getWarrantyFallback() {
		return `
			<p class="text-gray-800 text-sm leading-relaxed mb-3">All our products come with comprehensive warranty coverage:</p>
			<div class="space-y-2 mb-3">
				<div class="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg">
					<span class="material-symbols-rounded text-green-600 text-base mt-0.5">check_circle</span>
					<span class="text-sm text-gray-700">Warranty period varies by product type</span>
				</div>
				<div class="flex items-start gap-2 bg-blue-50 p-2.5 rounded-lg">
					<span class="material-symbols-rounded text-blue-600 text-base mt-0.5">location_on</span>
					<span class="text-sm text-blue-900">${this.storeInfo.serviceArea}</span>
				</div>
				<div class="flex items-start gap-2 bg-orange-50 p-2.5 rounded-lg">
					<span class="material-symbols-rounded text-orange-600 text-base mt-0.5">schedule</span>
					<span class="text-sm text-orange-900">${this.storeInfo.responseTime}</span>
				</div>
			</div>
			<p class="text-xs text-gray-500 mt-3">Contact us for detailed warranty terms!</p>
			${this.getWhatsAppButton()}
		`;
	}

	getFeaturesInfo(query) {
		// Try to get features from actual product data
		const roProducts = this.products.filter(p => p.category === 'RO Systems');
		
		if (roProducts.length > 0 && roProducts[0].specifications) {
			const spec = roProducts[0].specifications;
			const feat = roProducts[0].features || {};
			
			return `
				<p class="text-gray-800 text-sm font-medium mb-3">Our systems feature:</p>
				<div class="grid grid-cols-2 gap-2 text-xs mb-3">
					${spec.purificationStages ? `
					<div class="bg-blue-50 rounded-lg p-2 border border-blue-100">
						<span class="material-symbols-rounded text-blue-600 text-sm">water_drop</span>
						<p class="text-gray-800 font-medium mt-1">${spec.purificationStages}-Stage Purification</p>
					</div>` : ''}
					${spec.purificationTechnology ? `
					<div class="bg-green-50 rounded-lg p-2 border border-green-100">
						<span class="material-symbols-rounded text-green-600 text-sm">bolt</span>
						<p class="text-gray-800 font-medium mt-1">${spec.purificationTechnology.join(', ')}</p>
					</div>` : ''}
					${spec.tdsController ? `
					<div class="bg-purple-50 rounded-lg p-2 border border-purple-100">
						<span class="material-symbols-rounded text-purple-600 text-sm">settings</span>
						<p class="text-gray-800 font-medium mt-1">TDS Controller</p>
					</div>` : ''}
					${spec.certifications ? `
					<div class="bg-orange-50 rounded-lg p-2 border border-orange-100">
						<span class="material-symbols-rounded text-orange-600 text-sm">verified</span>
						<p class="text-gray-800 font-medium mt-1">${spec.certifications.join(', ')}</p>
					</div>` : ''}
				</div>
				${feat.smartFeatures ? `
				<div class="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-2">
					<p class="text-xs font-bold text-gray-900 mb-2">Smart Features:</p>
					<ul class="space-y-1 text-xs text-gray-700">
						${feat.smartFeatures.slice(0, 3).map(f => `<li>• ${f}</li>`).join('')}
					</ul>
				</div>` : ''}
				<p class="text-xs text-gray-500 mt-3"><a href="/products.html" class="text-primary hover:underline">See detailed specifications →</a></p>
			`;
		}
		
		// Fallback
		return `
			<p class="text-gray-800 text-sm font-medium mb-3">Our systems feature:</p>
			<div class="grid grid-cols-2 gap-2 text-xs">
				<div class="bg-blue-50 rounded-lg p-2 border border-blue-100">
					<span class="material-symbols-rounded text-blue-600 text-sm">water_drop</span>
					<p class="text-gray-800 font-medium mt-1">7-Stage Purification</p>
				</div>
				<div class="bg-green-50 rounded-lg p-2 border border-green-100">
					<span class="material-symbols-rounded text-green-600 text-sm">bolt</span>
					<p class="text-gray-800 font-medium mt-1">UV Sterilization</p>
				</div>
				<div class="bg-purple-50 rounded-lg p-2 border border-purple-100">
					<span class="material-symbols-rounded text-purple-600 text-sm">settings</span>
					<p class="text-gray-800 font-medium mt-1">TDS Controller</p>
				</div>
				<div class="bg-orange-50 rounded-lg p-2 border border-orange-100">
					<span class="material-symbols-rounded text-orange-600 text-sm">verified</span>
					<p class="text-gray-800 font-medium mt-1">ISI Certified</p>
				</div>
			</div>
			<p class="text-xs text-gray-500 mt-3"><a href="/products.html" class="text-primary hover:underline">See detailed specifications →</a></p>
		`;
	}

	getInstallationInfo() {
		return `
			<p class="text-gray-800 text-sm font-medium mb-3">Installation Service:</p>
			<div class="space-y-3">
				<div class="bg-green-50 border border-green-200 rounded-lg p-3">
					<div class="flex items-center gap-2 mb-2">
						<span class="material-symbols-rounded text-green-600">check_circle</span>
						<span class="text-green-900 font-bold text-sm">Free Installation Included!</span>
					</div>
					<p class="text-green-800 text-xs">Expert technicians will install your RO system at no extra cost</p>
				</div>
				<div class="text-sm text-gray-700 space-y-2">
					<div class="flex items-start gap-2">
						<span class="material-symbols-rounded text-primary text-base mt-0.5">schedule</span>
						<div>
							<p class="font-medium">Same-day installation available</p>
							<p class="text-xs text-gray-600">Book your slot when purchasing</p>
						</div>
					</div>
					<div class="flex items-start gap-2">
						<span class="material-symbols-rounded text-primary text-base mt-0.5">build</span>
						<div>
							<p class="font-medium">Professional mounting</p>
							<p class="text-xs text-gray-600">Wall-mounted or counter-top options</p>
						</div>
					</div>
					<div class="flex items-start gap-2">
						<span class="material-symbols-rounded text-primary text-base mt-0.5">water_drop</span>
						<div>
							<p class="font-medium">Complete testing</p>
							<p class="text-xs text-gray-600">TDS level check & demo included</p>
						</div>
					</div>
				</div>
			</div>
			${this.getWhatsAppButton()}
		`;
	}

	getMaintenanceInfo() {
		return `
			<p class="text-gray-800 text-sm font-medium mb-3">Maintenance & Service:</p>
			<div class="space-y-2 text-sm text-gray-700 mb-3">
				<div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
					<p class="font-bold text-blue-900 mb-1">Regular Maintenance Schedule:</p>
					<ul class="space-y-1 text-xs text-blue-800">
						<li>• Pre-filters: Every 6-12 months</li>
						<li>• RO Membrane: Every 18-24 months</li>
						<li>• UV Lamp: Every 12 months</li>
						<li>• Full service check: Annually</li>
					</ul>
				</div>
				<div class="flex items-start gap-2">
					<span class="material-symbols-rounded text-green-600 text-base mt-0.5">support_agent</span>
					<div>
						<p class="font-medium">Expert Support Available</p>
						<p class="text-xs text-gray-600">Call us for maintenance scheduling</p>
					</div>
				</div>
				<div class="flex items-start gap-2">
					<span class="material-symbols-rounded text-purple-600 text-base mt-0.5">inventory_2</span>
					<div>
						<p class="font-medium">Genuine Spare Parts</p>
						<p class="text-xs text-gray-600">Original components only</p>
					</div>
				</div>
			</div>
			${this.getWhatsAppButton()}
		`;
	}

	getComparisonInfo() {
		const roProducts = this.products.filter(p => p.category === 'RO Systems').slice(0, 3);
		
		if (roProducts.length < 2) {
			return `
				<p class="text-gray-800 text-sm mb-3">We have multiple RO systems to suit different needs!</p>
				<p class="text-sm text-gray-700 mb-3">Our range includes:</p>
				<ul class="space-y-1.5 text-sm text-gray-700 mb-3">
					<li>• Compact models for small families</li>
					<li>• High-capacity systems for large households</li>
					<li>• Premium systems with advanced features</li>
					<li>• Budget-friendly options</li>
				</ul>
				<p class="text-xs text-gray-500"><a href="/products.html" class="text-primary hover:underline">Compare all products →</a></p>
			`;
		}
		
		let html = '<p class="text-gray-800 text-sm font-medium mb-3">Compare our top systems:</p>';
		html += '<div class="space-y-2">';
		
		roProducts.forEach(product => {
			const capacity = product.specifications?.storageCapacity || 'N/A';
			const stages = product.specifications?.purificationStages || 'N/A';
			
			const price = product.sellingPrice || product.price || 0;
			html += `
				<div class="border border-gray-200 rounded-lg p-3 hover:border-primary/50 transition-colors">
					<h4 class="font-bold text-xs text-gray-900 mb-1">${product.name}</h4>
					<div class="flex items-center justify-between text-xs text-gray-600 mb-2">
						<span>Capacity: ${capacity}</span>
						<span>${stages} Stages</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-primary font-bold text-sm">₹${price.toLocaleString('en-IN')}</span>
						<a href="/product.html?id=${product.id}" class="text-xs text-primary hover:underline">Details →</a>
					</div>
				</div>
			`;
		});
		
		html += '</div>';
		html += '<p class="text-xs text-gray-500 mt-3"><a href="/products.html" class="text-primary hover:underline">See full comparison →</a></p>';
		
		return html;
	}

	getOffersInfo() {
		return `
			<p class="text-gray-800 text-sm font-medium mb-3">💰 Special Offers & Pricing:</p>
			
			<div class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 mb-3">
				<h4 class="text-green-900 font-bold text-sm mb-2 flex items-center gap-2">
					<span class="material-symbols-rounded text-xl">payments</span>
					B2C Consumer Offer
				</h4>
				<p class="text-green-800 text-sm mb-1"><strong>${this.storeInfo.paymentOffers.b2c.discount}</strong></p>
				<p class="text-green-700 text-xs">${this.storeInfo.paymentOffers.b2c.maxDiscount}</p>
				<p class="text-green-600 text-xs mt-2 italic">${this.storeInfo.paymentOffers.b2c.note}</p>
			</div>
			
			<div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 mb-3">
				<h4 class="text-blue-900 font-bold text-sm mb-3 flex items-center gap-2">
					<span class="material-symbols-rounded text-xl">store</span>
					Bulk Order MOQ & Credit Terms
				</h4>
				<div class="space-y-2 text-xs mb-2">
					<div class="bg-white/60 rounded-lg p-3">
						<div class="flex justify-between items-center mb-1">
							<span class="text-blue-800 font-bold">Dealer</span>
							<span class="text-blue-600 font-bold text-lg">${this.storeInfo.paymentOffers.moq.dealer} units</span>
						</div>
						<p class="text-red-600 text-xs">❌ No credit facility (100% advance)</p>
					</div>
					<div class="bg-white/60 rounded-lg p-3">
						<div class="flex justify-between items-center mb-1">
							<span class="text-blue-800 font-bold">Distributor</span>
							<span class="text-blue-600 font-bold text-lg">${this.storeInfo.paymentOffers.moq.distributor} units</span>
						</div>
						<p class="text-green-600 text-xs">✓ 15 days credit (min 70% advance)</p>
					</div>
					<div class="bg-white/60 rounded-lg p-3">
						<div class="flex justify-between items-center mb-1">
							<span class="text-blue-800 font-bold">Super Stockist</span>
							<span class="text-blue-600 font-bold text-lg">${this.storeInfo.paymentOffers.moq.superStockist} units</span>
						</div>
						<p class="text-green-600 text-xs">✓ 15 days credit (50% advance)</p>
					</div>
				</div>
				<p class="text-blue-600 text-xs italic">${this.storeInfo.paymentOffers.moq.note}</p>
			</div>
			
			<div class="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 text-xs mb-3">
				<h4 class="text-amber-900 font-bold text-sm mb-2 flex items-center gap-2">
					<span class="material-symbols-rounded text-lg">warning</span>
					Credit Terms
				</h4>
				<p class="text-amber-800 mb-1"><strong>⚠️ Non-Payment Penalty:</strong></p>
				<p class="text-amber-700">On non-payment after credit period, penalties include: changes in credit terms, margin revisions, and order suspension until clearance.</p>
			</div>
			
			<div class="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-900">
				<strong>📞 For Custom Quotes:</strong><br/>
				Contact us during ${this.storeInfo.officeHours} for bulk orders and special pricing.
			</div>
		`;
	}

	getDefaultResponse() {
		return `
			<p class="text-gray-800 text-sm mb-3">I'm not sure about that, but I can help you with:</p>
			<ul class="space-y-1.5 text-sm text-gray-700 mb-3">
				<li>• Product information</li>
				<li>• Pricing details</li>
				<li>• Store location</li>
				<li>• Contact information</li>
			</ul>
			<p class="text-sm text-gray-800 mb-3">Or you can reach us directly:</p>
			${this.getWhatsAppButton()}
		`;
	}

	getWhatsAppButton() {
		const message = encodeURIComponent('Hi! I have a question about FinGaurd water purifiers.');
		return `
			<div class="mt-3 pt-3 border-t border-gray-200">
				<a href="https://wa.me/${this.whatsappNumber.replace(/\+/g, '')}?text=${message}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
					</svg>
					Chat on WhatsApp
				</a>
			</div>
		`;
	}

	escapeHtml(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}
}

// Initialize chat assistant when DOM is loaded
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => new ChatAssistant());
} else {
	new ChatAssistant();
}
