require("../animations/baits-hero-3d.js")();
require("../animations/circular-slider.js")();
require("../animations/carbon-bg-loop.js")();
require("../animations/lantern-cta-3d.js")();

const scrollCTA = document.querySelector("#hero-scroll-cta");

scrollCTA.setAttribute("href", "");
scrollCTA.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({
    top: window.innerHeight,
    left: 0,
    behavior: "smooth",
  }); // scroll smoothly to 100% viewport height
});
