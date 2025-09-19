require("../animations/home-slider.js")();
require("../animations/home-svg-path.js")();
require("../animations/carbon-bg-loop.js")();

const hero3dWrapper = document.querySelector(".home_hero_3d_wrapper");

// Create and add video elements to hero3dWrapper
if (hero3dWrapper) {
  // First video - home-loop (background video)
  const loopVideo = document.createElement("video");
  loopVideo.className = "home_hero_3d";
  loopVideo.muted = true;
  loopVideo.playsInline = true;
  loopVideo.loop = true;
  // Remove autoplay - will start manually after intro

  const loopSourceMp4 = document.createElement("source");
  loopSourceMp4.src =
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/home//home-loop.mp4";
  loopSourceMp4.type = "video/mp4";

  const loopSourceMov = document.createElement("source");
  loopSourceMov.src =
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/home/home-loop.mov";
  loopSourceMov.type = "video/quicktime";

  loopVideo.appendChild(loopSourceMp4);
  loopVideo.appendChild(loopSourceMov);

  // Second video - home-intro (overlay video)
  const introVideo = document.createElement("video");
  introVideo.className = "home_hero_3d";
  introVideo.muted = true;
  introVideo.playsInline = true;
  introVideo.autoplay = true;

  const introSourceMp4 = document.createElement("source");
  introSourceMp4.src =
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/home/home-intro.mp4";
  introSourceMp4.type = "video/mp4";

  const introSourceMov = document.createElement("source");
  introSourceMov.src =
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/home/home/home-intro.mov";
  introSourceMov.type = "video/quicktime";

  introVideo.appendChild(introSourceMp4);
  introVideo.appendChild(introSourceMov);

  // Add event listener when intro video starts playing
  introVideo.addEventListener("play", () => {
    console.log("Intro video started - triggering UI animations");
    const wrapper3D = document.querySelector(".home_hero_3d_wrapper");
    const navLarge = document.querySelector(".nav-large");
    const textContent = document.querySelector(".hero_home_content");
    const bobberLight = document.querySelector(".home_hero_bobber_light");

    wrapper3D.style.opacity = 1;

    setTimeout(() => {
      navLarge.style.transform = "translateY(0)";
    }, 3700);
    setTimeout(() => {
      textContent.style.opacity = 1;
      bobberLight.style.opacity = 1;
      loadScreen.style.display = "none";
    }, 4700);
  });

  // Add event listener to hide intro video and start loop video when intro ends
  introVideo.addEventListener("ended", () => {
    introVideo.classList.add("hide");
    loopVideo.play(); // Start the loop video when intro ends
  });

  // Add videos to the wrapper (loop first, then intro on top)
  hero3dWrapper.appendChild(loopVideo);
  hero3dWrapper.appendChild(introVideo);
}

// // Bloque le scroll jusqu'à la fin du chargement
// const pageWrapper = document.querySelector(".page-wrapper");

// // Détection optimisée de la qualité de connexion
// const getConnectionQuality = () => {
//   const connection =
//     navigator.connection ||
//     navigator.mozConnection ||
//     navigator.webkitConnection;

//   if (connection?.downlink) {
//     const { downlink } = connection;
//     return downlink >= 10 ? "high" : downlink > 3 ? "medium" : "low";
//   }

//   // Fallback: test de vitesse simple
//   return new Promise((resolve) => {
//     const startTime = performance.now();
//     const img = new Image();
//     img.onload = () => {
//       const loadTime = performance.now() - startTime;
//       resolve(loadTime < 100 ? "high" : loadTime < 300 ? "medium" : "low");
//     };
//     img.onerror = () => resolve("low");
//     img.src =
//       "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
//   });
// };

// // Configuration optimisée des chemins
// const imageConfigs = {
//   high: { path: "img_sequences/home/high", extension: ".webp" },
//   medium: {
//     path: "img_sequences/home/medium",
//     extension: ".webp",
//     fallback: "high",
//   },
//   low: {
//     path: "img_sequences/home/low",
//     extension: ".webp",
//     fallback: "medium",
//   },
// };

// // Générateur d'URLs optimisé avec fallback automatique
// const generateUrls = async (quality, type = "reveal") => {
//   const frameCount = type === "reveal" ? 399 : 101;
//   let config = imageConfigs[quality];

//   // Test d'existence avec fallback automatique
//   // const testUrl = `http://localhost:3000/${config.path}/${type}/${type}0${config.extension}`;
//   const testUrl = `https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/${config.path}/${type}/${type}0${config.extension}`;
//   const exists = await new Promise((resolve) => {
//     const img = new Image();
//     img.onload = () => resolve(true);
//     img.onerror = () => resolve(false);
//     img.src = testUrl;
//   });

//   if (!exists && config.fallback) {
//     config = imageConfigs[config.fallback];
//     quality = config.fallback;
//   }

