require("./animations/text-glow-flicker.js")();
// Smooth scrolling with Lenis
// const lenis = new Lenis({
//   // Valeur entre 0 et 1
//   // Plus la valeur est faible, plus le scroll sera fluide
//   lerp: 0.2,
//   // Plus la valeur est haute, plus le défilement sera rapide
//   wheelMultiplier: 1,
// });

// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }
// requestAnimationFrame(raf);

// Smooth scrolling with GSAP
// const smoother = ScrollSmoother.create({
//   wrapper: ".page-wrapper",
//   content: ".main-wrapper",
//   smooth: 1,
//   smoothTouch: 0.1,
//   effects: true,
//   normalizeScroll: true,
//   ignoreMobileResize: true,
// });

// Check if GSAP and plugins are loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.gsap === "undefined")
    document.documentElement.classList.add("gsap-not-found");
});

// Prevent flickering for elements with attributes
gsap.set("[prevent-flicker], [text-animation]", { visibility: "visible" });
