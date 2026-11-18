# Direction b — « Racine » (Fleur de Racine)

## Choix
- Territoire Organic : galets (border-radius à 8 valeurs), sable/terre, grain 4 %, arrondis 24-32 px, boutons pilule.
- Palette de la fiche (crème, sable, terre #2F1B0E en bascule unique, ocre #7A4A12 texte/CTA, #A5671B trait, or, mousse en liseré, rose en micro-pastille sur la mangue).
- Fraunces (300-400, italique ocre pour « souchet ») + Epilogue, font-display swap.
- Différenciateur visible au premier écran : galet-photo du souchet qui déborde en bas, respiration 6 s.
- Racine : trait ocre unique qui relie Togo, souchet, carte, bûches et finit en trois feuilles.

## Waouh
- Hero : H1 mot par mot (CSS pur), galet qui respire ; au scroll (scrub, sans épinglage, 55 % de la hauteur d'écran) le galet grandit (x2,6, recentré) jusqu'au plein cadre, textes et réassurance s'estompent, la photo repart par le haut.
- Racine : SVG pleine hauteur, chemin construit en JS depuis la position des nœuds, stroke-dashoffset en scrub, radicelles à chaque nœud, section « histoire » en terre (seule bascule sombre), trois feuilles qui s'ouvrent une à une à la fin.
- Mobile : galet 64vw sous le H1, grandit jusqu'au plein cadre ; racine verticale à gauche, plus fine ; barre Appeler + WhatsApp/SMS fixe.
- Signature : ease cubic-bezier(.22,.8,.3,1), révélations origin-aware (IntersectionObserver), float idle sur les galets.
- Pre-flight §7 : tous cochés (curseurs, hero, scène, mouvement, raisons, reduced-motion, contenu visible sans JS, mobile, image preload + dimensions, familles de mise en page variées, 1 thème/1 accent, vrais visuels).

## Écarts au brief
- H1 sur 3 lignes à 1440 px (texte non raccourci).
- Zoom du galet x2,6 (au lieu de ~2,2) pour que les angles arrondis sortent de l'écran.
- Q6 « Le souchet, c'est quoi ? » est placée au nœud souchet, donc absente de la FAQ (5 questions).
- Pas de préchargement de la fonte Fraunces (URL gstatic inconnue en file://) ; preload de l'image hero fait.
- Mentions légales / confidentialité : liens vers #footer (pages absentes).

## Textes d'interface hors content.md
Aller au contenu ; libellés de nav (Pourquoi nous, La carte du moment, Bûches de Noël 2026, Demander ma commande) ; titres H2 « Pourquoi nous », « Avis », « Retrait et livraison », « Questions fréquentes » ; « Appeler », « WhatsApp / SMS » (barre mobile) ; « * Champs obligatoires » ; message de confirmation du formulaire ; © 2026 Fleur de Racine ; textes alt.

## Contenu manquant (placeholders)
Logo vectoriel (header + trois feuilles) ; photos dédiées des 3 bûches 2026 (chocolat = vraie bûche, mangue et vanille = gâteaux de remplacement) ; mentions légales et politique de confidentialité ; accord de publication des avis et du portrait.

## Sortie de check_proposition.py
-- 0 bloquant(s), 0 majeur(s), 1 mineur(s) (mineur : 6 placeholders à remplacer, voulus)

## Captures
Sortie capture.js : mouvement 1440px : 65 animations, 7 ScrollTrigger ; 375px : 25 animations, 7 ScrollTrigger ; -- 0 bloquant(s), 0 majeur(s), 0 mineur(s).
Corrigé à la vue : (1) la racine passait sous la section terre (z-index) ; (2) elle traversait le texte des bûches en repartant vers la gauche : ajout d'un point de passage sous la section Noël ; (3) fin du trait calée sur la base des feuilles.
