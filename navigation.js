/* Navigation Events */
class finviaNavigation {
	constructor(pids) {
		this.MOBILE = 767
		this.SCROLLSENSITIVITY = 200
		this.formIds = pids
		// this.formIds = {
		// 	hri: "https://go.finvia.fo/l/985431/2023-04-26/3grhdk",
		// 	newsletter: "https://go.finvia.fo/l/985431/2023-06-19/3j8gf5",
		// 	contactform: " https://go.finvia.fo/l/985431/2023-06-19/3j8gdy",
		// 	alternativeinvestments: "https://go.finvia.fo/l/985431/2023-06-19/3j8gf2",
		// 	privateequity: "https://go.finvia.fo/l/985431/2023-06-19/3j8gfc",
		// 	impact: "https://go.finvia.fo/l/985431/2023-06-19/3j8gf8",
		// 	venturecapital: "https://go.finvia.fo/l/985431/2023-06-19/3j8gfn",
		// 	pewhitepaper: "https://go.finvia.fo/l/985431/2023-06-19/3j8gfg",
		// 	saatool: "https://go.finvia.fo/l/985431/2023-06-19/3j8gfk"
		// }
		this.init()
		this.lastScrollPosition = window.scrollY || document.documentElement.scrollTop;
		window.addEventListener('scroll', this.handleScroll.bind(this));
		window.addEventListener('scroll', this.handlePageScroll.bind(this));
	}
	init() {
		var that = this
		this.burger = document.getElementById('nav--burger')
		this.login = document.getElementById('nav--login')
		this.mainNav = document.querySelector('.nav--inner.main')
		this.loginNav = document.querySelector('.nav--inner.login')
		this.navBG = false
		this.subNavLinks = document.querySelectorAll('.nav--inner-main .nav--link.has--children')
		this.subNavLinksLayer2 = document.querySelectorAll('.nav--layer-2 .nav--link.has--children')
		this.subNavs = document.querySelectorAll('.nav--layer-2')
		this.subNavsLayer3 = document.querySelectorAll('.nav--layer-3')
		this.customSubNavs = document.querySelectorAll('.nav--layer-2')
		this.subNavBackLinks = document.querySelectorAll('.nav--back-link')
		this.modalLinks = document.querySelectorAll('[data-modal]')
		this.navContainer = document.querySelector('.fv--nav')
		this.scrollToSection()
		this.toogleAccordion()
		this.handleShareLinks()
		// this.validateForms()
		this.setFormHandlers()
		this.newsletterPopupClose()

		if (!this.burger) return;
		this.burger.addEventListener('click', function (e) {
			that.toggleNav(that.mainNav, that.loginNav)
		})

		this.login.addEventListener('click', function (e) {
			that.toggleNav(that.loginNav, that.mainNav)
		})

		this.subNavLinks.forEach(function (link) {
			link.addEventListener('click', function (e) {
				e.preventDefault()
				that.toggleSubNav(link)
			})
		})

		this.subNavLinksLayer2.forEach(function (link) {
			link.addEventListener('click', function () {
				that.toggleThirdLevelNav(link)
			})
		})

		window.addEventListener('keyup', e => {
			if (e.key === 'Escape') {
				this.closeNav()
			}

		})

		this.getMainNavWidth()
		this.closeMobileSubNavHandler()
		this.createTabs()
		this.setModalLinks()
		this.addTimestampToForms()
		this.validateFormStep()

	}

	addTimestampToForms() {
		const timeStamp = new Date().toLocaleString()
		const formattedTimeStamp = timeStamp.replace(new RegExp('/', 'g'), '-')
		const formInputs = document.querySelectorAll('input[name*="Timestamp"]')
		if (!formInputs) return
		formInputs.forEach(input => {
			input.value = formattedTimeStamp
		})
	}

	setSessionStorage(name, value) {
		
		window.sessionStorage.setItem(name, value)
	}

