const SERVER_URL = "https://academy.directlinedev.com",
			VERSION_API = "1.0.0",
			body = document.querySelector("body"),
			logout = document.querySelector(".logout-js"),
			logoutMenu = document.querySelector(".logout-js--menu"),
			answerPopup = document.querySelector(".answer");

/* --- Login Popup --- */

(() => {
	const open = document.querySelector(".signin-js"),
				window = document.querySelector(".popup--login"),
				form = document.forms["login"],
				openMenu = document.querySelector(".signin-js--menu"),
				windowMenu = document.querySelector(".popup--login");


	if (open) {
		open.addEventListener("click", () => {
			popup(window, open, form);
		})
	}

	if (openMenu) {
		openMenu.addEventListener("click", () => {
			popup(windowMenu, openMenu, form);
		})
	}

	form.addEventListener("submit", (e) => {
		submit(e);
	})

	function submit(e) {
		e.preventDefault();


		const data = getFormData(e.target);
		let errors = validateData(data);

		if (Object.keys(errors).length > 0) {
			setFormErrors(e.target, errors);
		} else {
			sendRequest({
				method: "POST",
				url: "/api/users/login",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			})
			.then(response => response.json())
			.then(response => {
				if (response.success) {
					setFormSuccess(e.target);
					updateToken(response.data);
					updateState();
	
					setTimeout(() => {
						popupClose(window, open, form);
						answer(answerPopup, "Вы успешно вошли", "success");
					}, 2000);
				}
			})
			.catch(err => {
				if (err._message) {
					answer(answerPopup, err._message, "error");
				} else {
					answer(answerPopup, "Ошибка сервера", "error");
				}
			})
		}
	}

	function validateData(data, errors = {}) {
		if(!checkEmail(data.email)) {
			errors.email = "Введите корректный email";
		}
		if(data.password === "" || data.password.length < 4) {
			errors.password = "Длина пароля от 4 символов";
		}
		return errors;
	}
})();

/* --- Register Popup --- */

(() => {
	const open = document.querySelector(".register-js"),
				window = document.querySelector(".popup--register"),
				openMenu = document.querySelector(".register-js--menu"),
				windowMenu = document.querySelector(".popup--register"),
				form = document.forms["register"];

	if (open) {
		open.addEventListener("click", () => {
			popup(window, open, form);
		})
	}

	if (openMenu) {
		openMenu.addEventListener("click", () => {
			popup(windowMenu, openMenu, form);
		})
	}

	form.addEventListener("submit", (e) => {
		submit(e);
	})

	function submit(e) {
		e.preventDefault();

		const body = getFormData(e.target);
		let errors = validateData(body);

		if (Object.keys(errors).length > 0) {
			setFormErrors(e.target, errors);
		} else {
			sendRequest({
				method: "POST",
				url: "/api/users",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json"
				}
			})
			.then (response => {
				return response.json(); })
			.then(response => {
				if (response.success) {
					setFormSuccess(e.target);
					setTimeout(() => {
						popupClose(window, open, form);
						answer(answerPopup, "Пользователь был успешно создан", "success");
					}, 2000);
				} else {
					throw response;
				}
			})
			.catch(err => {
				if (err.errors) {
					setFormErrors(e.target, err.errors);
				} else {
					answer(answerPopup, "Ошибка сервера", "error");
				}
			})
		}
	}

	function validateData(data, errors = {}) {
		if (data.email === "") {
			errors.email = "Введите email";
		}
		if (data.name === "") {
			errors.name = "Введите имя";
		}
		if (data.surname === "") {
			errors.surname = "Введите фамилию";
		}
		if (data.password === "" || data.password.length < 4) {
			errors.password = "Длина пароля от 4 символов";
		}
		if (data.passwordRepeat !== data.password || data.passwordRepeat === "") {
			errors.passwordRepeat = "Повторите пароль корректно";
		}
		if (data.location === "") {
			errors.location = "Введите местоположение";
		}
		if (isNaN(data.age) || data.age === "") {
			errors.age = "Введите возраст";
		}
		return errors;
	}
})();

/* --- Message Popup --- */

