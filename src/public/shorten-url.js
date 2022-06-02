const formEl = document.getElementById(`shorten-url-form`);
const shortUrlContainerEl = document.querySelector(`.short-url-container`);

formEl.addEventListener(`submit`, async function (e) {
	e.preventDefault();

	// eslint-disable-next-line @typescript-eslint/no-this-alias
	const form = this;
	const { 'long-url': longUrl, _csrf } = Object.fromEntries(
		new FormData(form),
	);
	const res = await fetch(`/`, {
		method: `POST`,
		headers: {
			'Content-Type': `application/json`,
			'XSRF-Token': _csrf,
		},
		credentials: `include`,
		body: JSON.stringify({ longUrl }),
	});
	const { data: { shortUrl } = {} } = await res.json();
	const shortUrlEL = document.createElement(`a`);

	shortUrlEL.classList.add(`short-url`);
	shortUrlEL.target = `_blank`;
	shortUrlEL.href = shortUrl;
	shortUrlEL.textContent = shortUrl;

	shortUrlContainerEl.innerHTML = ``;
	shortUrlContainerEl.appendChild(shortUrlEL);
});
