module.exports = function circularSliderOptimized() {
  // Configuration object for easy maintenance
  const CONFIG = {
    ROTATION_STEP: 30,
    TOTAL_SLIDES: 6,
    MOBILE_BREAKPOINT: 767,
    SWIPE_THRESHOLD: 40,
    PULSE_DURATION: 200,
    DEBOUNCE_DELAY: 100,
    ANIMATION: {
      LOOP_FRAME_COUNT: 49,
      LOOP_FPS: 25,
      BASE_URL:
        "https://cdn.jsdelivr.net/gh/40-60/mokn@master/dist/img_sequences/baits/loop/",
    },
  };

  // Utility functions
  const utils = {
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    isMobile: () => window.innerWidth <= CONFIG.MOBILE_BREAKPOINT,

    batchDOMUpdates(callback) {
      requestAnimationFrame(callback);
    },
  };

  // Cache DOM elements once
  const elements = (() => {
    const cache = {};

    const selectors = {
      prevBtn: "#prev-btn",
      nextBtn: "#next-btn",
      circularCarousel: ".circular_carousel_list",
      mobileDotsWrapper: ".mobile_dots_wrapper",
      carouselMask: ".circular_carousel_mask",
      circularSlider3DWrapper: "[circular-slider-3d]",
    };

    // Cache single elements
    Object.entries(selectors).forEach(([key, selector]) => {
      cache[key] = document.querySelector(selector);
    });

    // Cache element collections
    cache.carouselItems = document.querySelectorAll(".circular_carousel_item");
    cache.contents = document.querySelectorAll(".circular_carousel_content");
    cache.paginationDots =
      document
        .querySelector(".circular_carousel_nav")
        ?.querySelectorAll(".slider-dot") || [];
    cache.desktopDots = document.querySelectorAll(
      ".circular_carousel_dot.is-desktop .circular_carousel_dot_icon"
    );
    cache.desktopDotsLight = document.querySelectorAll(
      ".circular_carousel_dot.is-desktop .circular_carousel_dot_light"
    );
    cache.mobileDots = document.querySelectorAll(
      ".circular_carousel_dot.is-mobile .circular_carousel_dot_icon"
    );
    cache.mobileDotsLight = document.querySelectorAll(
      ".circular_carousel_dot.is-mobile .circular_carousel_dot_light"
    );
    cache.carouselImages = document.querySelectorAll(".circular_carousel_img");

    return cache;
  })();

  // State management
  const state = {
    rotation: 0,
    activeIndex: 0,
    touchStartX: null,
    touchEndX: null,
    isDestroyed: false,
  };

  // Animation controller
  const animationController = {
    loopAnimation: null,
    loopCanvas: null,
    loopCtx: null,
    loopImages: [],
    loopPlayhead: { frame: 0 },

    preloadImages() {
      const { LOOP_FRAME_COUNT, BASE_URL } = CONFIG.ANIMATION;
      this.loopImages = Array.from({ length: LOOP_FRAME_COUNT }, (_, i) => {
        const img = new Image();
        img.src = `${BASE_URL}loop${i}.webp`;
        return img;
      });
    },

    updateLoopImage() {
      const currentFrame = Math.round(this.loopPlayhead.frame);
      const currentImage = this.loopImages[currentFrame];

      if (currentImage?.complete && this.loopCanvas && this.loopCtx) {
        // Only resize canvas if dimensions changed
        if (
          this.loopCanvas.width !== currentImage.width ||
          this.loopCanvas.height !== currentImage.height
        ) {
          this.loopCanvas.width = currentImage.width;
          this.loopCanvas.height = currentImage.height;
        }

        this.loopCtx.clearRect(
          0,
          0,
          this.loopCanvas.width,
          this.loopCanvas.height
        );
        this.loopCtx.drawImage(currentImage, 0, 0);
      }
    },

    startLoop() {
      if (!window.gsap) {
        console.warn("GSAP not found for circular slider 3D loop");
        return;
      }

      if (this.loopAnimation) {
        this.loopAnimation.kill();
      }

      const { LOOP_FRAME_COUNT, LOOP_FPS } = CONFIG.ANIMATION;
      const duration = LOOP_FRAME_COUNT / LOOP_FPS;

      this.loopPlayhead.frame = 0;
      this.updateLoopImage();

      this.loopAnimation = gsap.to(this.loopPlayhead, {
        frame: LOOP_FRAME_COUNT - 1,
        duration,
        ease: "none",
        repeat: -1,
        onUpdate: () => this.updateLoopImage(),
      });
    },

    destroy() {
      if (this.loopAnimation) {
        this.loopAnimation.kill();
        this.loopAnimation = null;
      }
    },
  };

  // UI update functions
  const ui = {
    setContentColors(content, isActive) {
      if (!content) return;

      const h3 = content.querySelector("h3");
      const p = content.querySelector("p");

      utils.batchDOMUpdates(() => {
        if (h3) {
          h3.classList.toggle("text-color-gs-600", !isActive);
          h3.classList.toggle("text-color-white", isActive);
        }
        if (p) {
          p.classList.toggle("text-color-gs-600", !isActive);
          p.classList.toggle("text-color-gs-300", isActive);
        }
      });
    },

    updateActiveStates() {
      utils.batchDOMUpdates(() => {
        const { activeIndex } = state;

        // Update pagination dots
        elements.paginationDots.forEach((dot, i) => {
          dot.classList.toggle("is-active", i === activeIndex);
        });

        if (utils.isMobile()) {
          this.updateMobileStates();
        } else {
          this.updateDesktopStates();
        }
      });
    },

    updateDesktopStates() {
      const { activeIndex, rotation } = state;

      // Update carousel rotation
      if (elements.circularCarousel) {
        elements.circularCarousel.style.transform = `rotateZ(${rotation}deg)`;
      }

      // Update desktop dots
      elements.desktopDots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeIndex);
      });

      elements.desktopDotsLight.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeIndex);
      });

      // Update content colors
      elements.contents.forEach((content, i) => {
        this.setContentColors(content, i === activeIndex);
      });
    },

    updateMobileStates() {
      const { activeIndex, rotation } = state;

      // Update mobile dots wrapper rotation
      if (elements.mobileDotsWrapper) {
        elements.mobileDotsWrapper.style.transform = `rotateZ(${-rotation}deg)`;
      }

      // Update carousel items
      elements.carouselItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === activeIndex);
      });

      // Update mobile dots
      elements.mobileDots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeIndex);
      });

      elements.mobileDotsLight.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeIndex);
      });
    },

    updateButtonStates() {
      const { activeIndex } = state;

      utils.batchDOMUpdates(() => {
        if (elements.prevBtn) {
          elements.prevBtn.classList.toggle("is-disabled", activeIndex === 0);
        }
        if (elements.nextBtn) {
          elements.nextBtn.classList.toggle(
            "is-disabled",
            activeIndex === CONFIG.TOTAL_SLIDES - 1
          );
        }
      });
    },

    addPulseEffect() {
      elements.carouselImages.forEach((img) => img.classList.add("pulse"));

      setTimeout(() => {
        if (state.isDestroyed) return;
        elements.carouselImages.forEach((img) => img.classList.remove("pulse"));
      }, CONFIG.PULSE_DURATION);
    },
  };

  // Event handlers
  const handlers = {
    handleSlideChange(direction) {
      state.rotation += direction * CONFIG.ROTATION_STEP;
      state.activeIndex -= direction;
      ui.updateActiveStates();
      ui.updateButtonStates();
    },

    handlePrevClick() {
      if (state.activeIndex === 0) return;
      ui.addPulseEffect();
      handlers.handleSlideChange(1);
    },

    handleNextClick() {
      if (state.activeIndex === CONFIG.TOTAL_SLIDES - 1) return;
      ui.addPulseEffect();
      handlers.handleSlideChange(-1);
    },

    handleDotClick(index) {
      if (index === state.activeIndex) return;

      const direction = index < state.activeIndex ? 1 : -1;
      const steps = Math.abs(index - state.activeIndex);

      state.rotation += direction * CONFIG.ROTATION_STEP * steps;
      state.activeIndex = index;

      ui.updateActiveStates();
      ui.updateButtonStates();
    },

    handleTouchStart(e) {
      if (!utils.isMobile()) return;
      state.touchStartX = e.changedTouches[0].screenX;
    },

    handleTouchEnd(e) {
      if (!utils.isMobile() || state.touchStartX === null) return;

      state.touchEndX = e.changedTouches[0].screenX;
      const diff = state.touchEndX - state.touchStartX;

      if (Math.abs(diff) > CONFIG.SWIPE_THRESHOLD) {
        if (diff > 0 && state.activeIndex > 0) {
          handlers.handleSlideChange(1);
        } else if (diff < 0 && state.activeIndex < CONFIG.TOTAL_SLIDES - 1) {
          handlers.handleSlideChange(-1);
        }
      }

      state.touchStartX = null;
      state.touchEndX = null;
    },

    handleResize: utils.debounce(() => {
      if (state.isDestroyed) return;
      ui.updateActiveStates();
      ui.updateButtonStates();
    }, CONFIG.DEBOUNCE_DELAY),
  };

  // Initialization
  const init = () => {
    // Initial mobile content setup
    if (utils.isMobile()) {
      elements.contents.forEach((content) => {
        ui.setContentColors(content, true);
      });
    }

    // Add event listeners
    elements.prevBtn?.addEventListener("click", handlers.handlePrevClick);
    elements.nextBtn?.addEventListener("click", handlers.handleNextClick);

    elements.paginationDots.forEach((dot, i) => {
      dot.addEventListener("click", () => handlers.handleDotClick(i));
    });

    if (elements.carouselMask) {
      elements.carouselMask.addEventListener(
        "touchstart",
        handlers.handleTouchStart
      );
      elements.carouselMask.addEventListener(
        "touchend",
        handlers.handleTouchEnd
      );
    }

    window.addEventListener("resize", handlers.handleResize);

    // Initialize 3D animation
    if (elements.circularSlider3DWrapper) {
      animationController.loopCanvas = document.createElement("canvas");
      animationController.loopCtx =
        animationController.loopCanvas.getContext("2d");

      elements.circularSlider3DWrapper.innerHTML = "";
      elements.circularSlider3DWrapper.appendChild(
        animationController.loopCanvas
      );
      animationController.loopCanvas.classList.add("img-contain");

      animationController.preloadImages();
      animationController.startLoop();
    }

    // Set initial state
    ui.updateActiveStates();
    ui.updateButtonStates();
  };

  // Cleanup function
  const destroy = () => {
    state.isDestroyed = true;

    // Remove event listeners
    elements.prevBtn?.removeEventListener("click", handlers.handlePrevClick);
    elements.nextBtn?.removeEventListener("click", handlers.handleNextClick);
    window.removeEventListener("resize", handlers.handleResize);

    elements.paginationDots.forEach((dot, i) => {
      dot.removeEventListener("click", () => handlers.handleDotClick(i));
    });

    if (elements.carouselMask) {
      elements.carouselMask.removeEventListener(
        "touchstart",
        handlers.handleTouchStart
      );
      elements.carouselMask.removeEventListener(
        "touchend",
        handlers.handleTouchEnd
      );
    }

    // Cleanup animations
    animationController.destroy();
  };

  // Initialize and return cleanup function
  init();

  return { destroy };
};
