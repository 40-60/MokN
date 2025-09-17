const pageUrl = encodeURIComponent(window.location.href);

// Handle Facebook sharing links
const facebookLinks = document.querySelectorAll("[facebook]");
facebookLinks.forEach((facebook) => {
  facebook.setAttribute(
    "href",
    `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`
  );
  facebook.setAttribute("target", "_blank");
});

// Handle Twitter sharing links
const twitterLinks = document.querySelectorAll("[twitter]");
twitterLinks.forEach((twitter) => {
  twitter.setAttribute(
    "href",
    `https://twitter.com/intent/tweet?url=${pageUrl}`
  );
  twitter.setAttribute("target", "_blank");
});

// Handle LinkedIn sharing links
const linkedinLinks = document.querySelectorAll("[linkedin]");
linkedinLinks.forEach((linkedin) => {
  linkedin.setAttribute(
    "href",
    `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`
  );
  linkedin.setAttribute("target", "_blank");
});

// Handle copy link buttons
const copyLinks = document.querySelectorAll("[link]");
copyLinks.forEach((link) => {
  link.setAttribute("href", "");
  link.addEventListener("click", async (e) => {
    e.preventDefault(); // prevent default link behavior
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papiers !");
    } catch (err) {
      alert("Échec de la copie du lien");
    }
  });
});
