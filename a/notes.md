# Direction A, La Carte : notes

## Choix
- Territoire Swiss : filets 1 px (ocre foncé 25 %), une seule famille (Schibsted Grotesk), chiffres tabulaires en ocre, alignement à gauche, numéros de ligne 01 à 05.
- Adaptations de la fiche : fond crème #EEEBE6, accent unique ocre (#8A5214 texte/CTA, #A5671B gros chiffres et filets), pilules pour tous les boutons.
- Différenciateur : grille de filets plein écran qui se trace, H1 mot par mot, 4 cellules-tartes qui s'ouvrent (la grande déborde sur la ligne du titre).
- Le chiffre est un élément de composition : prix, heures 0/24/48/72, jours restants.
- Téléphone, WhatsApp/SMS et délai 72 h visibles au premier écran ; barre d'appel fixe sur mobile.

## Waouh
- Hero : filets (clip-path) puis H1 en masque de ligne (stagger 70 ms, expo.out), sous-titre/boutons/barre, puis 4 cellules en clip-path bas vers haut en cascade ; parallaxe souris 6 px (desktop, pointeur fin).
- Moment : règle horizontale en stroke-dashoffset (pathLength=1) liée au scroll normal, 4 graduations ; à chaque cran : number ticker, cellule photo dévoilée (commandée, préparée, emballée, retrait), dernier cran avec « Retrait à Cormeilles-en-Parisis » + bouton d'appel. Suite : compteur de jours avant le 12 décembre calculé par JS.
- Mobile : règle verticale à gauche, étapes empilées déclenchées une à une, grille hero en 2×2, pas de parallaxe.
- Signature : reveal masque bas vers haut 700 ms expo.out partout, filets tracés avant le contenu, ticker sur tous les chiffres.
- Pre-flight waouh.md §7 : tous cochés (pas d'épinglage, pas d'écouteur scroll, matchMedia, reduced-motion, contenu visible sans JS via classe .js + repli CSS à 5 s, dimensions explicites, image LCP préchargée).

## Écarts au brief
- Aucun. Seule nuance : le H1 passe sur 2 lignes + sous-niveau à ~3,9 vw (au lieu de ~5 vw) pour tenir dans la colonne.

## Textes d'interface hors content.md
Navigation : La carte, Sur commande, Je suis Sonia, Questions ; Aller au contenu ; Commandée/Préparée/Emballée/Retrait ; h ; jours restants avant le 12 décembre ; titres de section « La carte du moment », « Retours de clients », « Questions fréquentes », « Je suis Sonia » ; « À partir de », « Par téléphone », « Voir » ; Appeler / WhatsApp / SMS (barre mobile) ; « Ne pas remplir » (honeypot) ; « * Champs obligatoires » ; message de confirmation du formulaire ; « Mentions légales · Politique de confidentialité : pages à compléter. © 2026 Fleur de Racine » ; textes alt.

## Contenu manquant (placeholders)
Logo vectoriel (SVG provisoire) ; photo des pièces cocktail ; photo haute qualité du souchet ; accord de Sonia pour les 3 avis ; mentions légales et politique de confidentialité ; photos 720 px non agrandies (hero 4 cellules, étapes) à remplacer par des originaux.

## Sortie de check_proposition.py
[MINEUR  ] placeholders: 5 placeholder(s) à remplacer : PLACEHOLDER: logo vectoriel à fournir par Sonia (trois feuilles + FLEUR DE RACINE en serif fine espacée) | PLACEHOLDER: photo des pièces cocktail à fournir par Sonia | PLACEHOLDER: photo d'origine haute qualité du souchet, à fournir par Sonia | PLACEHOLDER: accord de Sonia à obtenir pour publier ces trois retours | PLACEHOLDER: mentions légales et politique de confidentialité à rédiger (SIRET, nom de famille, hébergeur fournis par Sonia)
-- 0 bloquant(s), 0 majeur(s), 1 mineur(s)

## Captures
capture.js : 0 bloquant, 0 majeur, 0 mineur ; mouvement 1440 px et 375 px : 23 animations, 5 ScrollTrigger.
Corrections à la vue : débordement à 320 px (pilule tel : logo et pilule réduits) ; collage hero cassé (variable CSS auto-référente) ; deux-points du H1 seul sur une ligne (collé au mot) ; collage passé au-dessus du bloc titre ; liste « Je suis Sonia » écrasée (pseudo-élément en trop) ; colonne du titre élargie.

## Correctifs QA (boucle unique)
- Hero qui se transforme au scroll normal, sans épinglage : le titre et les petites cellules s'estompent, la grande cellule grandit (desktop), puis une section plein cadre (`hero-full.webp`, même photo 888512533) s'ouvre par clip-path depuis la forme de la cellule jusqu'à tout l'écran, avec la légende « Là où naît le goût. ». Mobile : même ouverture clip-path, sans agrandissement de cellule.
- Dominante lilas-bleutée de hero-1.webp corrigée (gain R 1,10 / V 1,03 / B 0,88 ; marbre mesuré 181,183,209 vers 199,188,184).
- La classe `js` n'est posée par script.js que si GSAP et ScrollTrigger sont chargés ; repli CSS de 5 s supprimé ; contenu visible sans JS.
- Tous les :hover sous @media (hover:hover) ; touch-action:manipulation sur boutons, pilule, liens de nav, summary.
- og:image + twitter:image = img/og.jpg (1200x630) ; chemin relatif, à passer en URL absolue au déploiement.
- Dernières sorties : check_proposition.py 0 bloquant / 0 majeur / 1 mineur (placeholders) ; capture.js 0 / 0 / 0.