	newsletterPopupClose() { 
		const closButton = document.querySelector('.newsletter--popup .close--button')
		if (!closButton) return
		closButton.addEventListener('click', () => {
			this.setSessionStorage('newsletterPopup', 'true')
			document.body.classList.remove('scrolled')
		})
	}

	getSessionStorage(name) {
		return window.sessionStorage.getItem(name)
	}

	

	handlePageScroll(e) {
		// check if page is scrolled 50% of the viewport height
		const scrollPosition = window.scrollY || document.documentElement.scrollTop;
		const scrollHeight = document.documentElement.scrollHeight;
		const clientHeight = document.documentElement.clientHeight;
		const scrollPercentage = (scrollPosition / (scrollHeight - clientHeight)) * 100;
		// check if .newsletter--popup bottom is less than footer top
		const newsletterPopup = document.querySelector('.newsletter--popup')
		const footer = document.querySelector('footer')
		if(!newsletterPopup || !footer) return
		const newsletterPopupBottom = newsletterPopup.getBoundingClientRect().bottom
		const footerTop = footer.getBoundingClientRect().top

		if( this.getSessionStorage('newsletterPopup') === 'true') return

		if (scrollPercentage > 40 && newsletterPopupBottom < footerTop) {
			document.body.classList.add('scrolled')
		}
		else {
			document.body.classList.remove('scrolled')
		}
	 }

	handleShareLinks() {
		const shareLinks = document.querySelectorAll('.social--icon[data-slug]')
		if (!shareLinks) return
		shareLinks.forEach(link => {
			link.addEventListener('click', () => {
				// http://www.linkedin.com/shareArticle?mini=true&url=&title=&summary=&source=
				const slug = link.dataset.slug
				const url = link.dataset.url
				const shareUrl = url + slug
				const isLinkedin = link.dataset.linkedin ? true : false
				if (isLinkedin) {
					const lindkedinurl = `http://www.linkedin.com/shareArticle?mini=true&title=${slug}&url=${shareUrl}`
					window.open(lindkedinurl, '_blank')
				} else if (link.dataset.mailto) {
					window.location.href = `mailto:?subject=FINVIA%20${link.dataset.mailto}&body=${shareUrl}`
				} else {
					const clipboard = navigator.clipboard;

					// Write the text to the clipboard
					clipboard.writeText(shareUrl)
						.then(() => {
							console.log('Text copied to clipboard!', link.querySelector('.link--tooltip'));

							link.querySelector('.link--tooltip').classList.add('active')
							setTimeout(() => {
								link.querySelector('.link--tooltip').classList.remove('active')
							}, 1000)
						})
						.catch((error) => {
							console.error('Failed to copy text:', error);
						});
				}
			})
		})

	}

	closeAllSubNavs() {
		this.subNavs.forEach(function (subNav) {
			subNav.classList.remove('open')
		})
		this.subNavsLayer3.forEach(function (link) {
			link.classList.remove('open')
		}
		)
	}

	toogleAccordion() {
		const accordionHeaders = document.querySelectorAll('.accordion--header')
		if (!accordionHeaders) return
		accordionHeaders.forEach(header => {
			console.log(header)
			header.addEventListener('click', (e) => {
				e.target.closest('.accordion').classList.toggle('active')
				console.log(header)
			})
		})
	}

	toggleSubNav(el) {
		var targetSubNav = document.querySelector('.nav--layer-2[data-nav="' + el.dataset.nav + '"], .nav--layer-3[data-nav="' + el.dataset.nav + '"]')
		el.classList.toggle('active')
		targetSubNav.classList.toggle('open')
		this.mainNav.dataset.navlayer = targetSubNav.classList.contains('open') ? '2' : '1'
		this.subNavLinks.forEach(function (link) {
			if (el !== link) link.classList.remove('active')
		})
		this.subNavs.forEach(function (subNav) {
			if (subNav !== targetSubNav) subNav.classList.remove('open')
		})
		this.subNavsLayer3.forEach(function (link) {
			link.classList.remove('open')
		})
	}

