# Direction c — « Le Carnet »

## Choix
- Lo-Fi : papier #EDE4CF, crème de Sonia en bordures de polaroids/étiquettes, ocre unique, bordeaux = tampon décoratif.
- Georgia bold italique (titres), Courier New (étiquettes, prix), Helvetica/Arial (légendes) ; Mrs Saint Delafield pour le seul mot « Sonia ».
- Différenciateur au premier écran : H1 sur étiquette inclinée (-2°) + 7 polaroids tenus par du ruban or/rose + tampon à trois feuilles.
- Misregistration riso remplacée par un décalage 2 px rose sur « souchet ». Halftone limité aux 3 cartes Noël.
- « Carton » (#D9C8A4) = teinte dérivée du papier et du brun pour les bandes (réassurance, retrait).

## Waouh
- Hero : étiquette collée (pop), sous-titre à la machine à écrire (clip-path, steps), 7 polaroids qui tombent en cascade avec rebond puis float 4 px ; hover : redressement + Vanilla Tilt (desktop).
- Moment : « Bûches de Noël 2026 », 3 cartes, trame halftone pré-rendue (build_images.py, Pillow) qui s'éteint au scroll (scrub décalé par carte), ruban 6° -> 2°, compteur « jusqu'au 12 décembre 2026 » tapé. Sans épinglage. Mobile : une carte pleine largeur à la fois, même mécanique.
- Signature : tout se pose (pop in + rotation finale), float léger, rubans.
- Pre-flight §7 : coché (hero non split immobile, scène scroll OK, reduced-motion, contenu visible sans JS, pas d'écouteur scroll, transform/opacity). Réserve : sur mobile, 4 polaroids + tampon, le sous-titre passe sous la ligne de flottaison (téléphone en pilule + barre d'appel visibles).

## Écarts au brief
- Mobile : H1 plus polaroids avant le sous-titre (ordre inversé) pour garder le waouh au premier écran.
- H1 sur 3-4 lignes (texte de content.md non raccourci).

## Textes d'interface hors content.md
Navigation (La carte, Noël, Sonia, Commander) ; H2 « La carte du moment », « Je suis Sonia », « Questions fréquentes » ; Aller au contenu ; * Champs obligatoires ; confirmation du formulaire « Merci, votre demande est bien notée. Sonia vous rappelle. » ; « Appeler » / « WhatsApp / SMS » (barre mobile) ; © 2026 ; lignes de prix des cartes (reprise de content.md) ; alt.

## Contenu manquant
Logo vectoriel ; photo pièces cocktail ; photos des bûches Mangue Coco & Citron vert et Vanille & Caramel (placeholders = entremets mangue, gâteau fruits rouges) ; accord portrait ; accord avis ; pages mentions légales et confidentialité (liens vers #bas).

## Sortie de check_proposition.py
[MINEUR  ] placeholders: 5 placeholder(s) à remplacer : PLACEHOLDER: logo vectoriel à fournir par Sonia (trois feuilles + FLEUR DE RACINE en serif fine espacée) | PLACEHOLDER: photo des pièces cocktail à fournir par Sonia | PLACEHOLDER: photo d'origine haute qualité du souchet, à fournir par Sonia | PLACEHOLDER: accord de Sonia à obtenir pour publier ces trois retours | PLACEHOLDER: mentions légales et politique de confidentialité à rédiger (SIRET, nom de famille, hébergeur fournis par Sonia)
-- 0 bloquant(s), 0 majeur(s), 1 mineur(s)

## Captures (capture.js)
[MINEUR  ] image_non_chargee: image pas chargée après 10 s : img/pol3.webp
[MINEUR  ] image_non_chargee: image pas chargée après 10 s : img/pol5.webp
[MINEUR  ] image_non_chargee: image pas chargée après 10 s : img/pol6.webp
mouvement 1440px : 31 animation(s) vue(s), 7 ScrollTrigger
mouvement 375px : 30 animation(s) vue(s), 7 ScrollTrigger
-- 0 bloquant(s), 0 majeur(s), 3 mineur(s) ; captures : g:\Mon Drive\Gestion Sites\clients\sonia\design\propositions\c\captures
Corrections faites à la vue : débordement 768 (grille avis 3 colonnes seulement dès 1024), débordement 320/375 (en-tête mobile compacté), polaroids remontés sous le H1 sur mobile, barre d'appel (WhatsApp / SMS sur une ligne). Les 3 images « non chargées » sont pol3/5/6, masquées en mobile et lazy : voulu.
