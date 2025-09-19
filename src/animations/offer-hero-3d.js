module.exports = function template() {
  const sequenceWrapper = document.querySelector("[baits-3d-wrapper]");

  if (!sequenceWrapper || !window.gsap || !window.ScrollTrigger) {
    console.warn("Élément .offer_hero_3d, GSAP ou ScrollTrigger non trouvé");
    return;
  }

  // const offersHeroContent = document.querySelectorAll(".offer_hero_content");

  // // Only add absolute class if screen width is over 767px
  // if (window.innerWidth > 767) {
  //   offersHeroContent.forEach((content) => {
  //     content.classList.add("absolute");
  //   });
  // }

  // // Add a resize listener to handle responsive behavior
  // window.addEventListener("resize", () => {
  //   if (window.innerWidth > 767) {
  //     offersHeroContent.forEach((content) => {
  //       content.classList.add("absolute");
  //     });
  //   } else {
  //     offersHeroContent.forEach((content) => {
  //       content.classList.remove("absolute");
  //     });
  //   }
  // });

  // Configuration de la séquence d'images
  const frameCount = 96; // de 0 à 108
  const urls = new Array(frameCount).fill().map((o, i) => {
    return `https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/img_sequences/baits/reveal/reveal${i}.webp`;
  });

  // Fonction pour créer la séquence d'images
  function imageSequence(config) {
    let playhead = { frame: 0 };

    // Créer les deux canvas superposés
    let scrollCanvas = document.createElement("canvas");
    let loopCanvas = document.createElement("canvas");
    let scrollCtx = scrollCanvas.getContext("2d");
    let loopCtx = loopCanvas.getContext("2d");

    // Nettoyer le contenu existant et ajouter les canvas
    sequenceWrapper.innerHTML = "";
    sequenceWrapper.appendChild(scrollCanvas);
    sequenceWrapper.appendChild(loopCanvas);

    // Styliser les canvas
    scrollCanvas.classList.add("baits_3d");
    loopCanvas.classList.add("baits_3d", "hide");

    let images = [];
    let imagesLoaded = 0;

    const updateScrollImage = function () {
      const currentFrame = Math.round(playhead.frame);
      if (images[currentFrame] && images[currentFrame].complete) {
        // Ajuster la taille du canvas à l'image
        if (
          scrollCanvas.width !== images[currentFrame].width ||
          scrollCanvas.height !== images[currentFrame].height
        ) {
          scrollCanvas.width = images[currentFrame].width;
          scrollCanvas.height = images[currentFrame].height;
        }
        scrollCtx.clearRect(0, 0, scrollCanvas.width, scrollCanvas.height);
        scrollCtx.drawImage(images[currentFrame], 0, 0);
      }
    };

    // Précharger toutes les images de la séquence scroll
    images = config.urls.map((url, i) => {
      let img = new Image();
      img.onload = function () {
        imagesLoaded++;
        if (i === 0) updateScrollImage(); // Afficher la première image
      };
      img.src = url;
      return img;
    });

    // Configuration de la séquence de boucle
    const loopFrameCount = 49;
    const loopFPS = 25; // Définir les FPS souhaités
    const loopDuration = loopFrameCount / loopFPS; // Calculer la durée
    const loopUrls = new Array(loopFrameCount).fill().map((o, i) => {
      return `https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/img_sequences/baits/loop/loop${i}.webp`;
    });

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

    // Fonction pour basculer vers la séquence en boucle
    const startLoopSequence = () => {
      if (loopAnimation) loopAnimation.kill();

      // Afficher le canvas de boucle et cacher celui du scroll
      scrollCanvas.classList.add("hide");
      loopCanvas.classList.remove("hide");

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

    // Initialiser l'animation de boucle en préparation
    loopAnimation = gsap.to(loopPlayhead, {
      frame: loopFrameCount - 1,
      duration: loopDuration,
      ease: "none",
      repeat: -1,
      onUpdate: updateLoopImage,
      paused: true, // Démarrer en pause
    });

    // Créer l'animation ScrollTrigger
    gsap.to(playhead, {
      frame: frameCount - 1,
      ease: "none",
      onUpdate: updateScrollImage,
      scrollTrigger: {
        trigger: "#offer_hero_left",
        start: "top top",
        end: "bottom 20%",
        scrub: true,
        invalidateOnRefresh: true,
        // markers: true,
        onLeave: startLoopSequence,
        onEnterBack: () => {
          // Basculer vers le canvas de scroll et arrêter la boucle
          loopCanvas.classList.add("hide");
          scrollCanvas.classList.remove("hide");
          if (loopAnimation) {
            loopAnimation.pause();
          }
          // Afficher la dernière image de la séquence scroll
          playhead.frame = frameCount - 1;
          updateScrollImage();
        },
      },
    });
  }

  // Lancer l'animation
  imageSequence({
    urls: urls,
  });
};
