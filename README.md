# La Base - Frontend

## Installer le projet et développer localement

- installer node 18 (par exemple avec `nvm`)
- installer `yarn`
- installer les dépendances du projet : `yarn install`
- lancer le projet avec `yarn dev`

Le projet utilise Nuxt 3 et suit la structure de fichier standard.

### `pre-commit` et tests automatiques

[`pre-commit`](https://pre-commit.com/) est un outil qui permet à chaque commit de
vérifier qu'un certain nombre de règles soient respectées : lint, syntaxe...

Une fois `pre-commit` installé globalement sur votre PC, lancer `pre-commit install`
pour activer les vérifications automatiques à chaque commit.

Ce dépôt ne contient pas de test automatique.

## Déboguer les erreurs SSR en prod

En tant qu'utilisateur `moine` (`sudo su moine`):
`tail -f /var/log/telescoop/moine/frontend_supervisor.log`
