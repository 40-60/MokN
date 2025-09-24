require("../animations/lantern-hero-3d.js")();
require("../animations/lantern-circular-slider.js")();

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
