module.exports = function homeSvgPathAnimation() {
  // Animation path
  const path = document.querySelector("#scrollPath");
  const pathLight = document.querySelector(".path_light");

  if (path && pathLight) {
    const length = path.getTotalLength();

    // Set up stroke dash animation for the path
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // Animate the stroke dash offset
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: path,
        start: "top center",
        end: "bottom center",
        scrub: true,
        // onUpdate: (self) => {
        //   const percent = Math.round(self.progress * 100);
        //   console.log(`Scroll progression: ${percent}%`);
        // },
      },
    });

    // Animate the path_light element along the path using MotionPath
    gsap.to(pathLight, {
      motionPath: {
        path: path,
        align: path,
        alignOrigin: [0.5, 0.5],
      },
      ease: "none",
      scrollTrigger: {
        trigger: path,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    // Set initial state
    gsap.set(".implement_light", { opacity: 0 });

    // Animate to visible when triggered
    gsap.to(".implement_light", {
      opacity: 1,
      ease: "power2.inOut",
      duration: 0.7,
      scrollTrigger: {
        trigger: path,
        start: "bottom 65%",
        end: "bottom center",
        toggleActions: "play none none reverse",
      },
    });
  }
};