	handleScroll() {
		var currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
		var scrollDifference = Math.abs(currentScrollPosition - this.lastScrollPosition);
		if (scrollDifference > this.SCROLLSENSITIVITY) {
			if (currentScrollPosition > this.lastScrollPosition) {
				// Scrolling down
				this.isScrollingDown = true;
			} else {
				// Scrolling up
				this.isScrollingDown = false;
			}

			this.lastScrollPosition = currentScrollPosition;

			// Call your custom method or trigger actions based on scroll direction
			this.onScrollDirectionChange();
		}
	}

	onScrollDirectionChange() {

		// This method can be overridden in a subclass or modified to perform specific actions based on scroll direction
		if (window.innerWidth < this.MOBILE) {
			if (this.isScrollingDown) {
				console.log('DOWN')
				this.navContainer.classList.add('hide')
				document.body.classList.add('slideout')
			} else {
				console.log('UP')
				document.body.classList.remove('slideout')
				this.navContainer.classList.remove('hide')
			}
		}
	}

	scrollToSection() {
		const buttons = document.querySelectorAll('[data-scrollid]')
		if (!buttons) return
		buttons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault()
				const target = document.getElementById(`${button.dataset.scrollid}`)
				console.log(target, button.dataset.scrollid)
				target.scrollIntoView({ behavior: 'smooth' })
			})
		})
	}



	closeMobileSubNavHandler() {
		var mainNav = this.mainNav
		this.subNavBackLinks.forEach(function (navLink) {
			navLink.addEventListener('click', function (e) {
				e.preventDefault()
				var backTarget = document.querySelector('.nav--link[data-nav="' + navLink.dataset.back + '"]')
				mainNav.dataset.navlayer = parseInt(mainNav.dataset.navlayer) - 1

				backTarget.classList.remove('active')
				navLink.closest('.nav--layer-2').classList.remove('open')
				mainNav.classList.remove('subnav--open')
			})
		})
	}

	closeNav() {

		this.closeAllSubNavs()

		setTimeout(() => {
			this.burger.classList.remove('open')
			this.mainNav.classList.remove('open')
			this.loginNav.classList.remove('open')
			this.mainNav.classList.remove('subnav--open')
			if (this.navBG) this.navContainer.removeChild(this.navBG)
			this.navBG = false
			console.log(parseInt(this.mainNav.dataset.navlayer))

		}, (parseInt(this.mainNav.dataset.navlayer) - 1) * 100)

		this.mainNav.dataset.navlayer = '1'
	}

	toggleNav(el, navToClose) {

		this.closeAllSubNavs()

		if (el.classList.contains('open')) {
			this.closeNav()
		} else {
			if (!this.navBG) {
				this.navBG = document.createElement('div')
				this.navBG.classList.add('nav--bg')
				this.navBG.classList.add('visible')
				this.navContainer.appendChild(this.navBG)
			}
			el.classList.add('open')
			this.burger.classList.add('open')

		}
		navToClose.classList.remove('open')
		this.subNavs.forEach(function (subNav) {
			subNav.classList.remove('open')
		})
	}


	getMainNavWidth() {
		if (window.innerWidth >= this.MOBILE) {
			this.navContainer.classList.remove('hide')
			document.body.classList.remove('slideout')
		}
		var mainNavWidth = this.mainNav.offsetWidth
		this.subNavs.forEach(function (nav) {
			// nav.style.left = '0px'
			// nav.style.paddingLeft = mainNavWidth + 'px'
		})
	}

	createTabs() {
		if (!document.querySelector('.fv--leistungs-tabs')) return

		const tabHeaders = document.querySelectorAll('.fv--leistungs-tabs .tab--header')
		const tabBodies = document.querySelectorAll('.fv--leistungs-tabs .tab--content')

		tabHeaders.forEach((tab, index) => {
			if (index === 0) {
				tab.classList.add('active')
				tab.nextElementSibling.classList.add('active')
			}
			tab.addEventListener('click', () => {
				tabHeaders.forEach(t => t.classList.remove('active'))
				tabBodies.forEach(b => b.classList.remove('active'))
				tab.classList.add('active')
				tab.nextElementSibling.classList.add('active')
			})
		})
	}

	replaceLinkUrls(linkPart, replace) {
		const links = document.querySelectorAll('a[href*="' + linkPart + '"]')
		links.forEach(link => {
			let linkHref = link.href
			linkHref = linkHref.replace(linkPart, replace)

			link.href = linkHref
		})
	}



	showModal(el) {
		el.classList.add('active')
		// document.body.style.height = "100svh"
	}
	hideModal(el) {
		if (!el) return
		el.classList.remove('active')
		// document.body.style.height = ""
		if (el.querySelector('.video')) {
			const content = el.querySelector('.video').innerHTML
			el.querySelector('.video').innerHTML = content
		}
	}

	validateFormStep() {
		if (!document.querySelector('[data-formstep]')) return
		const stepButtons = document.querySelectorAll('[data-formstep]')
		stepButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault()
				const requiredStepFields = button.closest('.form-step-1').querySelectorAll('[required]')
				let valid = true
				requiredStepFields.forEach(field => {
					if (!field.checkValidity()) {
						valid = false
						field.style.borderColor = '#e51515'
						button.nextElementSibling.style.color = "#e51515"
					} else {
						field.style.borderColor = ''
						button.nextElementSibling.style.color = ""
					}
				})

				if (valid) {
					button.closest('.multistep-wrapper').style.transform = 'translateX(-50%)'
				}

			})
		})
	}

	setModalLinks() {
		if (!document.querySelector('[data-modal]')) return

		window.addEventListener('keyup', e => {
			if (e.key === 'Escape') {
				this.hideModal(document.querySelector('.modal.active'))
			}

		})
		this.modalLinks.forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault()
				const modal = document.querySelector('[data-modaltarget="' + link.dataset.modal + '"]')
				modal.querySelector('.modal--close').addEventListener('click', () => this.hideModal(document.querySelector('.modal.active')))
				this.showModal(modal)
			})
		})
	}

	checkCaptcha(form) {

		

		

		if (form.getAttribute('data-hcaptcha-sitekey')) {
			const formCapchtaContainer = form.querySelector('.captcha')
			const errorText = document.createElement('p')
			errorText.style.color = '#e51515'

			if (!formCapchtaContainer.querySelector('.error')) formCapchtaContainer.appendChild(errorText)

			if (window.sessionStorage.getItem('captcha-' + form.dataset.formelement)) {
				errorText.innerHTML = ""
				window.sessionStorage.removeItem('captcha-' + form.dataset.formelement)
				return true
			} else {
				errorText.classList.add('error')
				errorText.innerHTML = "Bitte Captcha lÃ¶sen"
				console.log("Capcha lÃ¶sen")
				return false
			}

		}
	}



	setFormHandlers() {

		const forms = document.querySelectorAll('[data-formelement]')
		if (!forms) return
		forms.forEach(form => {
			// this.setCaptchas(form)
			
			form.setAttribute('novalidate', true)
			form.addEventListener('submit', (e) => {
				e.preventDefault()

				if (window.location.search === "?test") { 
					const formData = new FormData(form)
					console.log(this.formIds[form.dataset.formelement], form.EMAIL.value, form["newsletter_-_c-newsletter"].value, form["Opt-in-Timestamp-Newsletter"].value, formData)
				
					// return 
				}
				const action = this.formIds[form.dataset.formelement]
				form.action = action

				// check if phone number is valid
				if (form.PHONE) {
					const phone = form.PHONE.value
					const phoneRegex = new RegExp(/^[0-9\-\+]{9,15}$/)
					if (!phoneRegex.test(phone)) {
						form.PHONE.style.borderColor = '#e51515'
						return false
					}
				}

				if (this.checkHoneyPot(form)) {
					form.submit()
				}
			})
		})
	}

	checkHoneyPot(form) {

		const isCaptchaSolved = this.checkCaptcha(form)

		

		if (form.namehp && form.anredehp) {


			form.removeAttribute('novalidate')
			form.namehp.removeAttribute('required')
			form.anredehp.removeAttribute('required')
			if (form.namehp.value !== '' || form.anredehp.value !== '') {
				return window.location.href = '/404'
			}
			if (form.checkValidity() && isCaptchaSolved) {
				return true
			} else {
				form.querySelectorAll('[required]').forEach(field => {
					if (!field.value || !field.checked) field.style.borderColor = '#e51515'
				})
				return false
			}
		} else {

			if (isCaptchaSolved) {
				form.removeAttribute('novalidate')
				form.checkValidity()
				return true
			}

			return false

		}

	}

}


