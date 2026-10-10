# Écrire ou étoffer une page de « Home Cost Ledger » (us-home-costs)

Notice pour les agents qui écrivent ou prolongent le site. À lire en entier avant d'écrire, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §6, §6.5, §7, §9, §9.3, §11, §17.4, §21, §26).

Le site : coût des travaux de la maison par État (toit, chauffe-eau, CVC, pompe à chaleur, clôture, terrasse,
déménagement), calculateurs de quantités (béton, surface, gravier, paillis, peinture, plaques de plâtre,
toiture) et énergie (électricité, recharge VE, chauffage, solaire). **Anglais américain seul**, sous `/en/`.
Dollars, `$` devant, virgule des milliers. Éditeur : la société **Radif Partners** (jamais un nom de
personne, ni photo, ni INSEAD, ni Mines, ni LinkedIn). Aucun lien vers un autre site du portefeuille
(`_trame/domaines-ovh.txt`), jamais « taxineo ».

**L'angle du site** : le prix s'affiche tout de suite, sans code postal, sans téléphone, sans formulaire.
Les sites concurrents (Angi, HomeBuddy, roofingcalculator.com…) sont des générateurs de leads.

## D'où viennent les chiffres (règle 5 : rien d'inventé)

| Donnée | Source | Fichier |
|---|---|---|
| Prix payés pour un chantier fait par un professionnel (p25, médiane, p75), par division et par taille de maison pour le toit | Census/HUD, American Housing Survey 2023 (PUF v1.1), chantiers 2021-2023, ramenés en dollars d'août 2026 par le CPI-U | `src/data/ahs.json` |
| Salaires horaires par métier et par État | BLS OEWS mai 2025 (publié le 15 mai 2026) | `src/data/wages.json` |
| Part matériaux, salaires, avantages, sous-traitance par type d'entreprise | Census, Economic Census 2022 (EC2223BASIC, EC2248BASIC) | `src/data/shares.json` |
| Électricité, gaz, propane, fioul, essence, consommation moyenne | EIA (EPM 5.6.B jan.-juil. 2026, EIA-861 2024, prix saison oct. 2025-mars 2026), RECS 2020 | `src/data/energy.json` |
| Production solaire par kW, dispersion des prix NY, puissance médiane des panneaux | NLR PVWatts v8 (10 États : la clé DEMO_KEY ne permet que 10 appels par jour), sinon NASA POWER × ratio de performance calé sur PVWatts (écart max 10 %) ; NYSERDA (data.ny.gov) | `src/data/solar.json` |
| Aléas FEMA (pertes annuelles attendues), licence de couvreur, code du bâtiment | FEMA NRI déc. 2025, sites officiels des États | `src/data/state-facts.json` (dossier complet : `research/state-facts.json`) |
| Constantes (rendement des sacs, couverture peinture, bundles par square, densités, rendements énergétiques, prix solaires EnergySage, sources) | fiches fabricants, DOT, extension universitaire, eCFR, NLR | `src/data/params-2026.json` |

`scripts/build-data.py` reconstruit les cinq premiers fichiers (bruts dans `.cache-raw/`, hors dépôt).

**Méthode du prix d'un chantier** (`src/lib/engine/costs.ts`) : quartiles nationaux AHS × niveau de la
division Census (médiane division ÷ médiane nationale, si ≥ 60 chantiers) × ((1 − L) + L × salaire État ÷
salaire division), L = (salaires + avantages) ÷ valeur des travaux de l'Economic Census.

## Les fichiers d'une page

| Page | Fichier | Route |
|---|---|---|
| Calculateur (outil + texte) | `src/content/pages/<id>.ts` (`definePage`) | `/en/<slug>/` |
| Coût du toit dans un État | `src/content/states/<slug>.ts` (`defineState`) | `/en/roof-replacement-cost/<slug>/` |
| Accueil | `src/content/home.ts` | `/en/` |

Modèles : `src/content/pages/roof-replacement-cost.ts` et `src/content/states/texas.ts`. Copier la
**structure**, jamais les phrases.