(() => {
	const open = document.querySelector(".message-js"),
				window = document.querySelector(".popup--send"),
				form = document.forms["send"];

	if (open) {
		open.addEventListener("click", () => {
			popup(window, open, form);
		})
	}

	form.addEventListener("submit", (e) => {
		submit(e);
	})

	function submit(e) {
		e.preventDefault();

		const body = getFormData(e.target);
		let errors = validateData(body);
		
		if (Object.keys(errors).length > 0) {
			setFormErrors(e.target, errors);
		} else {
			let newData = {
				to: body.to,
				body: JSON.stringify(body)
			}
			sendRequest({
				method: "POST",
				url: "/api/emails",
				body: JSON.stringify(newData),
				headers: {
					"Content-Type": "application/json"
				}
			})
			.then(response => {
				return response.json(); })
			.then(response => {
				if (response.success) {
					setFormSuccess(e.target);
					setTimeout(() => {
						popupClose(window, open, form);
						answer(answerPopup, "Сообщение было успешно отправлено", "success");
					}, 2000);
				} else {
					throw response;
				}
			})
			.catch(err => {
				if (err.errors) {
					setFormErrors(e.target, err.errors);
				} else {
					answer(answerPopup, "Ошибка сервера", "error");
				}
			})
		}
	}

	function validateData(data, errors = {}) {
		if (data.name === "") {
			errors.name = "Пожалуйста, введите своё имя";
		}
		if (data.subject === "") {
			errors.subject = "Пожалуйста, введите тему сообщения";
		}
		if (data.to === "") {
			errors.to = "Пожалуйста, введите ваш email";
		}
		if (!checkTelephone(data.telephone)) {
			errors.telephone = "Пожалуйста, введите валидный номер телефона";
		}
		return errors;
	}
})();

/* --- Mobile Menu --- */

(() => {
  const menu = document.querySelector(".menu"),
				menuOpen = document.querySelector(".menu__open"),
				menuClose = document.querySelector(".menu__close"),
				focusItem = document.querySelector(".focus-js");

  menuOpen.addEventListener("click", () => {
    menu.classList.add("open_js-flex");
    body.classList.add("overflow_js");
    focusItem.focus();
  })

  menuClose.addEventListener("click", () => {
    menu.classList.remove("open_js-flex");
    body.classList.remove("overflow_js");
    menuOpen.focus();
  })

  window.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && menu.classList.contains("open_js-flex")) {
      menu.classList.remove("open_js-flex");
      body.classList.remove("overflow_js");
      menuOpen.focus();
    }
  })
})();

/* --- Scroll Button --- */

(() => {
	const scrollButton = document.querySelector(".scroll-button")

  window.addEventListener("scroll", () => {
    if (window.pageYOffset >= 1500) {
      scrollButton.classList.add("open_js");
    } else {
      scrollButton.classList.remove("open_js");
    }
  })

  scrollButton.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		
  })
})();

/* --- Popup Windows Functional --- */

function popup(popup, button, form) {
	const close = popup.querySelector(".popup__close"),
				focus = popup.querySelector(".popup__input"),
				checkbox = popup.querySelector(".popup__checkbox"),
				submit = popup.querySelector(".popup__button");

	popup.classList.add("open_js");
	body.classList.add("overflow_js");
	focus.focus();

	if (checkbox) {
		checkbox.addEventListener("click", () => {
			if (submit.hasAttribute("disabled")) {
				submit.removeAttribute("disabled");
			} else {
				submit.setAttribute("disabled", "");
			}
		})
	}

	close.addEventListener("click", (e) => {
		e.preventDefault();
		popupClose(popup, button, form);
	})

	window.addEventListener("keydown", (e) => {
		if (e.code === "Escape" && popup.classList.contains("open_js")) {
			popupClose(popup, button, form);
		}
	})
}

function popupClose(popup, button, form) {
	popup.classList.remove("open_js");
	body.classList.remove("overflow_js");
	form.reset();
	clearForm(form);
	button.focus();
}

function answer(popup, text, type) {
	let close = popup.querySelector(".answer__close");
	let textBox = popup.querySelector(".answer__text");

	popup.classList.add("open_js-flex");
	body.classList.add("overflow_js");

	if (textBox.classList.contains("answer__text--success")) {
		textBox.classList.remove("answer__text--success");
	}
	if (textBox.classList.contains("answer__text--error")) {
		textBox.classList.remove("answer__text--error");
	}
	if (type === "success") {
		textBox.classList.add("answer__text--success");
	}
	if (type === "error") {
		textBox.classList.add("answer__text--error");
	}

	textBox.innerText = text;

	close.addEventListener("click", (e) => {
		e.preventDefault();
		popup.classList.remove("open_js-flex");
		body.classList.remove("overflow_js");
	})

	window.addEventListener("keydown", (e) => {
		if (e.code === "Escape" && popup.classList.contains("open_js-flex")) {
			popup.classList.remove("open_js-flex");
			body.classList.remove("overflow_js");
		}
	})
}

/* --- Slider --- */

