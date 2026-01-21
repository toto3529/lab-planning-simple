# planifyLab — Laboratoire (Version SIMPLE)

## Objectif

Implémenter `planifyLab(data)` : un algorithme de planification pour un laboratoire médical
(version SIMPLE).

Le but est de produire :

- un planning chronologique d’analyses (schedule[])
- des métriques (metrics) calculées à partir du planning

Contraintes principales (version SIMPLE) :

- Priorités : STAT > URGENT > ROUTINE
- Compatibilités :
  - technicien ↔ type d’échantillon
  - équipement ↔ type d’échantillon
- Disponibilités :
  - pas de double booking (technicien / équipement)
  - respect des horaires des techniciens
- Règle STAT :
  - un échantillon STAT doit être terminé dans les 60 minutes suivant son arrivée
- Chronologie :
  - planning ordonné par heure de début

---

## Prérequis

- Node.js (LTS recommandé)
- npm

---

## Installation

npm install

---

## Utilisation

npm run dev

Lance le runner en mode développement :

- exécute les exemples officiels fournis par l’énoncé
- exécute des tests de validation custom (règles métier)

npm run build

Compile le projet TypeScript vers JavaScript dans le dossier dist/.

npm run start

Exécute la version compilée du projet.

---

## Structure du projet

src/
├─ index.ts // Runner (exécution des exemples + validations)
├─ planifyLab.ts // Algorithme de planification (version SIMPLE)
├─ types.ts // Types métier (Input, Output, Sample, Technician, etc.)
├─ time.ts // Helpers temps (HH:MM ↔ minutes)
├─ metrics.ts // Calcul des métriques à partir du planning
└─ examples/
├─ official/ // Exemples fournis par l’énoncé
└─ custom/ // Cas de test ajoutés (validations métier)

---

## Fonction principale

planifyLab(inputData) → { schedule, metrics }

### Comportement

- Trie les échantillons par priorité puis heure d’arrivée
- Assigne un technicien et un équipement compatibles
- Calcule le prochain créneau disponible sans conflit
- Applique la règle STAT < 1h
- Produit un planning chronologique
- Calcule les métriques à partir du planning final

En cas d’impossibilité (aucune ressource compatible, dépassement horaires,
contrainte STAT impossible), la fonction lève une erreur explicite.

### Gestion des erreurs

Dans la version SIMPLE, l’algorithme adopte une stratégie "fail fast".

Un appel à `planifyLab` lève une erreur explicite dans les cas suivants :

- Aucun technicien compatible trouvé pour un échantillon
- Aucun équipement compatible ou disponible
- Dépassement des horaires de travail d’un technicien
- Impossibilité de respecter la contrainte STAT (< 60 minutes)

Ces erreurs sont considérées comme des échecs de planification valides
et sont volontairement gérées par des exceptions.

---

## Métriques (version SIMPLE)

- totalTime :
  - durée entre le début de la première analyse planifiée
  - et la fin de la dernière analyse
- efficiency :
  - (somme des durées d’analyses / totalTime) \* 100
  - les durées s’additionnent même en cas de parallélisme
- conflicts :
  - toujours 0 (les conflits sont évités par l’algorithme)

---

## Tests et validation

### Exemples officiels

Les 3 exemples fournis par l’énoncé sont exécutés automatiquement par le runner.

### Tests custom

Des cas supplémentaires ont été ajoutés pour valider les règles métier :

- Violation de la règle STAT < 1h → erreur attendue
- Respect de la règle STAT < 1h avec un planning valide
- Scénario complet "happy path" (version SIMPLE) :
  - mélange de STAT / URGENT / ROUTINE
  - parallélisme sur plusieurs ressources
  - utilisation de techniciens spécialisés et GENERAL
  - respect strict de la règle STAT < 60 minutes
  - absence de conflits (technicien / équipement)
  - calcul cohérent des métriques (totalTime, efficiency)

Ces tests permettent de vérifier le comportement de l’algorithme au-delà
des cas nominaux.

---

## Runner et validation

Le projet inclut un runner TypeScript dédié, exécuté via `npm run dev`.

Responsabilités du runner :

- Exécuter les exemples officiels fournis par l’énoncé
- Comparer automatiquement les plannings et métriques obtenus aux résultats attendus
- Exécuter des tests custom de validation métier
- Vérifier les cas d’erreur attendus (throws)
- Fournir un retour lisible en console (PASS / FAIL)

La logique du runner est volontairement séparée de l’algorithme
afin de garder `planifyLab` indépendant et facilement testable.

---

## Périmètre

Cette implémentation se limite strictement aux règles et contraintes explicitement définies
dans l’énoncé de la version SIMPLE, sans ajout d’hypothèses ou de comportements non demandés.
