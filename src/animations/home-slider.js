const lottieWeb = require("lottie-web");

module.exports = function slider() {
  const lottieJsonUrls = [
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68c7d0ea5d9c82b60265d1de_slider_lottie_1.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68c7d0ea1dea2371364d1691_slider_lottie_2.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68c7d0eb5e67b7822166786d_slider_lottie_3.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68c7d0ead0fc7ffcd12ebe96_slider_lottie_4.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68c7d0eb08a0af94ec94894c_slider_lottie_5.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68c7d0eb5521e89cbf81ed27_slider_lottie_6.json",
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
          start: "top center",
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
