/**
 * FinGaurd Website Configuration
 * Centralized configuration for all website settings
 * @version 1.0.0
 */

export const CONFIG = {
	// Brand Information
	brand: {
		name: 'FinGaurd',
		tagline: 'India\'s Trusted RO Manufacturer',
		parentCompany: 'Kavita Enterprises',
		description: 'Experience pure water with FinGaurd\'s premium water purification systems.',
		established: '2009',
		customersServed: '50,000+',
		yearsExperience: '15+'
	},

	// Contact Information
	contact: {
		phone: {
			primary: '9821560609',
			formatted: '+91 98215 60609',
			display: '+91-9821560609',
			whatsapp: '919821560609' // Without + for WhatsApp links
		},
		email: {
			primary: 'info@finguard.in',
			support: 'support@finguard.in',
			sales: 'sales@finguard.in'
		},
		address: {
			full: 'Captain garden, Jain Nagar Extension, Karala, Delhi-110081, India',
			street: 'Captain garden, Jain Nagar Extension',
			area: 'Karala',
			city: 'Delhi',
			pincode: '110081',
			state: 'Delhi',
			country: 'India',
			landmark: 'Near Balaji Mandir',
			formatted: 'Captain garden, Jain Nagar Extension, Karala, Delhi-110081, India (Near Balaji Mandir)'
		}
	},

	// Business Hours
	hours: {
		weekdays: 'Monday - Saturday',
		timing: '11 AM - 5 PM',
		formatted: 'Mon-Sat: 11 AM - 5 PM',
		closed: 'Sunday and Public Holidays',
		fullText: '11 AM - 5 PM (Monday - Saturday)',
		note: 'Closed on Sundays and Public Holidays'
	},

	// Social Media
	social: {
		whatsapp: {
			enabled: true,
			number: '919821560609',
			url: 'https://wa.me/919821560609',
			message: 'Hello! I am interested in FinGaurd water purifiers.'
		},
		instagram: {
			enabled: true,
			handle: '@finguard',
			url: 'https://instagram.com/finguard'
		},
		facebook: {
			enabled: true,
			handle: 'FinGaurd',
			url: 'https://facebook.com/finguard'
		},
		twitter: {
			enabled: false,
			handle: '@finguard',
			url: 'https://twitter.com/finguard'
		},
		youtube: {
			enabled: false,
			channel: 'FinGaurd',
			url: 'https://youtube.com/@finguard'
		}
	},

	// Website Settings
	site: {
		name: 'FinGaurd - Premium Water Purifiers',
		url: 'https://kavitaenterprises.github.io',
		description: 'Leading manufacturer of RO water purifiers in India. Get pure, safe drinking water with FinGaurd.',
		keywords: ['water purifier', 'RO system', 'water filter', 'reverse osmosis', 'India'],
		language: 'en',
		locale: 'en_IN',
		currency: 'INR',
		currencySymbol: '₹'
	},

	// Product Settings
	products: {
		dataSource: '/data/products.json',
		maxProducts: 100,
		categoriesEnabled: true,
		categories: [
			{ id: 'ro-systems', name: 'RO Systems', icon: 'water_drop' },
			{ id: 'filters', name: 'Filters', icon: 'filter_alt' },
			{ id: 'pumps', name: 'Pumps', icon: 'settings' },
			{ id: 'accessories', name: 'Accessories', icon: 'category' }
		],
		defaultImage: '/assets/images/placeholder.jpg',
		imagesPerProduct: 4
	},

	// Promotional Offers
	offers: {
		prepaidDiscount: {
			enabled: true,
			tiers: [
				{
					name: 'Small Order Discount',
					maxAmount: 5000,
					discount: '5%',
					maxDiscount: 100,
					description: 'Orders up to ₹5,000'
				},
				{
					name: 'Large Order Discount',
					minAmount: 5000,
					discount: '₹250',
					description: 'Orders above ₹5,000'
				}
			],
			channel: 'WhatsApp',
			terms: 'Prepaid orders only. Discount applied after confirmation on WhatsApp.'
		}
	},

	// Cart & Checkout Settings
	cart: {
		storageKey: 'cart',
		enabled: true,
		minOrderAmount: 0,
		maxOrderAmount: 100000,
		shippingCalculation: 'custom', // 'free', 'flat', 'custom'
		taxEnabled: true,
		gstRate: 18 // GST percentage
	},

	// Favorites/Wishlist Settings
	favorites: {
		storageKey: 'favorites',
		enabled: true,
		maxItems: 50
	},

	// Service & Support
	services: {
		installation: {
			enabled: true,
			free: true,
			description: 'Free installation with every purchase'
		},
		amc: {
			enabled: true,
			plans: ['Basic', 'Standard', 'Premium'],
			description: 'Annual Maintenance Contracts available'
		},
		warranty: {
			default: '1 year',
			extended: true,
			description: 'Standard 1-year warranty on all products'
		},
		support: {
			channels: ['Phone', 'WhatsApp', 'Email'],
			responseTime: '24 hours',
			availability: 'Mon-Sat: 11 AM - 5 PM'
		}
	},

	// Features & USPs
	features: {
		freeDelivery: true,
		cashOnDelivery: true,
		easyReturns: true,
		genuineProducts: true,
		expertInstallation: true,
		lifetimeSupport: true
	},

	// UI Settings
	ui: {
		theme: {
			primary: '#2563eb',
			secondary: '#54e8e8',
			primaryDark: '#1e40af'
		},
		animations: {
			enabled: true,
			duration: 300
		},
		toast: {
			duration: 3000,
			position: 'top-right'
		}
	},

	// SEO & Analytics
	seo: {
		titleSuffix: ' | FinGaurd Water Purifiers',
		defaultTitle: 'FinGaurd - Premium Water Purifiers & RO Systems',
		defaultDescription: 'Leading manufacturer of RO water purifiers in India. Get pure, safe drinking water with FinGaurd.',
		ogImage: '/assets/images/og-image.jpg'
	},

	// Legal & Policies
	legal: {
		termsUrl: '/terms.html',
		privacyUrl: '/privacy.html',
		shippingUrl: '/shipping-returns.html',
		warrantyUrl: '/warranty.html',
		companyName: 'Kavita Enterprises',
		gstNumber: 'GST_NUMBER_HERE' // To be updated
	}
};

