<template>
  <footer class="main-footer">
    <div class="wrapper">
      <a href="http://toerismedebaronie.nl/" target="_blank" class="main-footer-logo" title="Toerisme De Baronie">
        <Logo />
      </a>
      <div class="main-footer-info">
        <span>&copy; Sporenzoeker</span>
        <div class="divider"/>
        <a href="https://www.ouwelandontwerp.nl/" target="_blank">Ouweland Ontwerp</a>
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
