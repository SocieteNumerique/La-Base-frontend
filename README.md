# La Base - Frontend

## Installer le projet et développer localement

- installer node 18 (par exemple avec `nvm`)
- installer `yarn`
- installer les dépendances du projet : `yarn install`
- lancer le projet avec `yarn dev`

Le projet utilise Nuxt 3 et suit la structure de fichier standard.

## Déboguer les erreurs SSR en prod

En tant qu'utilisateur `moine` (`sudo su moine`):
`tail -f /var/log/telescoop/moine/frontend_supervisor.log`
