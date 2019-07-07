<template>
  <footer class="main-footer">
    <div class="wrapper">
      <a href="https://toerlezjoere.nl/" class="main-footer-logo">
        <Logo />
      </a>
      <div class="main-footer-info">
        <span>&copy; Sporen Zoeker</span>
        <div class="divider"/>
        <a href="https://www.ouwelandontwerp.nl/">Ouweland Ontwerp</a>
      </div>
    </div>
  </footer>
</template>

<script>
import Logo from './icons/TLZLogo'

export default {
  name: 'MainFooter',
  components: {
    Logo
  }
}
</script>
