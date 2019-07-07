<template>
  <main class="main-wrapper" id="app">
    <router-view/>
  </main>
</template>

<style lang="scss">
@import './assets/scss/styles';

// Transition
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