Le composant affiche seul : le calculateur (`tool`), le chapeau replié (`resume`, première phrase visible),
le corps (`body`), la FAQ, les pages liées, les sources. Sur une page d'État, il affiche aussi la bande de
chiffres, le calculateur verrouillé sur l'État et trois tableaux générés (prix par taille de maison, autres
chantiers, salaires des métiers) : **la prose ne les répète pas**.

### Champs d'une page calculateur (`definePage`)

| Champ | Règle |
|---|---|
| `id` = `slug` = nom du fichier | minuscules et tirets, sans année |
| `group`, `order` | `costs`, `materials` ou `energy` ; place dans le menu |
| `title` | 50 à 60 caractères, contient 2026, **le terme-clé en tête** (« Concrete Calculator 2026: … ») ; jamais How/What/Is ni le pays en tête ; pas de tiret cadratin ; unique |
| `description` | 150 à 160 caractères, contient 2026 et un chiffre tiré des données ; unique |
| `h1`, `intro`, `nav`, `card` | H1 sans année ; une phrase ; libellé court ; une phrase pour les cartes |
| `resume` | **UN** paragraphe de 120 mots ou plus (viser 130 à 170) : la réponse à la requête avec les chiffres ; la première phrase porte le message (elle seule est visible avant « Read the full answer ») |
| `body(h)` | HTML : `h2`, `h3`, `p`, `ul`, `h.table(...)`. **≥ 450 mots de prose hors tableaux** (viser 500 à 650) |
| `faqs` | 4 à 8 vraies questions, réponses de **45 à 85 mots** (le test compte 42 à 88), chiffre + condition + source, uniques sur tout le site |
| `tool` | le calculateur de la page (déjà câblé dans `src/components/Tool.astro`) |
| `related` | 3 à 6 ids existants |
| `sources` | ≥ 3 clés de `params-2026.json > sources` |

### Champs d'une page d'État (`defineState`)

| Champ | Règle |
|---|---|
| `title` | 50 à 60 car., commence par « Roof Replacement Cost <State> 2026: » (ou l'abréviation si trop long) |
| `description` | 150 à 160 car., 2026, au moins un chiffre calculé |
| `intro` | une phrase propre à l'État |
| `resume` | un paragraphe ≥ 120 mots, chiffres calculés avec le kit |
| `body(h)` | **≥ 300 mots de prose** écrite pour cet État seulement (viser 350 à 500) : ce qui est singulier (aléas FEMA dominants, licence si confirmée, code si confirmé, salaire, taille de maison), un exemple chiffré avec le kit. Deux ou trois `h2`/`h3` **propres à l'État** (pas le même titre d'un État à l'autre). Optionnel : `${h.mini('wageGap', {...})}` |
| `faqs` | 3 à 5 questions **contenant le nom de l'État**, réponses 45 à 85 mots, uniques |
| `related` | 3 à 6 ids : `roof-replacement-cost`, des États voisins (`roof:oklahoma`), un calculateur |
| `extraSources` | les pages officielles lues pour l'État (licence, code) : `{ name, url }` tirés de `research/state-facts.json` |

## La règle des chiffres (non négociable)

Aucun montant, taux, salaire ou date présent dans les données n'est tapé en dur : il se lit avec le kit
(`src/lib/kit.ts`, importé `KIT as K`, et passé au corps sous `h`).

```ts
const r = K.job('roof', 'ohio');            // { low, typical, high, region, index, L, parts, basis, factor }
const big = K.job('roof', 'ohio', 3000);    // même chose pour une maison de 3 000 à 3 999 sq ft
const w = K.wage('ohio', 'roofers');        // { mean, p25, median, p75, emp, lq } ou null
const n = K.natWage('roofers');
const f = K.facts('ohio');                  // f.nri.hail.rating, f.nri.hail.buildingLossUsd, f.licensing, f.code
K.elec('ohio'); K.usage('ohio'); K.gas('ohio'); K.propane('ohio'); K.recs('ohio', 'gas');
K.usd(x), K.usd(x, 2), K.num(x), K.pct(0.379) → "37.9%", K.day(iso), K.month('2026-08'), K.cents(16.06)
```

Métiers : `roofers, plumbers, hvac, electricians, painters, drywall, cement, laborers, carpenters, fence,
solar, landscaping, movers`. Chantiers : `roof, waterHeater, centralAc, heating, fence, deckPatio, driveway`.

Dans `body(h)` : tout le kit, plus `h.a(id, texte)` (lien interne, un id inconnu fait échouer le test),
`h.table(entêtes, lignes, légende, alignements)`, `h.src(clé, texte)` (source officielle), `h.ext(url, texte)`,
`h.box(titre, html)`, `h.mini(kind, arg)`.

**FEMA NRI** : au niveau des États, l'indice publie des **pertes annuelles attendues** (score 0-100 et
classe, et la perte en dollars sur les bâtiments), pas un « risque » : écrire « expected annual losses to
buildings rated Very High ». **Licence** : n'écrire que ce que dit `licensing.summary` (et citer l'URL dans
`extraSources`) ; si `licensing` est `null`, ne rien affirmer sur la licence. Idem pour `code`.

