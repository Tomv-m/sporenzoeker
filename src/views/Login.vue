<template>
  <div class="login-wrapper">
    <form class="login" @submit.prevent="login">
      <input class="admin-input" placeholder="E-Mail" type="text" v-model="email">
      <input class="admin-input" placeholder="Wachtwoord" type="password" v-model="password">
      <button>Login</button>
      <p v-if="feedback" class="login-feedback">{{ feedback }}</p>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'Admin',
  data () {
    return {
      password: '',
      email: '',
      feedback: null
    }
  },
  beforeRouteEnter (to, from, next) {
    if (firebase.auth().currentUser) {
      next({ name: 'Admin' })
    } else {
      next()
    }
  },
  methods: {
    login(e) {
      const { email, password } = this
      if (email.trim() !== '' && password.trim() !== ''){
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          this.$router.replace({ name: 'Admin' })
        })
        .catch(() => {
          this.feedback = 'Dat is dus niet goed he!'
          this.password = ''
        })
        this.feedback = null
      } else {
        this.feedback = 'Probeer is bijde in te vullen'
        this.password = ''
      }
    }
  }
}
</script>