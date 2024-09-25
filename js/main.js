const main_div = document.querySelector("main");
const nav_div = document.querySelector("header ul");
const footerp = document.querySelector("#ft-version");
let config = null;

function app_template(name, img_src, img_alt) {
	return `
    <div class="app" id="${name}">
        <img src="${img_src}" alt="${img_alt}">
        <p>${name}</p>
    </div>
`;
}

function nav_template(name, img_url) {
	return `
        <li id="li_${name.toLowerCase()}">
			<img src="${img_url}" alt="${name} icon" onerror="this.remove();">
			<span class="text">${name}</span>
		</li>
    `;
}

function load_app(app_name, app_url) {
	let frame_exists = false;
	const iframes = document.querySelectorAll("iframe");
	// biome-ignore lint/complexity/noForEach: <explanation>
	iframes.forEach((el) => {
		el.classList.add("invisible");
	});

	for (let i = 0; i < iframes.length; i++) {
		const id = iframes[i].id.replace("if_", "");
		if (id === app_name.toLowerCase()) {
			frame_exists = true;
		}
	}

	if (!frame_exists) {
		main_div.innerHTML += `
        <iframe src="${app_url}" id="if_${app_name.toLowerCase()}"></iframe>
    `;
	}

	if (frame_exists) {
		document
			.querySelector(`#if_${app_name.toLowerCase()}`)
			.classList.remove("invisible");
	}

	if (document.querySelector(".active")) {
		document.querySelector(".active").classList.remove("active");
	}

	document
		.querySelector(`#li_${app_name.toLowerCase()}`)
		.classList.add("active");
}

async function main() {
	const req = await fetch("/config.json");
	config = await req.json();
	const reqVer = await fetch("/version");
	const version = await reqVer.text();

	/** Options part **/
	if (config.options) {
		/* Footer script */
		if (config.options.footertext) {
			footerp.innerHTML = config.options.footertext;
		} else {
			// print correct version
			footerp.innerHTML = footerp.innerHTML.replace("v0.0.0", version);
		}
		// hide footer if requested
		if (config.options.footer === false) {
			document.querySelector("footer").style.display = "none";
		}

		/* change title */
		if (config.options.title) {
			document.title = config.options.title;
		}
	} else {
		// print correct version
		footerp.innerHTML = footerp.innerHTML.replace("v0.0.0", version);
	}

	/* main part */
	for (let i = 0; i < config.apps.length; i++) {
		const app = config.apps[i];
		main_div.innerHTML += app_template(
			app.name,
			`/img/${app.img}`,
			`${app.name} logo`,
		);

		nav_div.innerHTML += nav_template(app.name, `/img/${app.img}`);

		setTimeout(() => {
			const app_div = document.querySelector(`#${app.name}`);
			app_div.addEventListener("click", () => {
				main_div.innerHTML = "";
				load_app(app.name, app.url);
				document.querySelector("header").classList.remove("invisible");
				main_div.classList.remove("home");
				document.querySelector("footer").style.display = "none";
			});

			const li = document.querySelector(`#li_${app.name.toLowerCase()}`);
			li.addEventListener("click", () => {
				load_app(app.name, app.url);
				document.querySelector("header").classList.remove("invisible");
				document.querySelector("footer").style.display = "none";
			});
		}, 0);
	}
}
main();
