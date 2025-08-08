// Smooth scrolling with Lenis
const lenis = new Lenis({
  smooth: true,
  lerp: 0.5,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Check if GSAP and plugins are loaded
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.gsap === "undefined")
    document.documentElement.classList.add("gsap-not-found");
});

// Prevent flickering for elements with attributes
// gsap.set("[prevent-flicker], [text-animation]", { visibility: "visible" });

// Après le chargement du Lottie
const lottieContainer = document.querySelector(".burger_icon svg");
if (lottieContainer) {
  lottieContainer.style.color = "currentColor";
  // Pour forcer tous les fills à suivre currentColor
  lottieContainer.querySelectorAll("[fill]").forEach((el) => {
    el.setAttribute("fill", "currentColor");
  });
}
