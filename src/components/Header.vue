<template>
  <header class="main-header">
    <div class="wrapper">
      <router-link to="/">
        <Logo />
      </router-link> 
      <div class="right-content">
        <slot />
      </div>
    </div>
  </header>
</template>

<script>
import Logo from './Logo'

export default {
  name: 'MainHeader',
  components: {
    Logo
  }
}
</script>
