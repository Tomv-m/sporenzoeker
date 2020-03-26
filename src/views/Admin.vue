<template>
  <div class="admin-wrapper">
    <Headful
      title="Sporenzoeker | Admin"
    />
    <button @click="() => $router.push({ name: 'Home' })">Terug naar Home</button>
    <button class="admin-logout" @click="logout">Logout</button>
    <button @click="create('select')">Nieuw</button>
    <div class="create-options" v-if="createState === 'select'">
      <button @click="create('route')" class="admin-create">Route</button>
      <button @click="create('group')" class="admin-create">Groep</button>
      <button @click="create('location')" class="admin-create">Locatie</button>
      <button @click="create(null)">Annuleer</button>
    </div>
    <div class="admin-routes" v-if="createState === null">
      <Overview @close="create(null)" />
    </div>
    <div class="create-route" v-if="createState === 'route'">
      <Route @close="create(null)" />
    </div>
    <div class="create-group" v-if="createState === 'group'">
      <Group @close="create(null)" />
    </div>
    <div class="create-group" v-if="createState === 'location'">
      <Location @close="create(null)" />
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'

import Overview from '@/components/admin/Overview.vue'
import Group from '@/components/admin/Group.vue'
import Route from '@/components/admin/Route.vue'
import Location from '@/components/admin/Location.vue'

export default {
  name: 'Admin',
  components: {
    Overview,
    Group,
    Route,
    Location
  },
  data() {
    return {
      createState: null,
    }
  },
  methods: {
    logout () {
      firebase.auth().signOut().then(() => {
        this.$router.replace({ name: 'Login' })
      })
    },
    create(state) {
      this.createState = state
    }
  }
}
</script>