document.getElementById("donation-form").addEventListener("submit", function (event) {
	event.preventDefault()
	const purpose = this.purpose.value
	const message = purpose === "Charity" ? "Thank you for donating to charity! Your item has been submitted." : "Thank you! Your donation for store credit is under review."
	alert(message)
	this.reset()
})