window.addEventListener('DOMContentLoaded', function () {
	const finviaNav = new finviaNavigation(pids)
	window.addEventListener('resize', function () {
		finviaNav.getMainNavWidth();
	})
	finviaNav.replaceLinkUrls('/finvia-leistungen/', '/leistungen/')
})

class TeamFilter {
	constructor() {
		this.init()
	}
	filterItemsOnClick() {
		this.filterButtons.forEach(button => {
			button.addEventListener('click', () => {
				this.filterButtons.forEach(b => b.classList.remove('active'))
				const buttonFilterData = button.dataset.filterbutton
				document.querySelectorAll('[data-filterbutton="' + buttonFilterData + '"]').forEach(b => b.classList.add('active'))
				this.showTeamSections(button.dataset.filterbutton)
			})
		})
	}

	init() {
		if (!document.querySelectorAll('[data-filterbutton]')) return
		this.filterButtons = document.querySelectorAll('[data-filterbutton]')
		this.filterItems = document.querySelectorAll('[data-filter]')
		this.filterItemsOnClick()
		this.addOnClickEvents()

	}

	addOnClickEvents() {
		const eventButtons = document.querySelectorAll('a[data-calendlyclick]')
		eventButtons.forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault()
				// Calendly.initPopupWidget({ url: button.dataset.calendlyclick + '?hide_gdpr_banner=1&background_color=038b9b&text_color=ffffff&primary_color=ffffff' });
				Calendly.initPopupWidget({ url: button.dataset.calendlyclick + '?hide_gdpr_banner=1&background_color=ffffff&text_color=000000&primary_color=038b9b' });
				return false;

			})
		})
	}

	showTeamSections(el) {
		if (el === '') {
			this.filterItems.forEach(item => item.style.display = '')
		} else {
			this.filterItems.forEach(item => {
				item.style.display = 'none'
				if (item.dataset.filter === el) item.style.display = ''
			})
		}
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const teamFilter = new TeamFilter()
})


var Webflow = Webflow || [];

Webflow.push(function () {

	const createVimeoPlayer = (videoId, id) => {
		const args = {
			id: videoId,
			playsinline: true,
		}
		const player = new Vimeo.Player(id, args)
		return player
	}

	const videoFrames = document.querySelectorAll('.video--player[data-videoid]')

	videoFrames.forEach(frame => {

		const videoId = frame.dataset.videoid
		frame.id = videoId
		const videoPlayer = createVimeoPlayer(videoId, frame)
		// videoPlayer.element.playsinline = true

		const playButton = document.querySelector('[data-videobutton="' + videoId + '"]')
		const closeButton = document.querySelector('[data-videoclose="' + videoId + '"]')
		playButton.addEventListener('click', () => {
			videoPlayer.play()
		})
		closeButton.addEventListener('click', () => {
			videoPlayer.pause()
		})
		window.addEventListener('keyup', e => {
			if (e.key === 'Escape') {
				videoPlayer.pause()
			}
		})
	})

})


