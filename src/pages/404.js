const bobberWrapper = document.querySelector("._404_bobber");

bobberWrapper.innerHTML = "";

if (!bobberWrapper) {
  console.warn("404 bobber element not found");
  return;
}

// Configuration de la séquence d'images
const frameCount = 60;
const fps = 24;
const duration = frameCount / fps; // Calculer la durée

const urls = new Array(frameCount).fill().map((o, i) => {
  return `https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/baits/loop/loop${i}.webp`;
});

// Fonction pour créer la séquence d'images en boucle
function createLoopSequence() {
  let playhead = { frame: 0 };

  // Créer le canvas
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  // Nettoyer le contenu existant et ajouter le canvas
  bobberWrapper.innerHTML = "";
  bobberWrapper.appendChild(canvas);

  // Ajouter les classes au canvas
  canvas.classList.add("img-contain");

  let images = [];
  let imagesLoaded = 0;

  const updateImage = function () {
    const currentFrame = Math.round(playhead.frame);
    if (images[currentFrame] && images[currentFrame].complete) {
      // Ajuster la taille du canvas à l'image
      if (
        canvas.width !== images[currentFrame].width ||
        canvas.height !== images[currentFrame].height
      ) {
        canvas.width = images[currentFrame].width;
        canvas.height = images[currentFrame].height;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[currentFrame], 0, 0);
    }
  };

  // Précharger toutes les images
  images = urls.map((url, i) => {
    let img = new Image();
    img.onload = function () {
      imagesLoaded++;
      if (i === 0) {
        updateImage(); // Afficher la première image
        startAnimation(); // Démarrer l'animation une fois la première image chargée
      }
    };
    img.src = url;
    return img;
  });

  // Fonction pour démarrer l'animation en boucle
  const startAnimation = () => {
    gsap.to(playhead, {
      frame: frameCount - 1,
      duration: duration,
      ease: "none",
      repeat: -1, // Boucle infinie
      onUpdate: updateImage,
    });
  };
}

// Lancer la création de la séquence
createLoopSequence();
