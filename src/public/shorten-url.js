const formEl = document.getElementById(`shorten-url-form`);
const shortUrlContainerEl = document.querySelector(`.short-url-container span`);

formEl.addEventListener(`submit`, async function (e) {
	try {
		e.preventDefault();

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const form = this;
		const {
			'long-url': longUrl,
			_csrf,
			'g-recaptcha-response': gRecaptchaResponse,
		} = Object.fromEntries(new FormData(form));
		const res = await fetch(`/api/v1`, {
			method: `POST`,
			headers: {
				'Content-Type': `application/json`,
				'XSRF-Token': _csrf,
			},
			credentials: `same-origin`,
			body: JSON.stringify({
				longUrl,
				'g-recaptcha-response': gRecaptchaResponse,
			}),
		});

		const { data: { shortUrl } = {} } = await res.json();
		const shortUrlEL = document.createElement(`a`);

		shortUrlEL.classList.add(`short-url`);
		shortUrlEL.target = `_blank`;
		shortUrlEL.href = shortUrl;
		shortUrlEL.textContent = shortUrl;

		shortUrlContainerEl.innerHTML = ``;
		shortUrlContainerEl.appendChild(shortUrlEL);
	} catch (err) {
		console.error(err);
	}
});
