module.exports = function template() {
  console.clear();

  const coolVideo = document.querySelector("video");

  // Check if video element exists
  if (!coolVideo) {
    console.error("Video element not found");
    return;
  }

  // Check if GSAP and ScrollTrigger are available
  if (typeof gsap === "undefined") {
    console.error("GSAP is not loaded");
    return;
  }

  // Function to setup the scroll-controlled video
  function setupVideoScrub() {
    if (coolVideo.readyState < 1) {
      console.log("Video not ready yet, waiting...");
      return;
    }

    console.log("Setting up video scrub, duration:", coolVideo.duration);

    // Pause the video to prevent auto-playing
    coolVideo.pause();
    coolVideo.currentTime = 0;

    gsap.to(coolVideo, {
      currentTime: coolVideo.duration,
      ease: "none",
      scrollTrigger: {
        trigger: coolVideo,
        start: "top top",
        end: "bottom top",
        scrub: 1, // Smooth scrubbing
        markers: {
          startColor: "white",
          endColor: "white",
          fontSize: "18px",
          fontWeight: "bold",
          indent: 20,
        },
        onUpdate: function () {
          // Ensure video doesn't try to play during scrubbing
          if (!coolVideo.paused) {
            coolVideo.pause();
          }
        },
      },
    });
  }

  // Wait for video metadata to load
  if (coolVideo.readyState >= 1) {
    setupVideoScrub();
  } else {
    coolVideo.addEventListener("loadedmetadata", setupVideoScrub);
    // Fallback in case loadedmetadata doesn't fire
    coolVideo.addEventListener("canplay", setupVideoScrub);
  }
};
