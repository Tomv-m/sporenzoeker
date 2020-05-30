const CURRENT_PROJECT = process.env.VUE_APP_CURRENT_PROJECT

const getSiteName = () => {
  switch (CURRENT_PROJECT) {
    case 'sporenzoeker':
      return 'Sporenzoeker'
    case 'oranjenassau':
      return 'Het Oranje-Nassau Pad'
    default:
      return ''
  }
}
export const siteName = getSiteName()

const getSiteDesc = () => {
  switch (CURRENT_PROJECT) {
    case 'sporenzoeker':
      return 'Ontdek met Sporenzoeker de Toerlezjoere-regio tussen Breda, Tilburg en de Belgische grens. Je vind hier onze favoriete fiets- en wandelroutes. Ervaar onderweg de omgeving, ontdek verrassende uitstapjes en geniet van een lekkere hap tussendoor of een heerlijk diner. Liever zonder telefoon erop uit? Verken het gebied met de brochure verkrijgbaar bij de leden van Toerlezjoere, deze zijn te vinden op de plattegrond en herkenbaar aan het schildje op de gevel. Beleef Toerlezjoere, ’t goeie van Brabant…'
    case 'oranjenassau':
      return 'Welkom op de website van Het Oranje-Nassau Pad'
    default:
      return ''
  }
}
export const siteDesc = getSiteDesc()

export const isOranjenassau = CURRENT_PROJECT === 'oranjenassau'

export const homeRoute = isOranjenassau ? '/alle-acht-de-etappes' : ''

// Firebase Collections
export const routeDataCollection = isOranjenassau ? 'route-data-honp' : 'route-data'
export const routesCollection = isOranjenassau ? 'routes-honp' : 'routes'
