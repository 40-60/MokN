module.exports = function countUpAnimation() {
  // Fonction utilitaire pour détecter si un élément est dans la vue
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  // Animation de comptage
  function animateCountUp(el, target, easing = "cubic") {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    // Plusieurs fonctions d'easing
    const easings = {
      linear: (t) => t,
      easeOutQuad: (t) => t * (2 - t),
      easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
      easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
      easeOutQuint: (t) => 1 - Math.pow(1 - t, 5),
    };
    const ease = easings[easing] || easings.easeOutCubic;

    function update(now) {
      const rawProgress = Math.min((now - startTime) / duration, 1);
      const progress = ease(rawProgress);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString();
      if (rawProgress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(update);
  }

  // Initialisation sur tous les éléments [count-up]
  const elements = document.querySelectorAll("[count-up]");
  elements.forEach((el) => {
    const target = parseInt(el.textContent, 10);
    el.textContent = "0";
    let animated = false;

    // Permet de choisir l'easing via un attribut data-easing (optionnel)
    const easing = el.getAttribute("data-easing") || "cubic";

    function onScroll() {
      if (!animated && isInViewport(el)) {
        animateCountUp(el, target, easing);
        animated = true;
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll);
    // Vérifie au cas où l'élément est déjà visible au chargement
    onScroll();
  });
};
