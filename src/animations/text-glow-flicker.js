module.exports = function textGlow() {
  // Neon flickering effect for text glow elements
  function createNeonFlicker() {
    const splitWords = document.querySelectorAll(
      ".text-glow-white .gsap_split_word"
    );

    if (splitWords.length === 0) {
      console.log(
        "Aucun élément .gsap_split_word dans .text-glow-white trouvé"
      );
      return;
    }

    console.log(
      `Effet de scintillement appliqué à ${splitWords.length} mot(s)`
    );

    gsap.set(splitWords, { opacity: 1 });

    splitWords.forEach((element) => {
      // Function to create a random flicker sequence
      const flicker = () => {
        // Random delay before next flicker (between 2-8 seconds)
        const nextFlickerDelay = gsap.utils.random(2, 8);

        // Create flicker timeline
        const tl = gsap.timeline();

        // Quick flickers with random timing
        tl.to(element, {
          opacity: 0.9,
          duration: 0.05,
          ease: "power2.inOut",
        })
          .to(element, {
            opacity: 1,
            duration: 0.05,
            ease: "power2.inOut",
          })
          .to(element, {
            opacity: 0.9,
            duration: 0.03,
            ease: "power2.inOut",
          })
          .to(element, {
            opacity: 1,
            duration: 0.08,
            ease: "power2.inOut",
          });

        // Sometimes add an extra flicker
        if (Math.random() > 0.5) {
          tl.to(element, {
            opacity: 0.8,
            duration: 0.04,
            ease: "power2.inOut",
          }).to(element, {
            opacity: 1,
            duration: 0.06,
            ease: "power2.inOut",
          });
        }

        // Schedule next flicker
        gsap.delayedCall(nextFlickerDelay, flicker);
      };

      // Start flickering with random initial delay
      gsap.delayedCall(gsap.utils.random(0.5, 3), flicker);
    });
  }

  // Initialize neon flicker effect when DOM and GSAP are ready
  function initializeFlicker() {
    if (typeof gsap !== "undefined") {
      createNeonFlicker();
    } else {
      // Retry after a short delay if GSAP isn't loaded yet
      setTimeout(initializeFlicker, 100);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Wait for all elements to be rendered
    setTimeout(initializeFlicker, 500);
  });

  // Also try when window loads (as backup)
  window.addEventListener("load", () => {
    setTimeout(initializeFlicker, 100);
  });
};
