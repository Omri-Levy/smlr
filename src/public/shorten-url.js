const errorEl = document.querySelector(`.error`);
const formEl = document.getElementById(`shorten-url-form`);
const shortUrlContainerEl = document.querySelector(`.short-url-container span`);

formEl.addEventListener(`submit`, async function (e) {
	try {
		e.preventDefault();

		errorEl.innerText = ``;
		/* eslint-disable-next-line @typescript-eslint/no-this-alias */
		const form = this;
		const TIMEOUT_IN_MS = 5000;
		const {
			'long-url': longUrl,
			_csrf,
			'g-recaptcha-response': gRecaptchaResponse,
		} = Object.fromEntries(new FormData(form));
		const controller = new AbortController();
		const { signal } = controller;
		/**
		 * Abort request on timeout.
		 * @type {NodeJS.Timeout}
		 */
		const timeout = setTimeout(() => {
			controller.abort(
				`Request timed out after ${TIMEOUT_IN_MS}ms (408)`,
			);
			errorEl.innerText = `Request took too long. Please try again. (408)`;
		}, TIMEOUT_IN_MS);
		const res = await fetch(`/api/v1`, {
			signal,
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
		}).then((res) => {
			clearTimeout(timeout);

			return res;
		});
		const { data: { shortUrl } = {}, message } = await res.json();

		if (!res?.ok) {
			let msg = `${message} (${res?.status})`;

			if (res?.status === 429) {
				msg = `Too many requests. Please try again later. (429)`;
			}

			errorEl.innerText = msg;
		}

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