Un chiffre absent des données ne s'écrit pas, sauf lu vous-même sur une source officielle : alors citez-la
avec `h.ext(url, …)` et signalez-le dans votre compte rendu.

## Ton et langue

- Anglais américain, voix humaine, phrases de longueur variable, **le chiffre d'abord**.
- Interdits (le test les refuse) : tirets cadratin et demi-cadratin, « it's important to note », « dive into »,
  « delve », « whether you're », « navigate the », « Moreover », « Additionally », « Furthermore »,
  « game changer », « unlock ». Pas de triplets en série, pas de conclusion qui résume, pas d'émoji.
- Honnêteté : une fourchette, jamais une promesse ; « an estimate », « a written quote decides ».
- **Unicité** (§6) : `check-unique` compare toutes les pages, chiffres neutralisés, seuil 30 %. Écrire ce
  qui n'appartient qu'à la page, avec un vocabulaire propre ; ouvrir le corps sur ce que l'État ou le sujet a
  de plus rare. Aucune tournure reprise d'une autre page ni d'un autre site du portefeuille
  (`check-portefeuille`).

## Contrôles

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/us-home-costs
PAGE_FILES=roof:ohio,paint-calculator npx vitest run tests/pages.test.ts   # vos pages
npx vitest run                                                              # tout
export NODE_PATH=$(npm root -g):$PWD/node_modules
npm run build && S=~/Documents/GitHub/_trame/_template/scripts
python3 $S/check-seo.py . ; python3 $S/check-trame.py . ; python3 $S/check-unique.py dist
python3 $S/check-simulateurs.py . ; python3 $S/check-regles.py . ; python3 $S/check-portefeuille.py .
node $S/check-sources.mjs . ; node scripts/check-legal.mjs ; node $S/check-contraste.mjs dist
node $S/check-saisie.mjs dist --max=60 ; node $S/check-nombres.mjs dist ; node scripts/typo-nbsp.mjs dist --check
node $S/check-layout.mjs dist > /tmp/layout-uhc.log 2>&1   # long
```

Arrêter un serveur par son port (`lsof -ti tcp:4423 | xargs kill`), jamais `pkill -f`.

## Compléter PVWatts

`scripts/pvwatts-fetch.sh` (villes : `research/solar/cities.tsv`) récupère un État toutes les 6 minutes et saute ceux déjà présents dans `.cache-raw/pvwatts/`. Avec DEMO_KEY, 10 États par jour ; avec une clé gratuite NLR (à demander par l'éditeur), tout en une heure. Puis `python3 scripts/build-data.py` : chaque État passe de `nasa-power` à `pvwatts`.

## Mise à jour annuelle

1. Mai : nouvelle vague OEWS → `DOWNLOADS` de `scripts/build-data.py` (`oesm26st.zip`…), `released`.
2. AHS 2025 (publication prévue en 2026-2027) : remplacer le PUF, vérifier les codes `JOBTYPE`.
3. EIA : relancer le script chaque mois si besoin (tableaux mis à jour en place).
4. `params-2026.json` → `params-2027.json` : relire chaque source et `retrieved_at`.
5. `npx vitest run`, puis tous les contrôles.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de DNS sans validation de l'éditeur.
- Ne pas toucher à `_trame` ni à la RECETTE ; suggestions dans le compte rendu.
- `ADS_ENABLED`/`CLARITY_ID` : laissés vides tant que l'éditeur n'a pas décidé.
