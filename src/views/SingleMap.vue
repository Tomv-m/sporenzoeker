<template>
  <Route  
    :route="route"
  />
</template>

<script>
import Route from '@/components/subViews/Route'

export default {
  name: 'SingleMap',
  components: {
    Route
  },
  data () {
    return {
      route: { file: "herinneringsroute", title: "Herinneringsroute Gilze en Rijen", subTitle: "29.8 km", type: 'fietsen' }
    }
  }
}
</script>