//   const urls = Array.from(
//     { length: frameCount },
//     (_, i) =>
//       // `http://localhost:3000/${config.path}/${type}/${type}${i}${config.extension}`
//       `https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/${config.path}/${type}/${type}${i}${config.extension}`
//   );

//   return { urls, quality };
// };

// // Variables globales et cache
// const imageCache = new Map();
// const config = { frameCount: 399, loopFrameCount: 101, fps: 25 };
// let urls = [],
//   loopUrls = [],
//   connectionQuality = "medium";

// // Séquence d'images optimisée
// const imageSequence = (sequenceConfig) => {
//   const playhead = { frame: 0 };
//   const canvas = gsap.utils.toArray(sequenceConfig.canvas)[0];
//   const ctx = canvas.getContext("2d");

//   const updateImage = () => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     const img = images[Math.round(playhead.frame)];
//     if (img?.complete) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//     sequenceConfig.onUpdate?.call(this);
//   };

//   // Cache des images optimisé
//   const images = sequenceConfig.urls.map((url) => {
//     if (imageCache.has(url)) return imageCache.get(url);
//     const img = new Image();
//     img.src = url;
//     imageCache.set(url, img);
//     return img;
//   });

//   // Première image si disponible
//   if (images[0]?.complete) updateImage();

//   return gsap.to(playhead, {
//     frame: images.length - 1,
//     ease: "none",
//     onUpdate: updateImage,
//     duration: sequenceConfig.duration || 2,
//     onComplete: sequenceConfig.onComplete,
//     repeat: sequenceConfig.repeat || 0,
//   });
// };

// // Calculs de durée
// const duration = config.frameCount / config.fps;
// let loopDuration;

// // Variables de chargement
// let isRevealLoaded = false,
//   isLoopLoaded = false,
//   revealAnimation = null;

// // Fonction pour mettre à jour le pourcentage de chargement
// const updateLoadingPercentage = (percentage) => {
//   const loadElement = document.querySelector("[load-number]");
//   const loadBar = document.querySelector("[load-bar]");
//   if (loadElement) {
//     loadElement.textContent = `${Math.round(percentage)}%`;
//     loadBar.style.width = `${Math.round(percentage)}%`;
//   }

//   // Masquer l'écran de chargement quand on atteint vraiment 100%
//   if (percentage >= 100) {
//     const loadScreen = document.querySelector("[load-screen]");
//     const wrapper3D = document.querySelector(".home_hero_3d_wrapper");
//     const navLarge = document.querySelector(".nav-large");
//     const textContent = document.querySelector(".hero_home_content");
//     const bobberLight = document.querySelector(".home_hero_bobber_light");
//     const placeholderImg = document.querySelector("#hero-placeholder-img");

//     loadScreen.style.opacity = 0;
//     wrapper3D.style.opacity = 1;
//     setTimeout(() => {
//       placeholderImg.style.display = "none";
//     }, 500);
//     setTimeout(() => {
//       navLarge.style.transform = "translateY(0)";
//     }, 4500);
//     setTimeout(() => {
//       textContent.style.opacity = 1;
//       bobberLight.style.opacity = 1;
//       loadScreen.style.display = "none";
//     }, 5500);
//   }
// };

// // Préchargement optimisé par lots non-bloquants
// const preloadBatch = async (urls, batchSize = 10, onProgress) => {
//   let loaded = 0;
//   const total = urls.length;

//   for (let i = 0; i < total; i += batchSize) {
//     const batch = urls.slice(i, i + batchSize);

//     await Promise.all(
//       batch.map(
//         (url) =>
//           new Promise((resolve) => {
//             if (imageCache.has(url)) {
//               loaded++;
//               onProgress?.(loaded, total);
//               resolve();
//               return;
//             }

//             const img = new Image();
//             img.onload = img.onerror = () => {
//               loaded++;
//               onProgress?.(loaded, total);
//               imageCache.set(url, img);
//               resolve();
//             };
//             img.src = url;
//           })
//       )
//     );

//     // Attendre le prochain idle
//     await new Promise((resolve) =>
//       window.requestIdleCallback
//         ? requestIdleCallback(resolve)
//         : setTimeout(resolve, 16)
//     );
//   }
// };

// // Préchargement simple (pour compatibilité)
// const preloadImageBatch = (urls, onProgress) => {
//   return new Promise((resolve) => {
//     let loaded = 0;
//     const total = urls.length;

//     urls.forEach((url) => {
//       if (imageCache.has(url)) {
//         if (++loaded === total) resolve();
//         onProgress?.(loaded, total);
//         return;
//       }

//       const img = new Image();
//       img.onload = img.onerror = () => {
//         imageCache.set(url, img);
//         if (++loaded === total) resolve();
//         onProgress?.(loaded, total);
//       };
//       img.src = url;
//     });
//   });
// };

