require("../animations/lantern-hero-3d.js")();
require("../animations/lantern-circular-slider.js")();
require("../animations/offer-scroll-to-cta.js")();

// Video sources de la section bobber
const baitsCTAWrapper = document.querySelector(".baits_cta_img");

baitsCTAWrapper.innerHTML = "";

if (baitsCTAWrapper) {
  // Créer l'élément vidéo
  const video = document.createElement("video");
  video.className = "lantern_bobber_cta";
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  // Ajouter les sources vidéo
  const mp4Source = document.createElement("source");
  mp4Source.src =
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/home/home-loop.mp4";
  mp4Source.type = "video/mp4";

  const movSource = document.createElement("source");
  movSource.src =
    "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/home/home-loop.mov";
  movSource.type = "video/quicktime";

  // Ajouter les sources à la vidéo
  video.appendChild(mp4Source);
  video.appendChild(movSource);

  // Ajouter la vidéo au wrapper
  baitsCTAWrapper.appendChild(video);
}
