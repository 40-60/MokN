require("../animations/home-slider.js")();
require("../animations/home-svg-path.js")();

let frameCount = 399,
  urls = new Array(frameCount).fill().map((o, i) => {
    // Format the number with leading zeros to match Mokn_Intro000.webp, Mokn_Intro001.webp, etc.
    const num = i.toString().padStart(3, "0");
    return `https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/img_sequences/home_intro/Mokn_Intro${num}.webp`;
  });

function imageSequence(config) {
  let playhead = { frame: 0 },
    ctx = gsap.utils.toArray(config.canvas)[0].getContext("2d"),
    onUpdate = config.onUpdate,
    images,
    updateImage = function () {
      ctx.drawImage(images[Math.round(playhead.frame)], 0, 0);
      onUpdate && onUpdate.call(this);
    };
  images = config.urls.map((url, i) => {
    let img = new Image();
    img.src = url;
    i || (img.onload = updateImage);
    return img;
  });
  return gsap.to(playhead, {
    frame: images.length - 1,
    ease: "none",
    onUpdate: updateImage,
    duration: config.duration || 2, // default duration in seconds
    onComplete: config.onComplete,
    repeat: config.repeat || 0,
  });
}

const fps = 30;
const duration = frameCount / fps;

// Prépare la séquence de boucle
const loopFrameCount = 120;
const loopDuration = loopFrameCount / fps;
const loopUrls = new Array(loopFrameCount).fill().map((o, i) => {
  const num = (i + 1).toString().padStart(3, "0");
  return `https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/img_sequences/home_loop/home_loop${num}.webp`;
});

// Lance la première séquence, puis la séquence en boucle
imageSequence({
  urls,
  canvas: "#image-sequence",
  duration,
  onComplete: function () {
    imageSequence({
      urls: loopUrls,
      canvas: "#image-sequence",
      duration: loopDuration,
      repeat: -1,
    });
  },
});

// Animation GSAP ScrollTrigger : log à 1/3 et 2/3 de la hauteur de .section_hero_home
if (!window.gsap || !window.ScrollTrigger) {
  console.warn("GSAP ou ScrollTrigger non chargé");
  return;
}
const section = document.querySelector(".section_hero_home");
if (!section) return;
const height = section.offsetHeight * 0.9;
// 1/3
gsap.to(
  {},
  {
    scrollTrigger: {
      trigger: section,
      start: `top+=${height / 3} bottom`,
      onEnter: () => console.log("Vous avez atteint 1/3 de la section hero !"),
      onLeaveBack: () => console.log("Retour avant 1/3 de la section hero !"),
    },
  }
);

// Animation cross-fade optimisée pour tous les éléments [cross-fade]
(function () {
  const crossFades = Array.from(document.querySelectorAll("[cross-fade]"));
  if (crossFades.length < 2) return;
  // S'assure que le parent est en position relative
  const parent = crossFades[0].parentElement;
  if (parent && getComputedStyle(parent).position === "static") {
    parent.style.position = "relative";
  }
  // Style de base pour tous
  crossFades.forEach((el, i) => {
    el.style.position = "absolute";
    el.style.top = 0;
    el.style.left = 0;
    el.style.width = "100%";
    el.style.transition = "none";
    gsap.set(el, {
      y: i === 0 ? 0 : "150%",
      opacity: i === 0 ? 1 : 0,
      zIndex: i === 0 ? 2 : 1,
    });
  });

  // Animation dynamique pour chaque cross-fade
  for (let i = 0; i < crossFades.length - 1; i++) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: `top+=${((i + 1) * height) / crossFades.length} bottom`,
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      })
      .to(
        crossFades[i],
        {
          y: "-150%",
          opacity: 0,
          zIndex: 1,
          duration: 0.7,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        crossFades[i + 1],
        { y: "0%", opacity: 1, zIndex: 2, duration: 0.7, ease: "power2.inOut" },
        0
      );
  }
})();
