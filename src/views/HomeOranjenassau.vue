<template>
  <div class="oranjenassau-home">
    <Headful
        :title="`${siteName} | Home`"
        :description="siteDesc"
    />
    <a class="oranjenassau-home__link" href="https://toerismedebaronie.nl/oranjenassaupad/" target="_blank">www.toerismedebaronie.nl/oranjenassaupad</a>
  </div>
</template>

<script>
import { siteName, siteDesc } from '../global'

export default {
  name: 'HomeOranjenassau',
  data() {
    return {
      siteDesc,
      siteName
    }
  }
}
</script>