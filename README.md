# MokN

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
- ou en ligne sur [https://purge.jsdelivr.net/gh/40-60/mokn/dist](https://purge.jsdelivr.net/gh/
  40-60/mokn/dist)

---

## Développement

Pour ajouter une nouvelle page ou une animation :

- Créez le fichier correspondant dans `src/pages/` ou `src/animations/`.
- Ajoutez ce fichier dans la configuration `webpack.config.js` pour qu'il soit pris en compte lors de la compilation.

---

## Déploiement et cache CDN

Après un push sur GitHub, il se peut que les fichiers du dossier `dist` ne soient pas mis à jour immédiatement sur le CDN jsDelivr.

Pour forcer la purge du cache manuellement, rendez-vous à l'adresse suivante :

`https://purge.jsdelivr.net/gh/40-60/mokn@main/dist/[CHEMIN VERS LE FICHIER]`

Remplacez `[CHEMIN VERS LE FICHIER]` par le chemin du fichier à rafraîchir.

Enfin rechargez la même page sur le CDN pour voir si ça a été mis à jour.

**Recommandation** : Utilisez plutôt les [scripts de purge automatisés](#scripts-de-purge-automatisés) qui sont plus pratiques et gèrent plusieurs fichiers à la fois.

---

## Intégration dans Webflow

Pour intégrer une animation GSAP dans une page Webflow, ajoutez ce script à l'échelle du site :

<script>
  const isPreview = location.href.includes("canvas");
  const isDev = localStorage.getItem("devMode") === "true";
  const globalScript = document.createElement("script");

  globalScript.src = isDev || isPreview
    ? "http://localhost:3000/global.js"
    : "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/global.js";

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
      : "https://cdn.jsdelivr.net/gh/40-60/mokn/dist/pages/[NOM DE LA PAGE].js";
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

## Scripts de purge automatisés

Pour faciliter la purge du cache CDN, plusieurs scripts sont disponibles. **Important** : Dans la plupart des cas, vous voulez purger les fichiers du dossier `dist` (fichiers compilés), pas ceux du dossier `src`.

### Purge des fichiers dist (usage principal)

#### Purge complète du dossier dist

```bash
npm run purge
# ou
node purge.js
```

#### Purge par catégorie (dist)

```bash
npm run purge:images     # Purge dist/img_sequences
npm run purge:pages      # Purge dist/pages
npm run purge:animations # Purge dist/animations
```

#### Purge spécifique (dist)

```bash
node purge.js img_sequences/lantern/strong  # Purge dist/img_sequences/lantern/strong
node purge.js pages animations              # Purge dist/pages et dist/animations
```

#### Purge de séquences d'images spécifiques (dist)

```bash
node purge-images.js lantern/strong  # Purge dist/img_sequences/lantern/strong
node purge-images.js carbon-bg       # Purge dist/img_sequences/carbon-bg
node purge-images.js baits/loop      # Purge dist/img_sequences/baits/loop
```

Le script affiche le statut de chaque fichier purgé et un résumé final.

---

## Ressources

- [GSAP Documentation](https://greensock.com/docs/)
- [jsDelivr Purge](https://purge.jsdelivr.net/)
