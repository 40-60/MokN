// Initialize animations
require("../animations/home-slider.js")();
require("../animations/home-svg-path.js")();
require("../animations/carbon-bg-loop.js")();
require("../animations/lantern-cta-3d.js")();

// Constants for timing - different delays for first visit vs return visits
const ANIMATION_TIMINGS = {
  FIRST_VISIT: {
    NAV_DELAY: 3700,
    CONTENT_DELAY: 4700,
  },
  RETURN_VISIT: {
    NAV_DELAY: 100,
    CONTENT_DELAY: 500,
  },
};

const baseUrl = "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/img_sequences";
// const baseUrl = "http://localhost:3000/img_sequences";

// Video sources configuration
const VIDEO_SOURCES = {
  home: {
    loop: {
      mp4: `https://s3.amazonaws.com/webflow-prod-assets/68946a7f9dd4e558382abd0f/68f0ebe420e48fbeb83ce17d_Home-Loop.mp4`,
      mov: `${baseUrl}/home/home-loop.mov`,
    },
    intro: {
      mp4: `https://s3.amazonaws.com/webflow-prod-assets/68946a7f9dd4e558382abd0f/68f0ebbc56ac877052407266_Home-Intro.mp4`,
      mov: `${baseUrl}/home/home-intro.mov`,
    },
  },
};

// Cache DOM elements
const hero3dWrapper = document.querySelector(".home_hero_3d_wrapper");
const navLarge = document.querySelector(".nav-large");
const navSmall = document.querySelector(".nav-small");
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

  // const movSource = document.createElement("source");
  // movSource.src = config.sources.mov;
  // movSource.type = "video/quicktime";

  video.appendChild(mp4Source);
  // video.appendChild(movSource);

  return video;
}

/**
 * Handles UI animations triggered by intro video
 * @param {boolean} isFirstVisit - Whether this is the user's first visit
 */
function triggerUIAnimations(isFirstVisit = true) {
  console.log("Intro video started - triggering UI animations");

  // Select appropriate timing based on visit type
  const timings = isFirstVisit ? ANIMATION_TIMINGS.FIRST_VISIT : ANIMATION_TIMINGS.RETURN_VISIT;
  console.log(`Using ${isFirstVisit ? "first visit" : "return visit"} timings:`, timings);

  // Immediate opacity change
  if (hero3dWrapper) hero3dWrapper.style.opacity = 1;

  // Navigation animation
  if (window.innerWidth > 991) {
    setTimeout(() => {
      if (navLarge) navLarge.style.transform = "translateY(0)";
    }, timings.NAV_DELAY);
  } else {
    setTimeout(() => {
      if (navSmall) navSmall.style.transform = "translateY(0)";
    }, timings.NAV_DELAY);
  }

  // Content reveal animation
  setTimeout(() => {
    if (textContent) textContent.style.opacity = 1;
    // if (bobberLight) bobberLight.style.opacity = 1;
    loadScreen.style.display = "none";
  }, timings.CONTENT_DELAY);
}

/**
 * Checks if this is the first visit using sessionStorage
 * @returns {boolean}
 */
function isFirstVisit() {
  const hasVisited = sessionStorage.getItem("mokn_has_visited");
  // console.log("First visit : ", !hasVisited);

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
      introVideo.addEventListener("play", () => onIntroPlay(true));
    }

    introVideo.addEventListener("ended", () => {
      introVideo.classList.add("hide");
      loopVideo.play().catch((error) => {
        console.error(`Failed to play ${logPrefix.toLowerCase()} loop video:`, error);
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
      // Delay slightly to ensure video starts playing, pass false for return visit
      setTimeout(() => onIntroPlay(false), 100);
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

// ScrollTrigger animation only for screens above 991px
if (window.innerWidth > 991) {
  // Set initial opacity to 0
  gsap.set(navSmall, { opacity: 0 });
  navSmall.style.transform = "translateY(0%)";

  gsap.to(navSmall, {
    opacity: 1,
    duration: 0.5,
    ease: "power1.out",
    scrollTrigger: {
      trigger: "[section-feature]",
      start: "top bottom",
      toggleActions: "play none none reverse",
    },
  });
} else {
  // For mobile/tablet, ensure nav is always visible
  gsap.set(navSmall, { opacity: 1 });
}
