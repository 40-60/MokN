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

  function handleClick(direction) {
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

  function addPulseEffect() {
    const carouselImages = document.querySelectorAll(".circular_carousel_img");
    carouselImages.forEach((img) => {
      img.classList.add("pulse");
    });

    setTimeout(() => {
      carouselImages.forEach((img) => {
        img.classList.remove("pulse");
      });
    }, 200);
  }

  prevBtn.addEventListener("click", () => {
    if (activeIndex === 0) return;
    addPulseEffect();
    handleClick(1);
    updateButtonStates();
  });

  nextBtn.addEventListener("click", () => {
    if (activeIndex === 5) return;
    addPulseEffect();
    handleClick(-1);
    updateButtonStates();
  });

  paginationDots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      if (i === activeIndex) return;
      const direction = i < activeIndex ? 1 : -1;
      const steps = Math.abs(i - activeIndex);
      rotation += direction * 30 * steps;
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
              handleClick(1);
              updateButtonStates();
            }
          } else {
            // Swipe vers la gauche: next
            if (activeIndex < desktopDots.length) {
              handleClick(-1);
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
    // Configuration de la séquence de boucle
    const loopFrameCount = 49;
    const loopFPS = 25; // Définir les FPS souhaités
    const loopDuration = loopFrameCount / loopFPS; // Calculer la durée
    const loopUrls = new Array(loopFrameCount).fill().map((o, i) => {
      return `https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/img_sequences/baits/loop/loop${i}.webp`;
    });

    // Créer le canvas pour la boucle
    let loopCanvas = document.createElement("canvas");
    let loopCtx = loopCanvas.getContext("2d");

    // Nettoyer le contenu existant et ajouter le canvas
    circularSlider3DWrapper.innerHTML = "";
    circularSlider3DWrapper.appendChild(loopCanvas);

    // Styliser le canvas avec la classe .img-contain
    loopCanvas.classList.add("img-contain");

    let loopImages = [];
    let loopAnimation = null;
    let loopPlayhead = { frame: 0 };

    // Précharger les images de la boucle
    const preloadLoopImages = () => {
      loopImages = loopUrls.map((url) => {
        let img = new Image();
        img.src = url;
        return img;
      });
    };

    const updateLoopImage = () => {
      const currentFrame = Math.round(loopPlayhead.frame);
      if (loopImages[currentFrame] && loopImages[currentFrame].complete) {
        if (
          loopCanvas.width !== loopImages[currentFrame].width ||
          loopCanvas.height !== loopImages[currentFrame].height
        ) {
          loopCanvas.width = loopImages[currentFrame].width;
          loopCanvas.height = loopImages[currentFrame].height;
        }
        loopCtx.clearRect(0, 0, loopCanvas.width, loopCanvas.height);
        loopCtx.drawImage(loopImages[currentFrame], 0, 0);
      }
    };

    // Fonction pour démarrer la séquence en boucle
    const startLoopSequence = () => {
      if (loopAnimation) loopAnimation.kill();

      // Reset et affichage immédiat de la première image de boucle
      loopPlayhead.frame = 0;
      updateLoopImage();

      loopAnimation = gsap.to(loopPlayhead, {
        frame: loopFrameCount - 1,
        duration: loopDuration,
        ease: "none",
        repeat: -1, // Boucle infinie
        onUpdate: updateLoopImage,
      });
    };

    // Précharger les images de la boucle
    preloadLoopImages();

    // Démarrer l'animation de boucle
    if (window.gsap) {
      startLoopSequence();
    } else {
      console.warn("GSAP not found for circular slider 3D loop");
    }
  }
};
