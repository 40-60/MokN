module.exports = function offerHero3D() {
  const sequenceWrapper = document.querySelector("[baits-3d-wrapper]");

  // Configuration de la séquence dim uniquement
  const frameCount = 61;
  const dimUrls = new Array(frameCount).fill().map((o, i) => {
    // return `https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/lantern/dim/dim${i}.webp`;
    return `http://localhost:3000/img_sequences/lantern/dim/dim${i}.webp`;
  });

  // Fonction pour créer la séquence d'images
  function imageSequence(config) {
    // Créer le canvas principal
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    // Nettoyer le contenu existant et ajouter le canvas
    sequenceWrapper.innerHTML = "";
    sequenceWrapper.appendChild(canvas);

    // Styliser le canvas
    canvas.classList.add("baits_3d");

    // Variables pour l'animation dim uniquement
    let dimImages = [];
    let dimPlayhead = { frame: 0 };
    let dimLoopAnimation = null;
    let dimImagesLoaded = 0;

    // Configuration de la boucle
    const loopFPS = 30;
    const loopDuration = frameCount / loopFPS;

    // Fonction pour mettre à jour l'image
    const updateDimLoop = () => {
      const currentFrame = Math.round(dimPlayhead.frame);
      if (dimImages[currentFrame] && dimImages[currentFrame].complete) {
        if (
          canvas.width !== dimImages[currentFrame].width ||
          canvas.height !== dimImages[currentFrame].height
        ) {
          canvas.width = dimImages[currentFrame].width;
          canvas.height = dimImages[currentFrame].height;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(dimImages[currentFrame], 0, 0);
      }
    };

    // Fonction pour démarrer la boucle
    const startDimLoop = () => {
      console.log("🔵 Starting dim loop");

      dimPlayhead.frame = 0;
      updateDimLoop();

      dimLoopAnimation = gsap.to(dimPlayhead, {
        frame: frameCount - 1,
        duration: loopDuration,
        ease: "none",
        repeat: -1,
        onUpdate: updateDimLoop,
        onStart: () => {
          console.log("✅ Dim loop animation started");
        },
      });
    };

    // Précharger les images dim
    dimImages = config.dimUrls.map((url, i) => {
      let img = new Image();
      img.onload = function () {
        dimImagesLoaded++;
        console.log(
          `📸 Dim image ${i} loaded (${dimImagesLoaded}/${frameCount})`
        );

        // Démarrer dès que les premières images sont chargées
        if (dimImagesLoaded === 5) {
          console.log("🎬 5 images loaded, starting dim loop");
          startDimLoop();
        }
      };
      img.onerror = function () {
        console.error(`❌ Failed to load dim image ${i}: ${url}`);
      };
      img.src = url;
      return img;
    });

    // Forcer le démarrage après 2 secondes si pas encore démarré
    setTimeout(() => {
      if (dimImagesLoaded >= 3 && !dimLoopAnimation) {
        console.log("⏰ Force starting dim loop after timeout");
        startDimLoop();
      }
    }, 2000);
  }

  // Lancer l'animation
  imageSequence({
    dimUrls: dimUrls,
  });
};
