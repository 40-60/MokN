// === Import des animations globales ===
require("../animations/custom-cursor.js")();
require("../animations/line-highlight.js")();
require("../animations/images-parallax.js")();

// === Sélection des éléments principaux ===
const viewportHeight = window.innerHeight;
const video = document.querySelector(".home_hero_video");
const heading1 = document.querySelector("#heading-h1-1");
const headingCorailWrapper = document.querySelector(".heading_corail_wrapper");
const heroVideo = document.querySelector(".home_hero_video");
const scrollText = document.querySelector("#scroll-text");

const start = Date.now();

const interval = setInterval(() => {
  document.documentElement.scrollTop = 0; // Chrome, Firefox, etc.
  document.body.scrollTop = 0; // Safari fallback

  if (Date.now() - start > 3000) {
    clearInterval(interval);
  }
}, 10); // every 10ms (adjust if needed)

// Sécurité : stoppe si un élément clé manque
if (!video || !heading1 || !headingCorailWrapper) {
  console.error("Missing one or more required elements");
  return;
}

// === Préparation du layout ===
headingCorailWrapper.style.overflow = "hidden";
heroVideo.style.height = "0vh";
// heading1.style.height = "9vw";

// === Animation d'entrée du heading1 ===
const splitHeading1 = SplitText.create(heading1, {
  type: "words, chars",
  mask: "words",
  wordsClass: "word",
  charsClass: "char",
});
gsap.set(splitHeading1.chars, { opacity: 0 });

const tlHeading1 = gsap.timeline();
tlHeading1.to(splitHeading1.chars, {
  opacity: 1,
  duration: 1,
  ease: "power1.out",
  stagger: { amount: 0.8 },
});
gsap.from(splitHeading1.words, {
  yPercent: 110,
  delay: 0.2,
  duration: 0.8,
  stagger: { amount: 0.5 },
  ease: "power3.out",
});

// === Animation d'entrée du premier .heading-style-display_hero dans headingCorailWrapper ===
const firstHeroHeading = headingCorailWrapper.querySelector(
  ".heading-style-display_hero"
);
if (firstHeroHeading) {
  const splitHero = SplitText.create(firstHeroHeading, {
    type: "words, chars",
    mask: "words",
    wordsClass: "word",
    charsClass: "char",
  });
  gsap.set(splitHero.chars, { opacity: 0 });
  gsap.to(splitHero.chars, {
    opacity: 1,
    duration: 1,
    ease: "power1.out",
    stagger: { amount: 0.8 },
  });
  gsap.from(splitHero.words, {
    yPercent: 110,
    delay: 0.2,
    duration: 0.8,
    stagger: { amount: 0.5 },
    ease: "power3.out",
  });
}

// === Animation scale/translate des éléments principaux ===
const commonAnimationSettings = {
  duration: 1.3,
  ease: "power3.inOut",
};

tlHeading1.fromTo(
  heading1,
  { scale: 0.5 },
  { scale: 1, ...commonAnimationSettings },
  1
);
tlHeading1.fromTo(
  headingCorailWrapper,
  { height: 0 },
  {
    height: () => (window.innerWidth <= 767 ? "12vw" : "9vw"),
    ...commonAnimationSettings,
    onComplete: () => {
      headingCorailWrapper.style.height =
        window.innerWidth <= 767 ? "12vw" : "9vw";
    },
  },
  1
);
tlHeading1.fromTo(
  ".home_hero_video",
  { height: "0vh" },
  { height: "30vh", duration: 1.8, ease: "power3.inOut" },

  2.1
);

// === Fade in du scroll-text ===
if (scrollText) {
  gsap.set(scrollText, { opacity: 0 });
  tlHeading1.to(
    scrollText,
    { opacity: 1, duration: 1.3, ease: "power3.inOut" },
    1
  );
}

// === ScrollTrigger : animations déclenchées après 3.3s ===
const scrollTriggerSettings = {
  trigger: ".section_home_hero",
  start: "top top",
  end: () => `bottom-=${viewportHeight} bottom`,
  scrub: true,
};

