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

<style lang="scss">
.main-header {
  margin-top: 72px;
  .wrapper {
    display: flex;
    align-items: center;
    min-height: 50px;
  }
  .right-content {
    margin-left: auto;
    .icon-button {
      margin-left: 22px;
    }
  }
}
</style>
