export default defineNuxtPlugin((nuxtApp) => {
  if (
    process.env.NODE_ENV == "development" ||
    window.location.host.startsWith("preprod")
  ) {
    console.log("no tracking in developement/preprod")
    return
  }
  // set up tracking
  const _paq = (window._paq = window._paq || [])
  _paq.push(["trackPageView"])
  _paq.push(["enableLinkTracking"])
  _paq.push(["enableHeartBeatTimer"])
  ;(function () {
    const u = "https://labaseanct.matomo.cloud/"
    _paq.push(["setTrackerUrl", u + "matomo.php"])
    _paq.push(["setSiteId", "1"])
    const d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0]
    g.async = true
    g.src = "//cdn.matomo.cloud/labaseanct.matomo.cloud/matomo.js"
    s.parentNode.insertBefore(g, s)
  })()

  // track path changes
  nuxtApp.$router.afterEach(() => {
    _paq.push(["trackPageView"])
  })
})
