# planifyLab — Laboratoire (Version SIMPLE)

## Objectif

Implémenter `planifyLab(data)` : un algorithme de planification pour un laboratoire médical (version **SIMPLE**).

Le but est de produire :

- un **planning chronologique** d’analyses (`schedule[]`)
- des **métriques** (`metrics`) calculées à partir du planning

Contraintes principales (version SIMPLE) :

- **Priorités** : `STAT > URGENT > ROUTINE`
- **Compatibilités** : technicien ↔ type d’échantillon, équipement ↔ type d’échantillon
- **Disponibilités** : pas de double booking (technicien / équipement), techniciens selon horaires
- **Chronologie** : planning ordonné par heure de début

---

## Prérequis

- Node.js (LTS recommandé)
- npm

---

## Installation

```bash
npm install
```

## Scripts

Le projet fournit plusieurs scripts npm pour faciliter le développement et l’exécution.

```bash
npm run dev
```

Lance le projet en mode développement (TypeScript exécuté directement).

```bash
npm run build
```

Compile le projet TypeScript vers JavaScript dans le dossier `dist/`.

```bash
npm run start
```

Exécute la version compilée du projet (après `npm run build`).

---

## Structure du projet

```txt
src/
├─ index.ts          // Runner minimal (point d’entrée du projet)
├─ planifyLab.ts     // Fonction principale planifyLab(data) (stub à ce stade)
├─ types.ts          // Types métier (Sample, Technician, Equipment, ScheduleEntry, Metrics)
├─ time.ts           // Helpers temps (conversion HH:MM ↔ minutes)
├─ metrics.ts        // Calcul des métriques à partir du planning
```

> Note : le projet est volontairement minimal à ce stade.  
> L’objectif est de valider la base technique, le typage et les outils transverses avant d’implémenter la logique de planification.

---

## TODO / Étapes à venir (non exhaustif)

- Ajouter les exemples officiels fournis par l’énoncé
- Mettre en place un runner de validation local
- Implémenter une première version **SIMPLE** de l’algorithme `planifyLab`
- Comparer automatiquement les résultats obtenus avec les outputs attendus
- Documenter les règles implémentées et les limites connues
