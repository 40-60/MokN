module.exports = function lanternCta3d() {
  // Video sources configuration for lantern
  const LANTERN_VIDEO_SOURCES = {
    // loop: {
    //   mp4: "http://localhost:3000/img_sequences/lantern/lantern-loop.mp4",
    //   mov: "http://localhost:3000/img_sequences/lantern/lantern-loop.mov",
    // },
    loop: {
      mp4: "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/lantern/lantern-loop.mp4",
      mov: "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/lantern/lantern-loop.mov",
    },
    // intro: {
    //   mp4: "http://localhost:3000/img_sequences/lantern/lantern-intro.mp4",
    //   mov: "http://localhost:3000/img_sequences/lantern/lantern-intro.mov",
    // },
    intro: {
      mp4: "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/lantern/lantern-intro.mp4",
      mov: "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/lantern/lantern-intro.mov",
    },
  };

  // Cache DOM element
  const lanternWrapper = document.querySelector("[lantern-wrapper]");

  if (lanternWrapper) {
    lanternWrapper.innerHTML = "";
  }

  /**
   * Creates a video element with sources for lantern
   * @param {Object} config - Video configuration
   * @returns {HTMLVideoElement}
   */
  function createLanternVideoElement(config) {
    const video = document.createElement("video");
    video.className = config.className || "fullsize z-index-1 inset-0";
    video.muted = true;
    video.playsInline = true;

    // Set video-specific properties
    Object.assign(video, config.attributes);

    // Add sources
    const mp4Source = document.createElement("source");
    mp4Source.src = config.sources.mp4;
    mp4Source.type = "video/mp4";

    const movSource = document.createElement("source");
    movSource.src = config.sources.mov;
    movSource.type = "video/quicktime";

    video.appendChild(mp4Source);
    video.appendChild(movSource);

    return video;
  }

  /**
   * Initializes lantern videos with GSAP ScrollTrigger
   */
  function initializeLanternVideos() {
    if (!lanternWrapper) {
      console.warn("Lantern wrapper not found");
      return;
    }

    // Create background loop video
    const loopVideo = createLanternVideoElement({
      sources: LANTERN_VIDEO_SOURCES.loop,
      className: "fullsize z-index-1 inset-0",
      attributes: { loop: true },
    });

    // Create intro overlay video
    const introVideo = createLanternVideoElement({
      sources: LANTERN_VIDEO_SOURCES.intro,
      className: "fullsize z-index-1 inset-0",
      attributes: { autoplay: false }, // Controlled by ScrollTrigger
    });

    // Event handler when intro ends
    introVideo.addEventListener("ended", () => {
      introVideo.classList.add("hide");
      loopVideo.play().catch((error) => {
        console.error("Failed to play lantern loop video:", error);
      });
    });

    // Add error handling for both videos
    [loopVideo, introVideo].forEach((video) => {
      video.addEventListener("error", (e) => {
        console.error("Lantern video loading error:", e);
      });
    });

    // Append videos to wrapper (loop first, then intro on top)
    lanternWrapper.appendChild(loopVideo);
    lanternWrapper.appendChild(introVideo);

    // GSAP ScrollTrigger to start intro video when lantern-wrapper top is at center
    gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: lanternWrapper,
          start: "top center",
          once: true,
          onEnter: () => {
            console.log(
              "Lantern wrapper reached center - starting intro video"
            );
            introVideo.play().catch((error) => {
              console.error("Failed to play lantern intro video:", error);
            });
          },
        },
      }
    );
  }

  // Initialize lantern videos
  initializeLanternVideos();
};
