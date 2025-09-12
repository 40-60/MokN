const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const circularCarousel = document.querySelector(".circular_carousel_list");
const mobileDotsWrapper = document.querySelector(".mobile_dots_wrapper");
const carouselItems = document.querySelectorAll(".circular_carousel_item");
const contents = document.querySelectorAll(".circular_carousel_content");
const paginationDots = document
  .querySelector(".circular_carousel_nav")
  .querySelectorAll(".slider-dot");

const desktopDots = document.querySelectorAll(
  ".circular_carousel_dot.is-desktop .circular_carousel_dot_icon"
);
const desktopDotsLight = document.querySelectorAll(
  ".circular_carousel_dot.is-desktop .circular_carousel_dot_light"
);
const mobileDots = document.querySelectorAll(
  ".circular_carousel_dot.is-mobile .circular_carousel_dot_icon"
);
const mobileDotsLight = document.querySelectorAll(
  ".circular_carousel_dot.is-mobile .circular_carousel_dot_light"
);

let rotation = 0;
let activeIndex = 0;

if (window.innerWidth <= 767) {
  contents.forEach((content) => {
    content.querySelector("h3").classList.remove("text-color-gs-600");
    content.querySelector("h3").classList.add("text-color-white");
    content.querySelector("p").classList.remove("text-color-gs-600");
    content.querySelector("p").classList.add("text-color-gs-300");
  });
}

function setContentColors(content, isActive) {
  const h3 = content.querySelector("h3");
  const p = content.querySelector("p");
  if (isActive) {
    h3.classList.remove("text-color-gs-600");
    h3.classList.add("text-color-white");
    p.classList.remove("text-color-gs-600");
    p.classList.add("text-color-gs-300");
  } else {
    h3.classList.add("text-color-gs-600");
    h3.classList.remove("text-color-white");
    p.classList.add("text-color-gs-600");
    p.classList.remove("text-color-gs-300");
  }
}

function updateTransform() {
  paginationDots.forEach((dot, i) => {
    if (i === activeIndex) {
      dot.classList.add("is-active");
    } else {
      dot.classList.remove("is-active");
    }
  });

  if (window.innerWidth >= 767) {
    circularCarousel.style.transform = `rotateZ(${rotation}deg)`;

    desktopDots.forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add("is-active");
      } else {
        dot.classList.remove("is-active");
      }
    });

    desktopDotsLight.forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add("is-active");
      } else {
        dot.classList.remove("is-active");
      }
    });

    contents.forEach((content, i) => {
      setContentColors(content, i === activeIndex);
    });
  } else if (window.innerWidth <= 767) {
    // Mobile behavior
    if (mobileDotsWrapper) {
      mobileDotsWrapper.style.transform = `rotateZ(${-rotation}deg)`;
    }
    // Gère les .is-active sur les items
    carouselItems.forEach((item, i) => {
      if (i === activeIndex) {
        item.classList.add("is-active");
      } else {
        item.classList.remove("is-active");
      }
    });
    // Gère les .is-active sur les dots mobiles
    mobileDots.forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add("is-active");
      } else {
        dot.classList.remove("is-active");
      }
    });
    mobileDotsLight.forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add("is-active");
      } else {
        dot.classList.remove("is-active");
      }
    });
    // Gère les boutons disabled
    if (activeIndex === 0) {
      prevBtn.classList.add("is-disabled");
    } else {
      prevBtn.classList.remove("is-disabled");
    }
    if (activeIndex === desktopDots.length) {
      nextBtn.classList.add("is-disabled");
    } else {
      nextBtn.classList.remove("is-disabled");
    }
  }
}

function handleClick(direction) {
  rotation += direction * 30;
  activeIndex -= direction;
  updateTransform();
}

function updateButtonStates() {
  if (activeIndex === 0) {
    prevBtn.classList.add("is-disabled");
  } else {
    prevBtn.classList.remove("is-disabled");
  }
  if (activeIndex === 5) {
    nextBtn.classList.add("is-disabled");
  } else {
    nextBtn.classList.remove("is-disabled");
  }
}

prevBtn.addEventListener("click", () => {
  if (activeIndex === 0) return;
  handleClick(1);
  updateButtonStates();
});

nextBtn.addEventListener("click", () => {
  if (activeIndex === 5) return;
  handleClick(-1);
  updateButtonStates();
});

paginationDots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    if (i === activeIndex) return;
    const direction = i < activeIndex ? 1 : -1;
    const steps = Math.abs(i - activeIndex);
    rotation += direction * 30 * steps;
    activeIndex = i;
    updateTransform();
    updateButtonStates();
  });
});

// Initial state
updateButtonStates();

// Gestion du swipe sur mobile pour .circular_carousel_mask
const carouselMask = document.querySelector(".circular_carousel_mask");
let touchStartX = null;
let touchEndX = null;

if (carouselMask) {
  carouselMask.addEventListener("touchstart", function (e) {
    if (window.innerWidth > 767) return;
    touchStartX = e.changedTouches[0].screenX;
  });
  carouselMask.addEventListener("touchend", function (e) {
    if (window.innerWidth > 767) return;
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        // Seuil de swipe
        if (diff > 0) {
          // Swipe vers la droite: prev
          if (activeIndex > 0) {
            handleClick(1);
            updateButtonStates();
          }
        } else {
          // Swipe vers la gauche: next
          if (activeIndex < desktopDots.length) {
            handleClick(-1);
            updateButtonStates();
          }
        }
      }
    }
    touchStartX = null;
    touchEndX = null;
  });
}

// Met à jour l'affichage lors du redimensionnement de la fenêtre
window.addEventListener("resize", () => {
  updateTransform();
  updateButtonStates();
});
updateTransform();

// Initial state
updateButtonStates();
