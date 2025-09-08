const lottieWeb = require("lottie-web");

module.exports = function slider() {
  const lottieWrapper = document.querySelector(".slider_lottie_wrapper");
  const sliderH2Wrapper = document.querySelector(".slider_h2_wrapper");
  const sliderH2 = document.querySelectorAll("[slider-h2]");
  const prevSlide = document.querySelector("[slider-prev]");
  const nextSlide = document.querySelector("[slider-next]");
  const lottieJsonUrls = [
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68b83f8e6e2ef58c60c08fde_Lottielab%20Chart%20Home%20Page.json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68b83f8e48f9a4b6ff16372a_Card%20Solo%20(1).json",
    "https://cdn.prod.website-files.com/68946a7f9dd4e558382abd0f/68b83f8d19c71c65d7ba9ac7_Card%20Stack%20Home%20(2).json",
  ];
  let step = 0;
  let lottieInstance = null;

  function showLottie(index, options = {}) {
    // Remove previous animation
    lottieWrapper.innerHTML = "";
    // Create a new container for Lottie
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";
    lottieWrapper.appendChild(container);
    // Load the animation
    lottieInstance = lottieWeb.loadAnimation({
      container: container,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: lottieJsonUrls[index],
    });
    lottieInstance.addEventListener("DOMLoaded", function () {
      if (options.reverse) {
        lottieInstance.setDirection(-1);
        lottieInstance.goToAndPlay(lottieInstance.totalFrames, true);
        lottieInstance.addEventListener("complete", function handler() {
          // Après reverse, afficher le précédent à la dernière frame sans animation
          lottieInstance.removeEventListener("complete", handler);
          showLottie(index - 1, { showLastFrame: true });
        });
      } else if (options.showLastFrame) {
        lottieInstance.goToAndStop(lottieInstance.totalFrames, true);
      } else {
        lottieInstance.setDirection(1);
        lottieInstance.goToAndPlay(0, true);
      }
    });
  }

  // Show the first Lottie on load
  showLottie(step);

  sliderH2Wrapper.style.height = sliderH2[0].offsetHeight + "px";

  document.addEventListener("resize", () => {
    sliderH2Wrapper.style.height = sliderH2[step].offsetHeight + "px";
  });

  sliderH2.forEach((el, i) => {
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    el.style.position = "absolute";

    if (i === 0) return; // skip the first element
    el.style.opacity = 0;
    el.style.transform = "translateY(100%)";
  });

  nextSlide.addEventListener("click", () => {
    sliderH2[step].style.opacity = 0;
    sliderH2[step].style.transform = "translateY(-100%)";
    sliderH2[step + 1].style.opacity = 1;
    sliderH2[step + 1].style.transform = "translateY(0)";
    step++;
    if (step >= lottieJsonUrls.length) {
      nextSlide.classList.toggle("is-disabled");
      return;
    }
    showLottie(step);
  });

  prevSlide.addEventListener("click", () => {
    sliderH2[step].style.opacity = 0;
    sliderH2[step].style.transform = "translateY(100%)";
    sliderH2[step - 1].style.opacity = 1;
    sliderH2[step - 1].style.transform = "translateY(0)";
    // On joue le lottie actuel en reverse, puis on affiche le précédent à la dernière frame
    showLottie(step, { reverse: true });
    step--;
    if (step <= 0) {
      prevSlide.classList.toggle("is-disabled");
      return;
    }
  });
};
