<template>
  <footer id="footer" class="fr-footer fr-mt-15w" role="contentinfo">
    <div class="fr-container">
      <div class="fr-footer__body">
        <img
          alt="logo du site"
          src="/logos/anctMarianne.png"
          style="height: 80px"
        />
        <img
          alt="logo du site"
          class="fr-mr-n3v"
          src="/logos/financeUE.jpg"
          style="height: 80px"
        />
        <div class="fr-footer__content">
          <p class="fr-footer__content-desc">
            La Base regroupe les ressources des professionnels du numérique
            d’intérêt général dont l’inclusion et la médiation numériques.
          </p>
          <ul class="fr-footer__content-list">
            <li class="fr-footer__content-item">
              <a
                class="fr-footer__content-link"
                href="https://legifrance.gouv.fr"
                >legifrance.gouv.fr</a
              >
            </li>
            <li class="fr-footer__content-item">
              <a class="fr-footer__content-link" href="https://gouvernement.fr"
                >gouvernement.fr</a
              >
            </li>
            <li class="fr-footer__content-item">
              <a
                class="fr-footer__content-link"
                href="https://service-public.fr"
                >service-public.fr</a
              >
            </li>
            <li class="fr-footer__content-item">
              <a class="fr-footer__content-link" href="https://data.gouv.fr"
                >data.gouv.fr</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="fr-footer__bottom">
        <ul class="fr-footer__bottom-list">
          <!--          <li class="fr-footer__bottom-item">-->
          <!--            <a class="fr-footer__bottom-link" href="#">Plan du site</a>-->
          <!--          </li>-->
          <li class="fr-footer__bottom-item">
            <span class="fr-footer__bottom-link">
              Accessibilité : partiellement conforme
            </span>
          </li>
          <li class="fr-footer__bottom-item">
            <NuxtLink
              to="/page/mentions-legales"
              class="fr-footer__bottom-link"
            >
              Mentions légales
            </NuxtLink>
          </li>
          <li class="fr-footer__bottom-item">
            <NuxtLink to="/page/charte" class="fr-footer__bottom-link">
              Charte
            </NuxtLink>
          </li>
          <li class="fr-footer__bottom-item">
            <NuxtLink to="/page/contact" class="fr-footer__bottom-link">
              Contact
            </NuxtLink>
          </li>
          <!--          <li class="fr-footer__bottom-item">-->
          <!--            <a class="fr-footer__bottom-link" href="#">Données personnelles</a>-->
          <!--          </li>-->
          <!--          <li class="fr-footer__bottom-item">-->
          <!--            <a class="fr-footer__bottom-link" href="#">Gestion des cookies</a>-->
          <!--          </li>-->
          <li class="fr-footer__bottom-item">
            <a
              href="https://github.com/SocieteNumerique/"
              class="fr-footer__bottom-link"
              target="_blank"
            >
              Code source
            </a>
          </li>
        </ul>
        <div class="fr-footer__bottom-copy">
          <p>
            Sauf mention contraire, tous les contenus de ce site sont sous
            <a
              href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
              target="_blank"
              >licence etalab-2.0</a
            >
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="sass">
.fr-footer__top
  display: none
</style>
