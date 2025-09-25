const lottieWeb = require("lottie-web");

module.exports = function slider() {
  const lottieJsonUrls = [
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68c7d0ea5d9c82b60265d1de_372388cd1820a7f9c78363fae14d9723_slider_lottie_1.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68d50d60ce9ad94d64729620_Sequence%202%20No%20Background.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68d50d607c17dbe15ce62fee_Sequence%203%20No%20Background.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68d50d602c0beae04485c303_Sequence%204%20No%20Background.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68d50d60e1020e881aa559d1_Sequence%205%20No%20Background.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68d50d60e6999dbba0150f57_Sequence%206%20No%20Background.json"
  ];

  const lottieWrapper = document.querySelector(".slider_lottie_wrapper");
  const sliderH2 = document.querySelectorAll("[slider-h2]");
  const prevSlide = document.querySelector("[slider-prev]");
  const nextSlide = document.querySelector("[slider-next]");
  const dots = document
    .querySelector(".section_home_slider")
    .querySelectorAll(".slider-dot");

  let step = 0;
  lottieWrapper.innerHTML = "";
  const lottieContainers = [];
  const lottieInstances = [];

  // Helper: update H2 classes
  function updateH2Classes(current, next) {
    sliderH2[current].classList.remove("is-active");
    sliderH2[current].classList.add("is-done");
    sliderH2[next].classList.add("is-active");
  }

  // Helper: update dot classes
  function updateDotClasses(current, next) {
    if (dots && dots.length) {
      dots[current].classList.remove("is-active");
      dots[next].classList.add("is-active");
    }
  }

  // Helper: update lottie containers
  function updateLottieContainers(current, next) {
    lottieContainers[current].classList.add("hide");
    lottieContainers[next].classList.remove("hide");
  }

  // Helper: play lottie
  function playLottie(idx) {
    if (
      lottieInstances[idx] &&
      typeof lottieInstances[idx].goToAndPlay === "function"
    ) {
      lottieInstances[idx].goToAndPlay(0, true);
    }
  }

  // Preload lotties
  lottieJsonUrls.forEach((url, i) => {
    const container = document.createElement("div");
    container.classList.add("slider_lottie");
    if (i !== 0) container.classList.add("hide");
    container.style.width = "100%";
    container.style.height = "100%";
    lottieWrapper.appendChild(container);
    const instance = lottieWeb.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: url,
    });
    lottieContainers.push(container);
    lottieInstances.push(instance);
  });

  // Play the first lottie when lottieWrapper top is at center of viewport
  if (lottieInstances[0] && typeof gsap !== "undefined") {
    gsap.registerPlugin(
      gsap.plugins && gsap.plugins.ScrollTrigger
        ? gsap.plugins.ScrollTrigger
        : window.ScrollTrigger
    );
    gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: lottieWrapper,
          start: "top 70%",
          once: true,
          onEnter: () => playLottie(0),
        },
      }
    );
  }

  // Init H2 classes
  sliderH2.forEach((el, i) => {
    el.classList.remove("is-active", "is-done");
    if (i === 0) el.classList.add("is-active");
  });

  nextSlide.addEventListener("click", () => {
    if (step >= lottieJsonUrls.length - 1) return;
    updateH2Classes(step, step + 1);
    updateLottieContainers(step, step + 1);
    updateDotClasses(step, step + 1);
    step++;
    playLottie(step);
    nextSlide.classList.toggle(
      "is-disabled",
      step >= lottieJsonUrls.length - 1
    );
    prevSlide.classList.remove("is-disabled");
  });

  prevSlide.addEventListener("click", () => {
    if (step <= 0) return;
    lottieWrapper.classList.add("opacity-0");
    setTimeout(() => {
      sliderH2[step].classList.remove("is-active", "is-done");
      sliderH2[step - 1].classList.remove("is-done");
      sliderH2[step - 1].classList.add("is-active");
      updateLottieContainers(step, step - 1);
      updateDotClasses(step, step - 1);
      step--;
      lottieWrapper.classList.remove("opacity-0");
      prevSlide.classList.toggle("is-disabled", step <= 0);
      nextSlide.classList.remove("is-disabled");
    }, 200);
  });
};
