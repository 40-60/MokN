const valuesP = document.querySelectorAll(".values_p");

valuesP.forEach((p) => {
  p.style.position = "absolute";
});

// Text highlight animation setup function
function setupTextHighlightAnimation() {
  // Check if GSAP is available
  if (typeof gsap === "undefined") {
    return;
  }

  const textElements = document.querySelectorAll("[auto-text-highlight]");

  textElements.forEach((element) => {
    const text = element.textContent;

    // Split text into individual letters wrapped in spans
    const letters = text
      .split("")
      .map((letter) => {
        // Preserve spaces
        if (letter === " ") {
          return '<span class="letter"> </span>';
        }
        return `<span class="letter">${letter}</span>`;
      })
      .join("");

    // Replace element content with wrapped letters
    element.innerHTML = letters;

    // Get all letter spans within this element
    const letterSpans = element.querySelectorAll(".letter");

    // Set initial opacity to 0.4
    gsap.set(letterSpans, { opacity: 0.4 });
  });
}

// Function to start the text highlight animation
function startTextHighlightAnimation() {
  if (typeof gsap === "undefined") {
    return;
  }

  const textElements = document.querySelectorAll("[auto-text-highlight]");

  textElements.forEach((element) => {
    const letterSpans = element.querySelectorAll(".letter");

    if (letterSpans.length > 0) {
      // Animate to opacity 1 with stagger - faster animation
      gsap.to(letterSpans, {
        opacity: 1,
        duration: 0.3,
        stagger: 0.01,
        ease: "power2.out",
      });
    }
  });
}

// Initialize text highlight setup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupTextHighlightAnimation();
});

const easterEggsTrigger = document.querySelectorAll(".easter_egg_trigger");
const content1 = document.querySelector("#easter_egg_content_1");
const content2 = document.querySelector("#easter_egg_content_2");

easterEggsTrigger.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    trigger.querySelector(".easter_egg_dot").classList.add("is-active");
    // Check if all dots have is-active
    const allActive = Array.from(
      document.querySelectorAll(".easter_egg_dot")
    ).every((dot) => dot.classList.contains("is-active"));
    if (allActive) {
      content1.classList.add("opacity-0");
      content2.classList.remove("opacity-0");

      // Wait a bit for content2 to be visible, then setup and start animation
      setTimeout(() => {
        setupTextHighlightAnimation();
        startTextHighlightAnimation();
      }, 50);
    }
  });
});
