require("../animations/home-slider.js")();
require("../animations/home-svg-path.js")();

// Détection optimisée de la qualité de connexion
const getConnectionQuality = () => {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (connection?.downlink) {
    const { downlink } = connection;
    return downlink >= 10 ? "high" : downlink > 3 ? "medium" : "low";
  }

  // Fallback: test de vitesse simple
  return new Promise((resolve) => {
    const startTime = performance.now();
    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      resolve(loadTime < 100 ? "high" : loadTime < 300 ? "medium" : "low");
    };
    img.onerror = () => resolve("low");
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  });
};

// Configuration optimisée des chemins
const imageConfigs = {
  high: { path: "img_sequences/home/high", extension: ".webp" },
  medium: {
    path: "img_sequences/home/medium",
    extension: ".webp",
    fallback: "high",
  },
  low: {
    path: "img_sequences/home/low",
    extension: ".webp",
    fallback: "medium",
  },
};

// Générateur d'URLs optimisé avec fallback automatique
const generateUrls = async (quality, type = "reveal") => {
  const frameCount = type === "reveal" ? 399 : 101;
  let config = imageConfigs[quality];

  // Test d'existence avec fallback automatique
  // const testUrl = `http://localhost:3000/${config.path}/${type}/${type}0${config.extension}`;
  const testUrl = `https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/${config.path}/${type}/${type}0${config.extension}`;
  const exists = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = testUrl;
  });

  if (!exists && config.fallback) {
    config = imageConfigs[config.fallback];
    quality = config.fallback;
  }

  const urls = Array.from(
    { length: frameCount },
    (_, i) =>
      // `http://localhost:3000/${config.path}/${type}/${type}${i}${config.extension}`
      `https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/${config.path}/${type}/${type}${i}${config.extension}`
  );

  return { urls, quality };
};

// Variables globales et cache
const imageCache = new Map();
const config = { frameCount: 399, loopFrameCount: 101, fps: 25 };
let urls = [],
  loopUrls = [],
  connectionQuality = "medium";

// Séquence d'images optimisée
const imageSequence = (sequenceConfig) => {
  const playhead = { frame: 0 };
  const canvas = gsap.utils.toArray(sequenceConfig.canvas)[0];
  const ctx = canvas.getContext("2d");

  const updateImage = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = images[Math.round(playhead.frame)];
    if (img?.complete) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    sequenceConfig.onUpdate?.call(this);
  };

  // Cache des images optimisé
  const images = sequenceConfig.urls.map((url) => {
    if (imageCache.has(url)) return imageCache.get(url);
    const img = new Image();
    img.src = url;
    imageCache.set(url, img);
    return img;
  });

  // Première image si disponible
  if (images[0]?.complete) updateImage();

  return gsap.to(playhead, {
    frame: images.length - 1,
    ease: "none",
    onUpdate: updateImage,
    duration: sequenceConfig.duration || 2,
    onComplete: sequenceConfig.onComplete,
    repeat: sequenceConfig.repeat || 0,
  });
};

// Calculs de durée
const duration = config.frameCount / config.fps;
let loopDuration;

// Variables de chargement
let isRevealLoaded = false,
  isLoopLoaded = false,
  revealAnimation = null;

// Préchargement optimisé par lots non-bloquants
const preloadBatch = async (urls, batchSize = 10, onProgress) => {
  let loaded = 0;
  const total = urls.length;

  for (let i = 0; i < total; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);

    await Promise.all(
      batch.map(
        (url) =>
          new Promise((resolve) => {
            if (imageCache.has(url)) {
              loaded++;
              onProgress?.(loaded, total);
              resolve();
              return;
            }

            const img = new Image();
            img.onload = img.onerror = () => {
              loaded++;
              onProgress?.(loaded, total);
              imageCache.set(url, img);
              resolve();
            };
            img.src = url;
          })
      )
    );

    // Attendre le prochain idle
    await new Promise((resolve) =>
      window.requestIdleCallback
        ? requestIdleCallback(resolve)
        : setTimeout(resolve, 16)
    );
  }
};

// Préchargement simple (pour compatibilité)
const preloadImageBatch = (urls, onProgress) => {
  return new Promise((resolve) => {
    let loaded = 0;
    const total = urls.length;

    urls.forEach((url) => {
      if (imageCache.has(url)) {
        if (++loaded === total) resolve();
        onProgress?.(loaded, total);
        return;
      }

      const img = new Image();
      img.onload = img.onerror = () => {
        imageCache.set(url, img);
        if (++loaded === total) resolve();
        onProgress?.(loaded, total);
      };
      img.src = url;
    });
  });
};

// Initialisation optimisée et simplifiée
const initImageSequence = async () => {
  // 1. Détection de connexion et génération des URLs
  connectionQuality = await getConnectionQuality();
  const [revealResult, loopResult] = await Promise.all([
    generateUrls(connectionQuality, "reveal"),
    generateUrls(connectionQuality, "loop"),
  ]);

  urls = revealResult.urls;
  loopUrls = loopResult.urls;
  loopDuration = config.loopFrameCount / config.fps;

  // Log résumé
  const quality = revealResult.quality;
  console.log(`🚀 Connexion → Qualité: ${quality} → Dossier: ${quality}`);

  // 2. Vérification du canvas
  const canvas = document.querySelector("#image-sequence");
  if (!canvas) return console.warn("Canvas #image-sequence non trouvé");

  // 3. Préchargement initial et démarrage
  await preloadBatch(urls.slice(0, 200), 5);
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 4. Démarrage de l'animation avec callback optimisé
  const startLoop = () => {
    if (!isLoopLoaded) return setTimeout(startLoop, 100);
    imageSequence({
      urls: loopUrls,
      canvas: "#image-sequence",
      duration: loopDuration,
      repeat: -1,
    });
  };

  revealAnimation = imageSequence({
    urls,
    canvas: "#image-sequence",
    duration,
    onComplete: startLoop,
  });

  // 5. Chargement en arrière-plan
  Promise.all([
    urls.length > 200
      ? preloadImageBatch(urls.slice(200)).then(() => (isRevealLoaded = true))
      : Promise.resolve((isRevealLoaded = true)),
    preloadBatch(loopUrls, 5).then(() => (isLoopLoaded = true)),
  ]);
};

// Initialisation
setTimeout(initImageSequence, 0);

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
