// Welcome Banner
let bannerCloseTimer
function closeBanner() {
	clearTimeout(bannerCloseTimer)
	const banner = document.getElementById("welcome-banner")
	const noShowCheckbox = document.getElementById("no-show-again")
	if (noShowCheckbox.checked) {
		localStorage.setItem("hideWelcomeBanner", "true")
	}
	banner.classList.remove("active")
}

// Slideshow
let currentHeroIndex = 0
const heroImages = ["clothing/hero.png", "clothing/hero1.jpg", "clothing/hero2.jpg", "clothing/hero3.jpg", "clothing/hero4.jpg", "clothing/hero5.jpg", "clothing/hero6.jpg", "clothing/hero7.jpg", "clothing/hero8.jpg", "clothing/hero9.jpg"]
const heroDotsContainer = document.getElementById("hero-dots")

// Manual arrow clicks
let heroInterval
function handleArrowClick(n) {
	clearInterval(heroInterval) // Stop the current timer
	changeHero(n) // Change the image immediately
	startSlideshow() // Restart the timer
}

function changeHero(n) {
	// Remove active class from current dot
	const oldDot = heroDotsContainer.children[currentHeroIndex]
	if (oldDot) oldDot.classList.remove("active")

	currentHeroIndex += n
	if (currentHeroIndex < 0) {
		currentHeroIndex = heroImages.length - 1
	}
	if (currentHeroIndex >= heroImages.length) {
		currentHeroIndex = 0
	}
	document.getElementById("hero").style.backgroundImage = `url('${heroImages.at(currentHeroIndex)}')`

	// Add active class to new dot
	const newDot = heroDotsContainer.children[currentHeroIndex]
	if (newDot) newDot.classList.add("active")
}

function startSlideshow() {
	heroInterval = setInterval(() => changeHero(1), 4000) // 4 seconds timer to play next slide
}

// Create and initialize dots
function createHeroDots() {
	heroImages.forEach((_, index) => {
		const dot = document.createElement("div")
		dot.classList.add("dot")
		dot.onclick = () => {
			clearInterval(heroInterval)
			currentHeroIndex = index - 1 // Subtract 1 because changeHero adds 1
			changeHero(1)
			startSlideshow()
		}
		heroDotsContainer.appendChild(dot)
	})
	// Activate the first dot on load
	if (heroDotsContainer.children[currentHeroIndex]) {
		heroDotsContainer.children[currentHeroIndex].classList.add("active")
	}
}

// On page load
window.addEventListener("DOMContentLoaded", () => {
	const banner = document.getElementById("welcome-banner")
	if (localStorage.getItem("hideWelcomeBanner") !== "true") {
		setTimeout(() => {
			banner.classList.add("active")
		}, 200) // 0.2 second delay before slide down
		bannerCloseTimer = setTimeout(() => {
			closeBanner()
		}, 5000) // Disappear after 5 second
	}

	// Preload next image
	heroImages.forEach((src) => {
		const img = new Image()
		img.src = src
	})

	createHeroDots() // Creates the dots before the slideshow starts

	// Initialize hero image
	document.getElementById("hero").style.backgroundImage = `url('${heroImages.at(currentHeroIndex)}')`
	startSlideshow()
})
