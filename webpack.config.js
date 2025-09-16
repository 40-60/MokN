const path = require("path");
const fs = require("fs");

// Fonction pour scanner récursivement les fichiers JS
function scanJsFiles(dir, baseDir = "src", entries = {}) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Récursion pour les sous-dossiers
      scanJsFiles(fullPath, baseDir, entries);
    } else if (file.endsWith(".js")) {
      // Créer le nom d'entrée en supprimant l'extension et en gardant la structure
      const relativePath = path.relative(baseDir, fullPath);
      const entryName = relativePath.replace(/\.js$/, "");
      entries[entryName] = fullPath;
    }
  });

  return entries;
}

// Générer automatiquement toutes les entrées
const entries = scanJsFiles(path.join(__dirname, "src"));

module.exports = {
  mode: "production",
  entry: entries,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd",
    globalObject: "this",
    umdNamedDefine: true,
    clean: true,
  },
  plugins: [
    new (require("copy-webpack-plugin"))({
      patterns: [
        {
          from: "src/img_sequences",
          to: "img_sequences",
        },
      ],
    }),
  ],
};
