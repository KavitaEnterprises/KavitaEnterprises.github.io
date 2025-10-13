import "./jquery.js";

$(function () {
	$("body > header").load("components/header.html", function () {
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
});