function slider({ sliderEl, defaultActiveSlide = +localStorage.getItem("activeSlide") || 0 }) {
  const slider = document.querySelector(sliderEl),
				wrapper = slider.querySelector(".slider__wrapper"),
				innerWrapper = slider.querySelector(".slider__inner-wrapper"),
				slides = [...slider.querySelectorAll(".slider__slide")],
				pagination = slider.querySelector(".pagination"),
				buttonBack = slider.querySelector(".slider__button--prev"),
				buttonNext = slider.querySelector(".slider__button--next"),
				aniTime = 500;

  let activeSlide = defaultActiveSlide,
			slideWidth = 0,
			dots = [],
			timerId = null;

  initSlidesWidth();
  createPagination();
  setActiveSlide(activeSlide, false);

  window.addEventListener("resize", () => {
    initSlidesWidth();
    setActiveSlide(activeSlide, false);
  })

  function addAnimation(duration) {
    clearTimeout(timerId);
		innerWrapper.style.transition = `transform ${duration}ms`;
		
    timerId = setTimeout(() => {
      innerWrapper.style.transition = ``;
    }, duration);
  }

  function createPagination() {
    for (let i = 0; i < slides.length; i++) {
      let dot = createDot(i);
      pagination.insertAdjacentElement("beforeend", dot);
      dots.push(dot);
    }
  }

  function createDot(index) {
    let dot = document.createElement("button");
		dot.classList.add("pagination__button");
		dot.setAttribute("aria-label", `Slide number ${index + 1}`)

    if (index === activeSlide) {
      dot.classList.add("pagination__button--active");
		}
		
    dot.addEventListener("click", () => {
      setActiveSlide(index);
		})
		
    return dot;
  }

  function initSlidesWidth() {
		slideWidth = wrapper.clientWidth;
		
    slides.forEach((slide) => {
      slide.style.width = `${slideWidth}px`;
    })
  }

  function setActiveSlide(index = 0, playAnimation = true) {
    if (index < 0 || index >= slides.length) {
      return;
    }
    if (playAnimation) {
      addAnimation(aniTime);
		}
		
    dots[activeSlide].classList.remove("pagination__button--active");
		dots[index].classList.add("pagination__button--active");
		
    if (index === 0) {
      buttonBack.setAttribute("disabled", "");
    } else {
      buttonBack.removeAttribute("disabled");
    }
    if (index === slides.length - 1) {
      buttonNext.setAttribute("disabled", "");
    } else {
      buttonNext.removeAttribute("disabled");
		}
		
    innerWrapper.style.transform = `translateX(-${slideWidth * index}px)`;
		activeSlide = index;
		localStorage.setItem("activeSlide", activeSlide);
  }

  buttonBack.addEventListener("click", () => {
    setActiveSlide(activeSlide - 1);
  })

  buttonNext.addEventListener("click", () => {
    setActiveSlide(activeSlide + 1);
  })
}

/* --- Validation --- */

function checkEmail(email) {
	return email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
}

function checkTelephone(telephone) {
	return telephone.match(/^(\s*)?(\+)?([-_():=+]?\d[- _():=+]?){10,14}(\s*)?$/);
}

function inputError(input) {
	if (input.hasAttribute("Error")) {
		return;
	}
	
	input.setAttribute("Error", "");
	input.classList.add("popup__input--error");

	input.addEventListener("input", () => {
		input.classList.remove("popup__input--error");
		input.removeAttribute("Error");
	})
}

function inputSuccess(input) {
	if (input.hasAttribute("Success")) {
		return;
	}

	input.setAttribute("Success", "");
	input.classList.add("popup__input--success");

	input.addEventListener("input", () => {
		input.classList.remove("popup__input--success");
		input.removeAttribute("Success");
	})
}

function textSuccess(input) {
	if (input.hasAttribute("SuccessText")) {
		return;
	}

	input.setAttribute("SuccessText", "");
	const message = document.createElement('span');
	message.classList.add('popup__text--success');
	message.innerText = "Успешно";
	input.insertAdjacentElement("afterend", message);

	input.addEventListener("input", () => {
		message.remove();
		input.removeAttribute("successText");
	})
}

function textError(input, error) {
	if (input.hasAttribute("ErrorText")) {
		return;
	}

	input.setAttribute("ErrorText", "");
	const message = document.createElement('span');
	message.classList.add('popup__text--error');
	message.innerText = error;
	input.insertAdjacentElement("afterend", message);

	input.addEventListener("input", () => {
		message.remove();
		input.removeAttribute("ErrorText");
	})
}

