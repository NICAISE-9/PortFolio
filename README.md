# Portfolio — Testeur Logiciel QA

Portfolio statique (HTML/CSS + Vue.js) pour un profil de testeur logiciel
spécialisé en tests manuels et automatisés. Vue est chargé via CDN
(`unpkg.com`), aucune installation ni build n'est nécessaire.

## Aperçu en local

Ouvre simplement `index.html` dans ton navigateur, ou lance un petit serveur local :

```bash
# Python
python -m http.server 8000

# ou avec Node
npx serve .
```

Puis ouvre `http://localhost:8000`.

## À personnaliser

- **`index.html`**
  - Remplace `Nicaise Keou` par ton nom complet si besoin, et adapte le `<title>`.
  - Section **Expérience** : remplace les entreprises, dates et descriptions par ton vrai parcours.
  - Section **Projets** : remplace les 4 projets d'exemple par tes vrais projets de test (liens vers dépôts GitHub, rapports, etc.).
  - Section **Certifications** : ajoute tes certifications réelles (ISTQB, etc.) avec les années d'obtention.
  - Section **Contact** : mets à jour les liens LinkedIn et GitHub (actuellement `#`). L'email est déjà relié à `ninenicaisekeou@gmail.com`.
  - Chiffres clés dans le Hero (`data-target`) : ajuste les valeurs (années d'expérience, cas de test rédigés, etc.) à tes chiffres réels.
  - **Bouton WhatsApp flottant** (en bas à droite, tout le site) : remplace `https://wa.me/00000000000` par ton vrai numéro, format international sans le `+` ni espaces (ex. `https://wa.me/33612345678`).
  - **Bouton "Télécharger mon CV"** (dans le Hero) : remplace le fichier dans `assets/files/` par ton CV — le bouton pointe vers `assets/files/CV_Nine-Nicaise_KEOU_QA.pdf`.

- **`assets/css/style.css`** — variables de couleurs en haut du fichier (`:root`) si tu veux changer l'accent (vert QA par défaut) ou le thème.

- **`assets/js/app.js`** (application Vue.js) — propriété `roles` (`data()`) pour changer les mots qui défilent dans le titre, `stats` pour les chiffres clés du Hero, `form` pour le formulaire de contact.

## Déploiement gratuit

- **GitHub Pages** : pousse ce dossier dans un dépôt GitHub, active Pages sur la branche `main` (dossier racine).
- **Netlify / Vercel** : glisse-dépose le dossier sur netlify.com/drop, ou connecte le dépôt Git.

## Structure

```
APP MOBILE/
├── index.html          # contenu, structure et template Vue (directives v-*, {{ }})
├── README.md
└── assets/
    ├── css/
    │   └── style.css   # design (thème clair/sombre automatique)
    ├── js/
    │   └── app.js      # application Vue.js (menu, animations, compteurs, formulaire)
    └── files/
        └── CV_Nine-Nicaise_KEOU_QA.pdf
```

## Pourquoi Vue.js ici

Le HTML sert de template Vue directement dans le navigateur (pas de build,
pas de `.vue` à compiler) : les données (`data()`), les directives (`v-model`,
`v-for`, `v-reveal`) et les interpolations (`{{ }}`) remplacent les
manipulations manuelles du DOM (`document.getElementById`, etc.) qu'on aurait
en JavaScript natif. Deux directives personnalisées gèrent les animations au
scroll : `v-reveal` (apparition des sections) et `v-count-in-view` (compteurs
animés des chiffres clés).
