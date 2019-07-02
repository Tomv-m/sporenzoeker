<template>
  <div class="modal" @click="close">
    <div class="modal-inner">
      <div class="wrapper">
        <div class="modal-body">
          <button @click="$emit('close')" class="modal-close">&times;</button>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  methods: {
    close(e) {
      if (!e.target.closest('.modal-body')) {
        this.$emit('close')
      }
    }
  }
}
</script>
