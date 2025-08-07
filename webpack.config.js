const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    ["global"]: "./src/global.js",

    // Pages
    ["pages/accueil"]: "./src/pages/accueil.js",
    ["pages/test-page"]: "./src/test-page.js",

    // Animations
    ["animations/animation-template"]: "./src/animations/animation-template.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd",
    globalObject: "this",
    umdNamedDefine: true,
    clean: true,
  },
};
