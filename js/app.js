import "./jquery.js";

// Use global Cart if available (from cart.js). Provide minimal fallback for safety.
const Cart = window.Cart || {
	getCart() {
		return JSON.parse(localStorage.getItem('cart')) || [];
	},

	getCartCount() {
		return this.getCart().reduce((count, item) => count + Number(item.quantity || 0), 0);
	},

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
};

if (!window.Cart) {
	window.Cart = Cart;
}

const Alert = window.Alert || (() => {
	const ALERT_TYPES = new Set(['success', 'error', 'info']);

	const dismiss = (node) => {
		if (!node || !node.classList) return;
		node.classList.remove('show');
		setTimeout(() => {
			if (node.parentElement) node.remove();
		}, 250);
	};

	const show = (message, type = 'info', duration = 6000) => {
		const resolvedType = ALERT_TYPES.has(type) ? type : 'info';
		const host = document.body;
		if (!host) {
			return null;
		}

		document.querySelectorAll('.custom-alert').forEach(dismiss);

		const alert = document.createElement('div');
		alert.className = `custom-alert ${resolvedType}`;
		alert.setAttribute('role', resolvedType === 'error' ? 'alert' : 'status');
		alert.setAttribute('aria-live', resolvedType === 'error' ? 'assertive' : 'polite');

		const content = document.createElement('div');
		content.className = 'custom-alert-content';

		const messageEl = document.createElement('div');
		messageEl.className = 'custom-alert-message';
		messageEl.textContent = String(message);

		const closeBtn = document.createElement('button');
		closeBtn.type = 'button';
		closeBtn.className = 'custom-alert-close';
		closeBtn.setAttribute('aria-label', 'Dismiss notification');
		closeBtn.innerHTML = '&times;';
		closeBtn.addEventListener('click', () => dismiss(alert));

		content.append(messageEl, closeBtn);
		alert.appendChild(content);

		host.appendChild(alert);
		requestAnimationFrame(() => alert.classList.add('show'));

		if (Number.isFinite(duration) && duration > 0) {
			setTimeout(() => dismiss(alert), duration);
		}

		return alert;
	};

	return {
		show,
		success(message, duration) {
			return show(message, 'success', duration ?? 6000);
		},
		error(message, duration) {
			return show(message, 'error', duration ?? 6000);
		},
		info(message, duration) {
			return show(message, 'info', duration ?? 6000);
		},
		dismissAll() {
			document.querySelectorAll('.custom-alert').forEach(dismiss);
		}
	};
})();

window.Alert = Alert;

if (typeof window.showAlert !== 'function') {
	window.showAlert = (message, type = 'info', duration = 6000) => Alert.show(message, type, duration);
}

$(function () {
	$("body > header").load("components/header.html", function () {
		// Update cart icon after header loads
		Cart.updateCartIcon();
		
		const $menuBtn = $("#menu-btn");
		const $mobileNav = $("#mobile-nav");
		
		$menuBtn.on("click", function () {
			$mobileNav.toggleClass("hidden");
			
			// Toggle icon between menu and close
			const $icon = $menuBtn.find(".material-symbols-rounded");
			if ($mobileNav.hasClass("hidden")) {
				$icon.text("menu");
			} else {
				$icon.text("close");
			}
		});

		// Close mobile menu when clicking outside
		$(document).on("click", function (e) {
			if (!$(e.target).closest("#mobile-nav, #menu-btn").length && !$mobileNav.hasClass("hidden")) {
				$mobileNav.addClass("hidden");
				$menuBtn.find(".material-symbols-rounded").text("menu");
			}
		});

		// Close mobile menu on window resize if screen becomes large
		let resizeTimer;
		$(window).on("resize", function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				if ($(window).width() >= 1024 && !$mobileNav.hasClass("hidden")) {
					$mobileNav.addClass("hidden");
					$menuBtn.find(".material-symbols-rounded").text("menu");
				}
			}, 250);
		});
	});
	$("body > footer").load("components/footer.html");
	
	// Load chat assistant component
	$("body").append('<div id="chat-assistant-placeholder"></div>');
	$("#chat-assistant-placeholder").load("components/chat-assistant.html", function() {
		// Load chat assistant script after component is loaded
		const script = document.createElement('script');
		script.src = '/js/chat-assistant.js';
		script.type = 'module';
		document.body.appendChild(script);
	});
	
	// Also update cart icon immediately in case header is already loaded
	setTimeout(() => Cart.updateCartIcon(), 200);
});

// Synchronize icon when other scripts update the cart
document.addEventListener('cart:updated', () => Cart.updateCartIcon());
