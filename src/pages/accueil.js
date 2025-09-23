// Initialize animations
require("../animations/home-slider.js")();
require("../animations/home-svg-path.js")();
require("../animations/carbon-bg-loop.js")();
require("../animations/lantern-cta-3d.js")();

// Constants for timing
const ANIMATION_TIMINGS = {
  NAV_DELAY: 3700,
  CONTENT_DELAY: 4700,
};

// Video sources configuration
const VIDEO_SOURCES = {
  home: {
    loop: {
      mp4: "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/home/home-loop.mp4",
      mov: "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/home/home-loop.mov",
    },
    intro: {
      mp4: "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/home/home-intro.mp4",
      mov: "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences/home/home-intro.mov",
    },
  },
};

// Cache DOM elements
const hero3dWrapper = document.querySelector(".home_hero_3d_wrapper");
const navLarge = document.querySelector(".nav-large");
const textContent = document.querySelector(".hero_home_content");
// const bobberLight = document.querySelector(".home_hero_bobber_light");
const loadScreen = document.querySelector(".load-screen") || {
  style: { display: "none" },
}; // Safe fallback

/**
 * Creates a video element with sources
 * @param {Object} config - Video configuration
 * @returns {HTMLVideoElement}
 */
function createVideoElement(config) {
  const video = document.createElement("video");
  video.className = config.className || "home_hero_3d";
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
 * Handles UI animations triggered by intro video
 */
function triggerUIAnimations() {
  console.log("Intro video started - triggering UI animations");

  // Immediate opacity change
  if (hero3dWrapper) hero3dWrapper.style.opacity = 1;

  // Navigation animation
  setTimeout(() => {
    if (navLarge) navLarge.style.transform = "translateY(0)";
  }, ANIMATION_TIMINGS.NAV_DELAY);

  // Content reveal animation
  setTimeout(() => {
    if (textContent) textContent.style.opacity = 1;
    // if (bobberLight) bobberLight.style.opacity = 1;
    loadScreen.style.display = "none";
  }, ANIMATION_TIMINGS.CONTENT_DELAY);
}

/**
 * Checks if this is the first visit using sessionStorage
 * @returns {boolean}
 */
function isFirstVisit() {
  const hasVisited = sessionStorage.getItem("mokn_has_visited");
  console.log("First visit : ", !hasVisited);

  if (!hasVisited) {
    sessionStorage.setItem("mokn_has_visited", "true");
    return true;
  }
  return false;
}

/**
 * Generic function to initialize videos for any wrapper
 * @param {Object} config - Configuration object
 */
function initializeVideos(config) {
  const { wrapper, videoSources, className, onIntroPlay, logPrefix } = config;

  if (!wrapper) {
    console.warn(`${logPrefix} wrapper not found`);
    return;
  }

  // Check if this is the first visit
  const firstVisit = isFirstVisit();

  // Create background loop video
  const loopVideo = createVideoElement({
    sources: videoSources.loop,
    className: className,
    attributes: { loop: true },
  });

  if (firstVisit) {
    // First visit: create intro video and play it first
    const introVideo = createVideoElement({
      sources: videoSources.intro,
      className: className,
      attributes: { autoplay: true },
    });

    // Event handlers for first visit
    if (onIntroPlay) {
      introVideo.addEventListener("play", onIntroPlay);
    }

    introVideo.addEventListener("ended", () => {
      introVideo.classList.add("hide");
      loopVideo.play().catch((error) => {
        console.error(
          `Failed to play ${logPrefix.toLowerCase()} loop video:`,
          error
        );
      });
    });

    // Add error handling for intro video
    introVideo.addEventListener("error", (e) => {
      console.error(`${logPrefix} intro video loading error:`, e);
    });

    // Append videos to wrapper (loop first, then intro on top)
    wrapper.appendChild(loopVideo);
    wrapper.appendChild(introVideo);
  } else {
    // Subsequent visits: play loop directly and trigger UI animations immediately
    loopVideo.autoplay = true;

    // Trigger UI animations immediately since we're skipping intro
    if (onIntroPlay) {
      // Delay slightly to ensure video starts playing
      setTimeout(onIntroPlay, 100);
    }

    // Append only loop video to wrapper
    wrapper.appendChild(loopVideo);
  }

  // Add error handling for loop video
  loopVideo.addEventListener("error", (e) => {
    console.error(`${logPrefix} loop video loading error:`, e);
  });
}

/**
 * Initializes hero videos
 */
function initializeHeroVideos() {
  initializeVideos({
    wrapper: hero3dWrapper,
    videoSources: VIDEO_SOURCES.home,
    className: "home_hero_3d",
    onIntroPlay: triggerUIAnimations,
    logPrefix: "Hero",
  });
}

// Initialize hero videos
initializeHeroVideos();

/**
 * Optimizes cross-fade elements positioning
 */
const crossFadeElements = document.querySelectorAll("[cross-fade]");
crossFadeElements.forEach((el) => {
  el.style.position = "absolute";
});