function setFormErrors(form, errors) {
	let inputs = form.querySelectorAll("input");

	for (let input of inputs) {
		if (errors[input.name] && input.type !== "checkbox" && input.type !== "radio") {
			inputError(input);
			textError(input, errors[input.name]);
		}
	}
}

function setFormSuccess(form) {
	let inputs = form.querySelectorAll("input");

	for (let input of inputs) {
		if (input.type !== "checkbox" && input.type !== "radio") {
			inputSuccess(input);
			textSuccess(input);
		}
	}
}

function clearInput(input) {
	if (input.hasAttribute("Error")) {
		input.classList.remove("popup__input--error");
		input.removeAttribute("Error");
		input.removeAttribute("ErrorText");
	} else {
		input.classList.remove("popup__input--success");
		input.removeAttribute("Success");
		input.removeAttribute("SuccessText");
	}
}

function clearText(form) {
	let messages = [...form.querySelectorAll(".popup__text--error")].concat([...form.querySelectorAll(".popup__text--success")]);

	for (let message of messages) {
		message.remove();
	}
}

function clearForm(form) {
	let inputs = form.querySelectorAll("input");

	for (let input of inputs) {
		clearInput(input);
	}

	clearText(form);
}

function getFormData(form, data = {}, type = "json") {
	if (type === "json") {
		let inputs = form.querySelectorAll("input");

		for (let input of inputs) {
			switch (input.type) {
				case "radio":
					if (input.checked) {
						data[input.name] = input.value;
					}
					break;
				case "checkbox":
					if (!data[input.name]) {
						data[input.name] = [];
					}
					if (input.checked) {
						data[input.name].push(input.value);
					}
					break;
				case "file":
					data[input.name] = input.files;
					break;
				default:
					data[input.name] = input.value;
					break;
			}
		}

		let textareas = form.querySelectorAll("textarea");

		for (let textarea of textareas) {
			data[textarea.name] = textarea.value;
		}

		return data;
	} else {
		return new FormData(form);
	}
}

function setValueToForm(form, data) {
	let inputs = form.querySelectorAll("input");

	for (let input of inputs) {
		switch(input.type) {
			case "radio":
				if (data[input.name] === input.value) {
					input.checked = true;
				}
				break;
			case "checkbox":
				if (data[input.name] && data[input.name].includes(input.value)) {
					input.checked = true;
				}
				break;
			default:
				if (data[input.name]) {
					input.value = data[input.name];
				}
				break;
		}
	}
	return data;
}

/* --- Other --- */

function sendRequest({ method = "GET", url = "", headers = {}, body = null }) {
	return fetch(SERVER_URL + url, {
		method,
		body,
		headers
	})
}

// function sendRequest({ method = "GET", url, headers = null, body = null }) {
// 	const settings = {
// 		method,
// 		headers,
// 		body
// 	}

// 	return fetch(`${SERVER_URL}${url}`, settings)
// }

function updateToken({ token, userId }) {
	localStorage.setItem("token", token)
	localStorage.setItem("userId", userId)
}

function updateState() {
	const login = document.querySelector(".signin-js"),
				register = document.querySelector(".register-js"),
				profile = document.querySelector(".profile-js"),
				loginMenu = document.querySelector(".signin-js--menu"),
				registerMenu = document.querySelector(".register-js--menu"),
				profileMenu = document.querySelector(".profile-js--menu");

	if (localStorage.getItem("token")) {
		login.classList.add("hide_js");
		register.classList.add("hide_js");
		profile.classList.remove("hide_js");
		logout.classList.remove("hide_js");

		loginMenu.classList.add("hide_js");
		registerMenu.classList.add("hide_js");
		profileMenu.classList.remove("hide_js");
		logoutMenu.classList.remove("hide_js");
	} else {
		login.classList.remove("hide_js");
		register.classList.remove("hide_js");
		profile.classList.add("hide_js");
		logout.classList.add("hide_js");

		loginMenu.classList.remove("hide_js");
		registerMenu.classList.remove("hide_js");
		profileMenu.classList.add("hide_js");
		logoutMenu.classList.add("hide_js");
	}
}

updateState();

logout.addEventListener("click", () => {
	answer(answerPopup, "Вы успешно вышли", "success");

	setTimeout(() => {
		logoutUser();
	}, 2000)
})

logoutMenu.addEventListener("click", () => {
	answer(answerPopup, "Вы успешно вышли", "success");

	setTimeout(() => {
		logoutUser();
	}, 2000)
})

function logoutUser() {
	localStorage.removeItem("token");
	localStorage.removeItem("userId");
	return window.location = "/";
}

function spinnerCreator() {
	return `<div class="spinner">Loading...</div>`;
}