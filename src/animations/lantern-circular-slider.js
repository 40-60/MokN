module.exports = function template() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const circularCarousel = document.querySelector(".circular_carousel_list");
  const mobileDotsWrapper = document.querySelector(".mobile_dots_wrapper");
  const carouselItems = document.querySelectorAll(".circular_carousel_item");
  const contents = document.querySelectorAll(".circular_carousel_content");
  const paginationDots = document
    .querySelector(".circular_carousel_nav")
    .querySelectorAll(".slider-dot");

  const desktopDots = document.querySelectorAll(
    ".circular_carousel_dot.is-desktop .circular_carousel_dot_icon"
  );
  const desktopDotsLight = document.querySelectorAll(
    ".circular_carousel_dot.is-desktop .circular_carousel_dot_light"
  );
  const mobileDots = document.querySelectorAll(
    ".circular_carousel_dot.is-mobile .circular_carousel_dot_icon"
  );
  const mobileDotsLight = document.querySelectorAll(
    ".circular_carousel_dot.is-mobile .circular_carousel_dot_light"
  );

  // Query the .lantern_cc_header elements
  const lanternHeaders = document.querySelectorAll(".lantern_cc_header");

  lanternHeaders[1].classList.add("incoming");

  let rotation = 0;
  let activeIndex = 0;

  if (window.innerWidth <= 767) {
    contents.forEach((content) => {
      content.querySelector("h3").classList.remove("text-color-gs-600");
      content.querySelector("h3").classList.add("text-color-white");
      content.querySelector("p").classList.remove("text-color-gs-600");
      content.querySelector("p").classList.add("text-color-gs-300");
    });
  }

  function setContentColors(content, isActive) {
    const h3 = content.querySelector("h3");
    const p = content.querySelector("p");
    if (isActive) {
      h3.classList.remove("text-color-gs-600");
      h3.classList.add("text-color-white");
      p.classList.remove("text-color-gs-600");
      p.classList.add("text-color-gs-300");
    } else {
      h3.classList.add("text-color-gs-600");
      h3.classList.remove("text-color-white");
      p.classList.add("text-color-gs-600");
      p.classList.remove("text-color-gs-300");
    }
  }

  function handleLanternHeaders(newIndex, direction) {
    if (lanternHeaders.length < 2) return;

    const firstHeader = lanternHeaders[0];
    const secondHeader = lanternHeaders[1];

    // When moving from index 2 to 3 (next click at index 2)
    if (activeIndex === 2 && newIndex === 3 && direction === "next") {
      firstHeader.classList.add("done");
      secondHeader.classList.remove("incoming");
    }
    // When moving from index 3 to 2 (prev click at index 3)
    else if (activeIndex === 3 && newIndex === 2 && direction === "prev") {
      firstHeader.classList.remove("done");
      secondHeader.classList.add("incoming");
    }
  }

  function updateTransform() {
    paginationDots.forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add("is-active");
      } else {
        dot.classList.remove("is-active");
      }
    });

    if (window.innerWidth >= 767) {
      circularCarousel.style.transform = `rotateZ(${rotation}deg)`;

      desktopDots.forEach((dot, i) => {
        if (i === activeIndex) {
          dot.classList.add("is-active");
        } else {
          dot.classList.remove("is-active");
        }
      });

      desktopDotsLight.forEach((dot, i) => {
        if (i === activeIndex) {
          dot.classList.add("is-active");
        } else {
          dot.classList.remove("is-active");
        }
      });

      contents.forEach((content, i) => {
        setContentColors(content, i === activeIndex);
      });
    } else if (window.innerWidth <= 767) {
      // Mobile behavior
      if (mobileDotsWrapper) {
        mobileDotsWrapper.style.transform = `rotateZ(${-rotation}deg)`;
      }
      // Gère les .is-active sur les items
      carouselItems.forEach((item, i) => {
        if (i === activeIndex) {
          item.classList.add("is-active");
        } else {
          item.classList.remove("is-active");
        }
      });
      // Gère les .is-active sur les dots mobiles
      mobileDots.forEach((dot, i) => {
        if (i === activeIndex) {
          dot.classList.add("is-active");
        } else {
          dot.classList.remove("is-active");
        }
      });
      mobileDotsLight.forEach((dot, i) => {
        if (i === activeIndex) {
          dot.classList.add("is-active");
        } else {
          dot.classList.remove("is-active");
        }
      });
      // Gère les boutons disabled
      if (activeIndex === 0) {
        prevBtn.classList.add("is-disabled");
      } else {
        prevBtn.classList.remove("is-disabled");
      }
      if (activeIndex === desktopDots.length) {
        nextBtn.classList.add("is-disabled");
      } else {
        nextBtn.classList.remove("is-disabled");
      }
    }
  }

  function handleClick(direction, clickDirection) {
    const newIndex = activeIndex - direction;
    handleLanternHeaders(newIndex, clickDirection);
    rotation += direction * 30;
    activeIndex -= direction;
    updateTransform();
  }

  function updateButtonStates() {
    if (activeIndex === 0) {
      prevBtn.classList.add("is-disabled");
    } else {
      prevBtn.classList.remove("is-disabled");
    }
    if (activeIndex === 5) {
      nextBtn.classList.add("is-disabled");
    } else {
      nextBtn.classList.remove("is-disabled");
    }
  }

  // Fonction pour déclencher l'animation 3D
  let play3DSequence = null;

  prevBtn.addEventListener("click", () => {
    if (activeIndex === 0) return;
    // Déclencher l'animation 3D si elle existe (direction: prev)
    if (play3DSequence) play3DSequence("prev");
    handleClick(1, "prev");
    updateButtonStates();
  });

  nextBtn.addEventListener("click", () => {
    if (activeIndex === 5) return;
    // Déclencher l'animation 3D si elle existe (direction: next)
    if (play3DSequence) play3DSequence("next");
    handleClick(-1, "next");
    updateButtonStates();
  });

  paginationDots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      if (i === activeIndex) return;
      // Déterminer la direction selon le clic sur les dots
      const direction = i < activeIndex ? "prev" : "next";
      // Handle lantern headers for dot clicks
      handleLanternHeaders(i, direction);
      // Déclencher l'animation 3D si elle existe
      if (play3DSequence) play3DSequence(direction);
      const rotationDirection = i < activeIndex ? 1 : -1;
      const steps = Math.abs(i - activeIndex);
      rotation += rotationDirection * 30 * steps;
      activeIndex = i;
      updateTransform();
      updateButtonStates();
    });
  });

  // Initial state
  updateButtonStates();

  // Gestion du swipe sur mobile pour .circular_carousel_mask
  const carouselMask = document.querySelector(".circular_carousel_mask");
  let touchStartX = null;
  let touchEndX = null;

  if (carouselMask) {
    carouselMask.addEventListener("touchstart", function (e) {
      if (window.innerWidth > 767) return;
      touchStartX = e.changedTouches[0].screenX;
    });
    carouselMask.addEventListener("touchend", function (e) {
      if (window.innerWidth > 767) return;
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX !== null && touchEndX !== null) {
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          // Seuil de swipe
          if (diff > 0) {
            // Swipe vers la droite: prev
            if (activeIndex > 0) {
              // Déclencher l'animation 3D si elle existe
              if (play3DSequence) play3DSequence("prev");
              handleClick(1, "prev");
              updateButtonStates();
            }
          } else {
            // Swipe vers la gauche: next
            if (activeIndex < desktopDots.length - 1) {
              // Déclencher l'animation 3D si elle existe
              if (play3DSequence) play3DSequence("next");
              handleClick(-1, "next");
              updateButtonStates();
            }
          }
        }
      }
      touchStartX = null;
      touchEndX = null;
    });
  }

  // Met à jour l'affichage lors du redimensionnement de la fenêtre
  window.addEventListener("resize", () => {
    updateTransform();
    updateButtonStates();
  });
  updateTransform();

  // Initial state
  updateButtonStates();

  // 3D Loop Animation for circular slider
  const circularSlider3DWrapper = document.querySelector(
    "[circular-slider-3d]"
  );

  if (circularSlider3DWrapper) {
    // Configuration des séquences
    const FRAME_COUNT = 61;
    const FPS = 60;
    const DURATION = FRAME_COUNT / FPS;
    const BASE_URL =
      "https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/img_sequences/lantern";
    // "http://localhost:3000/img_sequences/lantern";

    // Fonction utilitaire pour générer les URLs d'une séquence
    const generateSequenceUrls = (sequenceName) => {
      return new Array(FRAME_COUNT)
        .fill()
        .map((_, i) => `${BASE_URL}/${sequenceName}/${sequenceName}${i}.webp`);
    };

    // Générer toutes les URLs
    const dimUrls = generateSequenceUrls("dim");
    const increaseUrls = generateSequenceUrls("increase");
    const strongUrls = generateSequenceUrls("strong");

    // Configurations simplifiées (toutes identiques maintenant)
    const dimFrameCount = (increaseFrameCount = strongFrameCount = FRAME_COUNT);
    const dimDuration = (increaseDuration = strongDuration = DURATION);

    // Créer le canvas pour la boucle
    let loopCanvas = document.createElement("canvas");
    let loopCtx = loopCanvas.getContext("2d");

    // Nettoyer le contenu existant et ajouter le canvas
    circularSlider3DWrapper.innerHTML = "";
    circularSlider3DWrapper.appendChild(loopCanvas);

    // Styliser le canvas avec la classe .img-contain
    loopCanvas.classList.add("img-contain");

    let dimImages = [];
    let increaseImages = [];
    let strongImages = [];
    let loopAnimation = null;
    let loopPlayhead = { frame: 0 };

    // Fonction utilitaire pour créer des images à partir d'URLs
    const createImagesFromUrls = (urls) => {
      return urls.map((url) => {
        const img = new Image();
        img.src = url;
        return img;
      });
    };

    // Précharger les images des trois séquences
    const preloadLoopImages = () => {
      return new Promise((resolve) => {
        // Créer toutes les images en une fois
        dimImages = createImagesFromUrls(dimUrls);
        increaseImages = createImagesFromUrls(increaseUrls);
        strongImages = createImagesFromUrls(strongUrls);

        // Initialiser le canvas avec la première image
        if (dimImages[0]) {
          dimImages[0].onload = () => {
            loopCanvas.width = dimImages[0].width;
            loopCanvas.height = dimImages[0].height;
            updateLoopImage(dimImages);
            resolve();
          };
        } else {
          resolve();
        }
      });
    };

    const updateLoopImage = (images) => {
      const currentFrame = Math.round(loopPlayhead.frame);
      if (images[currentFrame] && images[currentFrame].complete) {
        if (
          loopCanvas.width !== images[currentFrame].width ||
          loopCanvas.height !== images[currentFrame].height
        ) {
          loopCanvas.width = images[currentFrame].width;
          loopCanvas.height = images[currentFrame].height;
        }
        loopCtx.clearRect(0, 0, loopCanvas.width, loopCanvas.height);
        loopCtx.drawImage(images[currentFrame], 0, 0);
      }
    };

    // Fonction utilitaire pour obtenir les données d'animation
    const getAnimationData = (type) => {
      const animations = {
        dim: {
          images: dimImages,
          frameCount: dimFrameCount,
          duration: dimDuration,
        },
        increase: {
          images: increaseImages,
          frameCount: increaseFrameCount,
          duration: increaseDuration,
        },
        strong: {
          images: strongImages,
          frameCount: strongFrameCount,
          duration: strongDuration,
        },
      };
      return animations[type];
    };

    // Fonction pour déterminer le type d'animation selon l'index et la direction
    const getAnimationType = (index, direction) => {
      if (direction === "next") {
        if (index < 2) return "dim";
        if (index === 2) return "increase";
        return "strong";
      } else {
        // direction === "prev"
        if (index === 3) return "increase";
        if (index >= 4) return "strong";
        return "dim";
      }
    };

    // Fonction pour jouer la séquence une seule fois
    const playSequence = (direction = "next") => {
      console.log("Active Index:", activeIndex, "Direction:", direction);

      if (loopAnimation) loopAnimation.kill();

      // Obtenir le type d'animation et ses données
      const animationType = getAnimationType(activeIndex, direction);
      const { images, frameCount, duration } = getAnimationData(animationType);

      // Déterminer si on doit jouer en reverse (index 3 + direction PREV)
      const shouldPlayReverse = direction === "prev" && activeIndex === 3;

      // Reset et affichage de la première/dernière image selon la direction
      if (shouldPlayReverse) {
        loopPlayhead.frame = frameCount - 1;
        updateLoopImage(images);

        loopAnimation = gsap.to(loopPlayhead, {
          frame: 0,
          duration: duration,
          ease: "none",
          onUpdate: () => updateLoopImage(images),
        });
      } else {
        loopPlayhead.frame = 0;
        updateLoopImage(images);

        loopAnimation = gsap.to(loopPlayhead, {
          frame: frameCount - 1,
          duration: duration,
          ease: "none",
          onUpdate: () => updateLoopImage(images),
        });
      }
    };

    // Précharger les images de la boucle et initialiser
    if (window.gsap) {
      preloadLoopImages().then(() => {
        // Exposer la fonction pour pouvoir l'appeler depuis les événements de clic
        play3DSequence = playSequence;
      });
    } else {
      console.warn("GSAP not found for circular slider 3D loop");
    }
  }
};
