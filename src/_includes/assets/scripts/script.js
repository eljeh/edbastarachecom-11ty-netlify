window.addEventListener('DOMContentLoaded', function () {

	function getViewportWidth() {
		if (window.innerWidth) {
			return window.innerWidth;
		}
		else if (document.body && document.body.offsetWidth) {
			return document.body.offsetWidth;
		}
		else {
			return 0;
		}
	}

	function getViewportHeight() {
		if (window.innerHeight) {
			return window.innerHeight;
		}
		else if (document.body && document.body.offsetHeight) {
			return document.body.offsetHeight;
		}
		else {
			return 0;
		}
	}

	var header = document.querySelector('header');
	var banner = document.querySelector('#banner');
	var nav = document.querySelector('nav');
	var bannerOffset = '-' + banner.offsetTop + 'px';
	var bannerMobileOptions = { root: null, threshold: 0, rootMargin: "-53% 0px 0px" };
	var bannerDesktopOptions = { root: null, threshold: 0, rootMargin: bannerOffset };
	var bannerOptions = (getViewportWidth() > 1079) ? bannerDesktopOptions : bannerMobileOptions;
	var navItem = document.querySelectorAll('.navItem');
	var navLinkOptions = { root: null, threshold: 0, rootMargin: "-120px 0px -120px" };
	var sectionID = document.querySelectorAll('section[id]');
	var activeNavOptions = { root: null, threshold: 0, rootMargin: "-200px 0px -200px" };

	//add Fixed to banner when scrolled to top
	var bannerObserver = new IntersectionObserver(function (entries) {
		console.log('bannerOffset ' + bannerOffset);
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {

				console.log('removed fixed'); // removed fixed

				banner.classList.remove('fixed');
				nav.classList.remove('fixed');
			} else {

				console.log('added fixed'); // Added fixed

				banner.classList.add('fixed');
				nav.classList.add('fixed');
			}
		});
	}, bannerOptions);
	bannerObserver.observe(header);

	//add 'Fixed class' to nav items when scrolled to top
	var navLinkObserver = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.remove('stuck');
			} else {
				entry.target.classList.add('stuck');
			}
		});
	}, navLinkOptions);

	//add 'active class' to nav items when section in view
	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {

			console.log('activeNavOptions'); // activeNavOptions

			var id = entry.target.getAttribute('id');
			var linkSelector = document.querySelector('nav li a[href="#' + id + '"]');
			var navToggle = document.getElementById('toggle');
			if (entry.intersectionRatio > 0) {

				console.log(id + ' intersectionRatio > 0'); // intersectionRatio > 0

				linkSelector.parentElement.classList.add('active');
				navToggle.checked = false;
			} else {

				console.log(id + ' intersectionRatio < 0'); // intersectionRatio < 0

				linkSelector.parentElement.classList.remove('active');
			}
		});
	}, activeNavOptions);

	window.onload = function () {

		if (getViewportWidth() > 1079) {
			bannerObserver.observe(header); 	//add Fixed to banner when scrolled to top
			navItem.forEach(function (navItem) { navLinkObserver.observe(navItem); }); 	//add 'Fixed class' to nav items when scrolled to top
			sectionID.forEach(function (section) { observer.observe(section); }); 	//add 'active class' to nav items when section in view
		} else {
			sectionID.forEach(function (section) { observer.observe(section); }); 	//add 'active class' to nav items when section in view
		}
	};

	window.onresize = function () {

		if (getViewportWidth() > 1079) {
			bannerObserver.observe(header);	//add Fixed to banner when scrolled to top
			navItem.forEach(function (navItem) { navLinkObserver.observe(navItem); }); 	//add 'Fixed class' to nav items when scrolled to top
			sectionID.forEach(function (section) { observer.observe(section); }); 	//add 'active class' to nav items when section in view
		} else {
			sectionID.forEach(function (section) { observer.observe(section); }); 	//add 'active class' to nav items when section in view
		}
	};

});