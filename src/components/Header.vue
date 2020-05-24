<template>
  <header class="main-header">
    <div class="wrapper">
      <router-link to="/">
        <Logo :isOranjenassau="isOranjenassau" />
      </router-link> 
      <div class="right-content">
        <slot />
      </div>
    </div>
  </header>
</template>

<script>
import Logo from './icons/Logo'

import { isOranjenassau } from '../global'

export default {
  name: 'MainHeader',
  components: {
    Logo
  },
  data() {
    return {
      isOranjenassau
    }
  }
}
</script>
