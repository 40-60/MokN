module.exports = function slider() {
  const videoUrls = [
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/slider/sequence-1-1080.mp4",
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/slider/sequence-2-1080.mp4",
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/slider/sequence-3-1080.mp4",
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/slider/sequence-4-1080.mp4",
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/slider/sequence-5-1080.mp4",
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/slider/sequence-6-1080.mp4",
  ];

  const videoWrapper = document.querySelector(".slider_lottie_wrapper");
  const sliderH2 = document.querySelectorAll("[slider-h2]");
  const prevSlide = document.querySelector("[slider-prev]");
  const nextSlide = document.querySelector("[slider-next]");
  const dots = document
    .querySelector(".section_home_slider")
    .querySelectorAll(".slider-dot");

  let step = 0;
  videoWrapper.innerHTML = "";
  const videoContainers = [];
  const videoElements = [];

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

  // Helper: update video containers
  function updateVideoContainers(current, next) {
    videoContainers[current].classList.add("hide");
    videoContainers[next].classList.remove("hide");
  }

  // Helper: play video
  function playVideo(idx) {
    if (videoElements[idx]) {
      videoElements[idx].currentTime = 0;
      videoElements[idx].play();
    }
  }

  // Preload videos
  videoUrls.forEach((url, i) => {
    const container = document.createElement("div");
    container.classList.add("slider_lottie");
    if (i !== 0) container.classList.add("hide");
    container.style.width = "100%";
    container.style.height = "100%";

    const video = document.createElement("video");
    video.src = url;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "contain";
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    container.appendChild(video);
    videoWrapper.appendChild(container);

    videoContainers.push(container);
    videoElements.push(video);
  });

  // Play the first video when videoWrapper top is at center of viewport
  if (videoElements[0] && typeof gsap !== "undefined") {
    gsap.registerPlugin(
      gsap.plugins && gsap.plugins.ScrollTrigger
        ? gsap.plugins.ScrollTrigger
        : window.ScrollTrigger
    );
    gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: videoWrapper,
          start: "top 70%",
          once: true,
          onEnter: () => playVideo(0),
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
    if (step >= videoUrls.length - 1) return;
    updateH2Classes(step, step + 1);
    updateVideoContainers(step, step + 1);
    updateDotClasses(step, step + 1);
    step++;
    playVideo(step);
    nextSlide.classList.toggle("is-disabled", step >= videoUrls.length - 1);
    prevSlide.classList.remove("is-disabled");
  });

  prevSlide.addEventListener("click", () => {
    if (step <= 0) return;
    videoWrapper.classList.add("opacity-0");
    setTimeout(() => {
      sliderH2[step].classList.remove("is-active", "is-done");
      sliderH2[step - 1].classList.remove("is-done");
      sliderH2[step - 1].classList.add("is-active");
      updateVideoContainers(step, step - 1);
      updateDotClasses(step, step - 1);
      step--;
      videoWrapper.classList.remove("opacity-0");
      prevSlide.classList.toggle("is-disabled", step <= 0);
      nextSlide.classList.remove("is-disabled");
    }, 200);
  });
};
