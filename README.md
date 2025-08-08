# lesBigBoss

Projet d'intégration d'animations GSAP pour Webflow.

## Sommaire

1. [Installation et lancement](#installation-et-lancement)
2. [Développement](#développement)
3. [Ajout de pages ou d'animations](#ajout-de-pages-ou-danimations)
4. [Déploiement et cache CDN](#déploiement-et-cache-cdn)
5. [Intégration dans Webflow](#intégration-dans-webflow)
6. [Mode développement local](#mode-développement-local)

---

## Installation et lancement

Avant toute chose, installez les dépendances du projet :

```bash
npm i
```

Ouvrez ensuite deux terminaux et lancez les commandes suivantes :

1. `npx serve dist`  
   Sert le dossier `dist` sur http://localhost:3000
2. `npm run dev`  
   Compile les scripts en mode développement et surveille les changements.

Vous pouvez consulter l'ensemble des fichiers générés :

- en local sur [http://localhost:3000](http://localhost:3000)
- ou en ligne sur [https://purge.jsdelivr.net/gh/40-60/lesBigBoss/dist](https://purge.jsdelivr.net/gh/40-60/lesBigBoss/dist)

---

## Développement

Pour ajouter une nouvelle page ou une animation :

- Créez le fichier correspondant dans `src/pages/` ou `src/animations/`.
- Ajoutez ce fichier dans la configuration `webpack.config.js` pour qu'il soit pris en compte lors de la compilation.

---

## Déploiement et cache CDN

Après un push sur GitHub, il se peut que les fichiers du dossier `dist` ne soient pas mis à jour immédiatement sur le CDN jsDelivr.

Pour forcer la purge du cache, rendez-vous à l'adresse suivante :

`https://purge.jsdelivr.net/gh/40-60/lesBigBoss/dist/[CHEMIN VERS LE FICHIER]`

Remplacez `[CHEMIN VERS LE FICHIER]` par le chemin du fichier à rafraîchir.

---

## Intégration dans Webflow

Pour intégrer une animation GSAP dans une page Webflow, ajoutez ce script à l'échelle du site :

<script>
  const isPreview = location.href.includes("canvas");
  const isDev = localStorage.getItem("devMode") === "true";
  const globalScript = document.createElement("script");

  globalScript.src = isDev || isPreview
    ? "http://localhost:3000/global.js"
    : "https://cdn.jsdelivr.net/gh/40-60/lesBigBoss/dist/global.js";

  document.head.appendChild(globalScript);
  console.log("[Chargement JS] Source :", globalScript.src);
</script>

Et ce script à l'échelle de chaque page :

```html
<script>
  const script = document.createElement("script");
  script.src =
    window.isDev || window.isPreview
      ? "http://localhost:3000/pages/[NOM DE LA PAGE].js"
      : "https://cdn.jsdelivr.net/gh/40-60/lesBigBoss/dist/pages/[NOM DE LA PAGE].js";
  document.head.appendChild(script);
  console.log("[Chargement JS] Source :", script.src);
</script>
```

Remplacez `[NOM DE LA PAGE]` par le nom du fichier JS correspondant à la page.

---

## Mode développement local

Pour activer le mode développement et charger les scripts depuis votre localhost, exécutez dans la console du navigateur :

```js
localStorage.setItem("devMode", "true");
```

Pour désactiver le mode développement :

```js
localStorage.setItem("devMode", "false");
```

---

## Ressources

- [GSAP Documentation](https://greensock.com/docs/)
- [jsDelivr Purge](https://purge.jsdelivr.net/)
