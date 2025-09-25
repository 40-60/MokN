module.exports = function carbonBgLoop() {
  // Only run on screens wider than 767px
  if (window.innerWidth <= 767) {
    return;
  }

  // Configuration
  const frameCount = 135; // 0 to 134
  const fps = 200;
  const duration = frameCount / fps;

  // Generate URLs for carbon background images
  const urls = Array.from(
    { length: frameCount },
    (_, i) =>
      `https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/img_sequences/carbon-bg/carbon-bg${i}.webp`
  );

  const placeholderImg = document.querySelectorAll("[placeholder-carbon]");

  placeholderImg.forEach((img) => {
    img.style.display = "none";
  });

  // Simple image sequence function
  const imageSequence = (config) => {
    const playhead = { frame: 0 };
    const canvas = config.canvas;
    const ctx = canvas.getContext("2d");

    // Preload images
    const images = urls.map((url) => {
      const img = new Image();
      img.src = url;
      return img;
    });

    const updateImage = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = images[Math.round(playhead.frame)];
      if (img?.complete) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    return gsap.to(playhead, {
      frame: images.length - 1,
      ease: "none",
      onUpdate: updateImage,
      duration: config.duration || duration,
      repeat: 0, // Play once only
    });
  };

  // Start the animation with ScrollTrigger
  const canvases = document.querySelectorAll("[carbon-bg]");
  canvases.forEach((canvas) => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: canvas,
          start: "center bottom",
          end: "center center",
          scrub: true,
        },
      })
      .add(
        imageSequence({
          canvas: canvas,
          duration: duration,
        })
      );
  });
};