// Utility functions for common config operations
export const getWhatsAppLink = (message = null) => {
	const msg = message || CONFIG.social.whatsapp.message;
	return `${CONFIG.social.whatsapp.url}?text=${encodeURIComponent(msg)}`;
};

export const formatPhone = (includeCountryCode = true) => {
	return includeCountryCode 
		? CONFIG.contact.phone.formatted 
		: CONFIG.contact.phone.primary;
};

export const getFullAddress = (includeNewlines = false) => {
	if (includeNewlines) {
		return `${CONFIG.contact.address.street}\n${CONFIG.contact.address.area}, ${CONFIG.contact.address.city}-${CONFIG.contact.address.pincode}\n${CONFIG.contact.address.state}, ${CONFIG.contact.address.country}\n${CONFIG.contact.address.landmark}`;
	}
	return CONFIG.contact.address.formatted;
};

export const getSocialLinks = (activeOnly = true) => {
	if (activeOnly) {
		return Object.entries(CONFIG.social)
			.filter(([key, value]) => value.enabled)
			.map(([key, value]) => ({ platform: key, ...value }));
	}
	return CONFIG.social;
};

// Helper to get category by ID
export const getCategoryById = (categoryId) => {
	return CONFIG.products.categories.find(cat => cat.id === categoryId);
};

// Make CONFIG available globally for non-module scripts (backward compatibility)
if (typeof window !== 'undefined') {
	window.CONFIG = CONFIG;
	window.getWhatsAppLink = getWhatsAppLink;
	window.formatPhone = formatPhone;
	window.getFullAddress = getFullAddress;
	window.getSocialLinks = getSocialLinks;
	window.getCategoryById = getCategoryById;
}

// Export default
export default CONFIG;