const easterEggsTrigger = document.querySelectorAll(".easter_egg_trigger");
const content1 = document.querySelector("#easter_egg_content_1");
const content2 = document.querySelector("#easter_egg_content_2");
const section = document.querySelector(".section_hero_about");

easterEggsTrigger.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    trigger.querySelector(".easter_egg_dot").classList.add("is-active");
    // Check if all dots have is-active
    const allActive = Array.from(
      document.querySelectorAll(".easter_egg_dot")
    ).every((dot) => dot.classList.contains("is-active"));
    if (allActive) {
      console.log("done");
      section.classList.add("easter_egg_active");
      content1.classList.add("opacity-0");
      content2.classList.remove("opacity-0");
    }
  });
});
