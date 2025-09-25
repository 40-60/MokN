module.exports = function offerScrollCta() {
  const scrollCTA = document.querySelector("#hero-scroll-cta");

  // Vanilla JS smooth scroll with custom duration
  function smoothScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    function scroll() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (power2.out equivalent)
      const ease = 1 - Math.pow(1 - progress, 2);

      window.scrollTo(0, startY + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    }

    requestAnimationFrame(scroll);
  }

  scrollCTA.setAttribute("href", "");
  scrollCTA.addEventListener("click", (e) => {
    e.preventDefault();
    smoothScrollTo(window.innerHeight, 2000); // 2 seconds smooth scroll
  });
};