// // Initialisation optimisée et simplifiée
// const initImageSequence = async () => {
//   // Variables de suivi du chargement
//   let totalImages = 0;
//   let loadedImages = 0;

//   // 1. Détection de connexion et génération des URLs
//   connectionQuality = await getConnectionQuality();
//   const [revealResult, loopResult] = await Promise.all([
//     generateUrls(connectionQuality, "reveal"),
//     generateUrls(connectionQuality, "loop"),
//   ]);

//   urls = revealResult.urls;
//   loopUrls = loopResult.urls;
//   loopDuration = config.loopFrameCount / config.fps;

//   // Calcul du total d'images à charger
//   totalImages = Math.min(200, urls.length) + loopUrls.length;

//   // Fonction de mise à jour du pourcentage global
//   const updateGlobalProgress = () => {
//     const percentage = (loadedImages / totalImages) * 100;
//     updateLoadingPercentage(percentage);
//   };

//   // Log résumé
//   const quality = revealResult.quality;
//   console.log(`🚀 Connexion → Qualité: ${quality} → Dossier: ${quality}`);

//   // 2. Vérification du canvas
//   const canvas = document.querySelector("#image-sequence");
//   if (!canvas) return console.warn("Canvas #image-sequence non trouvé");

//   // 3. Préchargement initial et démarrage avec suivi du progrès
//   await preloadBatch(urls.slice(0, 200), 5, (loaded, total) => {
//     loadedImages = loaded;
//     updateGlobalProgress();
//   });

//   // 4. Chargement des images de loop pour atteindre 100%
//   await preloadBatch(loopUrls, 5, (loaded, total) => {
//     loadedImages = Math.min(200, urls.length) + loaded;
//     updateGlobalProgress();
//   });

//   isLoopLoaded = true;

//   // Délai de 1 seconde APRÈS avoir atteint 100% avant de lancer la séquence
//   //await new Promise((resolve) => setTimeout(resolve, 100));

//   // 5. Démarrage de l'animation avec callback optimisé
//   const startLoop = () => {
//     if (!isLoopLoaded) return setTimeout(startLoop, 100);
//     imageSequence({
//       urls: loopUrls,
//       canvas: "#image-sequence",
//       duration: loopDuration,
//       repeat: -1,
//     });
//   };

//   revealAnimation = imageSequence({
//     urls,
//     canvas: "#image-sequence",
//     duration,
//     onComplete: startLoop,
//   });

//   // 6. Chargement en arrière-plan des images restantes (optionnel)
//   if (urls.length > 200) {
//     preloadImageBatch(urls.slice(200), (loaded, total) => {
//       // Les images restantes ne comptent pas pour le pourcentage critique
//     }).then(() => (isRevealLoaded = true));
//   } else {
//     isRevealLoaded = true;
//   }
// };

// // Fonction pour ajuster la hauteur du line_path_wrapper
// const setLinePathWrapperHeight = () => {
//   const linePathWrapper = document.querySelector(".line_path_wrapper");
//   const sectionFeature = document.querySelector("[section-feature]");

//   if (linePathWrapper && sectionFeature) {
//     const sectionHeight = sectionFeature.offsetHeight;
//     linePathWrapper.style.height = `${sectionHeight}px`;
//   }
// };

// // Initialiser la hauteur au chargement
// document.addEventListener("DOMContentLoaded", setLinePathWrapperHeight);

// // Mettre à jour la hauteur lors du redimensionnement de la fenêtre
// window.addEventListener("resize", () => {
//   // Debounce pour éviter trop d'appels
//   clearTimeout(window.resizeTimeout);
//   window.resizeTimeout = setTimeout(setLinePathWrapperHeight, 100);
// });

// // Initialisation
// setTimeout(initImageSequence, 0);

// // Animation GSAP ScrollTrigger : log à 1/3 et 2/3 de la hauteur de .section_hero_home
// if (!window.gsap || !window.ScrollTrigger) {
//   console.warn("GSAP ou ScrollTrigger non chargé");
//   return;
// }
// const section = document.querySelector(".section_hero_home");
// if (!section) return;
// const height = section.offsetHeight * 0.9;
// // 1/3
// gsap.to(
//   {},
//   {
//     scrollTrigger: {
//       trigger: section,
//       start: `top+=${height / 3} bottom`,
//       onEnter: () => console.log("Vous avez atteint 1/3 de la section hero !"),
//       onLeaveBack: () => console.log("Retour avant 1/3 de la section hero !"),
//     },
//   }
// );

// Animation cross-fade optimisée pour tous les éléments [cross-fade]
const crossFades = Array.from(document.querySelectorAll("[cross-fade]"));

crossFades.forEach((el) => {
  el.style.position = "absolute";
});
