import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    routes: [
      {
        id: '1',
        slug: 'sporen-uit-een-roerig-verleden',
        title: 'Sporen uit een roerig verleden',
        subTitle: '2 Themaroutes',
        type: 'fietsen',
        group: [
          {
            id: 'a1',
            slug: 'herinneringsroute-gilze-en-rijen',
            title: 'Herinneringsroute Gilze en Rijen',
            subTitle: '3 km',
          },
          {
            id: 'a2',
            slug: 'dodendraadroute',
            title: 'Dodendraadroute',
            subTitle: '12 km',
          }
        ]
      },
      {
        id: '2',
        slug: 'boomkikkerpad',
        title: 'Boomkikkerpad',
        subTitle: '5 km',
        type: 'lopen',
        group: null
      }
    ]
  },
  mutations: {

  },
  actions: {

  }
})