setTimeout(() => {
  document.body.classList.remove("no-scroll");

  gsap.fromTo(
    ".home_hero_video",
    { borderRadius: "30rem" },
    { borderRadius: "1.5rem", scrollTrigger: scrollTriggerSettings }
  );
  gsap.fromTo(
    ".home_hero_video",
    { height: "30vh" },
    { height: "90vh", scrollTrigger: scrollTriggerSettings }
  );
  gsap.fromTo(
    [heading1, headingCorailWrapper, scrollText],
    { opacity: 1 },
    {
      opacity: 0,
      scrollTrigger: {
        trigger: ".section_home_hero",
        start: "top top",
        end: "40% bottom",
        scrub: true,
      },
    }
  );
  gsap.to(
    [heading1, headingCorailWrapper],
    // { height: "9vw" },
    {
      height: "0vw",
      scrollTrigger: {
        trigger: ".section_home_hero",
        start: "40% bottom",
        end: "41% bottom",
        scrub: true,
      },
    }
  );
  gsap.fromTo(
    ".home_mask",
    { yPercent: 50, scaleY: 0 },
    {
      yPercent: 50,
      scaleY: 8,
      ease: "none",
      scrollTrigger: {
        trigger: "#round-shape-trigger",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
}, 3500);

// === Carrousel de headings ===
const headings = document.querySelectorAll(
  ".heading-style-display_hero.text-color-corail"
);
let currentStep = 0;
const totalSteps = 3; // nombre de "slides" avant de reset
const delayBetween = 2; // en secondes (1s anim + 1s pause)

function animateStep() {
  currentStep++;
  if (currentStep > totalSteps) {
    gsap.set(headings, { yPercent: 0 });
    currentStep = 1;
  }
  headings.forEach((el) => {
    gsap.to(el, {
      yPercent: -100 * currentStep,
      duration: 0.8,
      ease: "power3.inOut",
    });
  });
}

// Démarre le carrousel
animateStep();
setTimeout(() => {
  setInterval(animateStep, delayBetween * 1000);
}, 100);

function initGlowingInteractiveDotsGrid() {
  document
    .querySelectorAll("[data-dots-container-init]")
    .forEach((container) => {
      const colors = { base: "#ffffff00", active: "#FF4D64" };
      const threshold = 200;
      const speedThreshold = 100;
      const shockRadius = 325;
      const shockPower = 5;
      const maxSpeed = 5000;
      const centerHole = false; // removed the hole

      let dots = [];
      let dotCenters = [];

      function buildGrid() {
        container.innerHTML = "";
        dots = [];
        dotCenters = [];

        const style = getComputedStyle(container);
        const dotPx = 14;
        const gapPx = dotPx * 1;
        console.log("dotPx : ", dotPx);
        const contW = container.clientWidth;
        const contH = container.clientHeight;

        const cols = Math.floor((contW + gapPx) / (dotPx + gapPx));
        const rows = Math.floor((contH + gapPx) / (dotPx + gapPx) + 30);
        const total = cols * rows;

        // Remove hole logic
        for (let i = 0; i < total; i++) {
          const row = Math.floor(i / cols);
          const col = i % cols;
          // No hole
          const d = document.createElement("div");
          d.classList.add("dot");
          gsap.set(d, { x: 0, y: 0, backgroundColor: colors.base });
          d._inertiaApplied = false;
          container.appendChild(d);
          dots.push(d);
        }

        requestAnimationFrame(() => {
          dotCenters = dots.map((d) => {
            const r = d.getBoundingClientRect();
            return {
              el: d,
              x: r.left + window.scrollX + r.width / 2,
              y: r.top + window.scrollY + r.height / 2,
            };
          });
        });
      }

      window.addEventListener("resize", buildGrid);
      buildGrid();

      let lastTime = 0,
        lastX = 0,
        lastY = 0;

      window.addEventListener("mousemove", (e) => {
        const now = performance.now();
        const dt = now - lastTime || 16;
        let dx = e.pageX - lastX;
        let dy = e.pageY - lastY;
        let vx = (dx / dt) * 1000;
        let vy = (dy / dt) * 1000;
        let speed = Math.hypot(vx, vy);

        if (speed > maxSpeed) {
          const scale = maxSpeed / speed;
          vx *= scale;
          vy *= scale;
          speed = maxSpeed;
        }

        lastTime = now;
        lastX = e.pageX;
        lastY = e.pageY;

        requestAnimationFrame(() => {
          dotCenters.forEach(({ el, x, y }) => {
            const dist = Math.hypot(x - e.pageX, y - e.pageY);
            const t = Math.max(0, 1 - dist / threshold);
            const col = gsap.utils.interpolate(colors.base, colors.active, t);
            gsap.set(el, { backgroundColor: col });

            if (
              speed > speedThreshold &&
              dist < threshold &&
              !el._inertiaApplied
            ) {
              el._inertiaApplied = true;
              const pushX = x - e.pageX + vx * 0.005;
              const pushY = y - e.pageY + vy * 0.005;

              gsap.to(el, {
                inertia: { x: pushX, y: pushY, resistance: 750 },
                onComplete() {
                  gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 1.5,
                    ease: "elastic.out(1,0.75)",
                  });
                  el._inertiaApplied = false;
                },
              });
            }
          });
        });
      });

      window.addEventListener("click", (e) => {
        dotCenters.forEach(({ el, x, y }) => {
          const dist = Math.hypot(x - e.pageX, y - e.pageY);
          if (dist < shockRadius && !el._inertiaApplied) {
            el._inertiaApplied = true;
            const falloff = Math.max(0, 1 - dist / shockRadius);
            const pushX = (x - e.pageX) * shockPower * falloff;
            const pushY = (y - e.pageY) * shockPower * falloff;

            gsap.to(el, {
              inertia: { x: pushX, y: pushY, resistance: 750 },
              onComplete() {
                gsap.to(el, {
                  x: 0,
                  y: 0,
                  duration: 1.5,
                  ease: "elastic.out(1,0.75)",
                });
                el._inertiaApplied = false;
              },
            });
          }
        });
      });
    });
}

// Initialize Glowing Interactive Dots Grid
document.addEventListener("DOMContentLoaded", function () {
  initGlowingInteractiveDotsGrid();
});
