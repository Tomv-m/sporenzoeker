<template>
  <div class="admin-wrapper">
    <Headful :title="`${siteName} | Admin`" />
    <div class="admin-header">    
      <button class="admin-button" @click="() => $router.push({ name: 'Home' })">Terug naar Website</button>
      <button class="admin-button admin-button-end admin-button-danger" @click="logout">Logout</button>
    </div>
    <Route v-if="state === 'new-route'" @close="close" />
    <Group v-else-if="state === 'new-group'" @close="close" />
    <Location v-else-if="state === 'new-location'" @close="close" />
    <EditRoute v-else-if="state === 'edit-route'" :route="payload" @close="close" />
    <EditGroup v-else-if="state === 'edit-group'" :group="payload" @close="close" />
    <EditLocation v-else-if="state === 'edit-location'" :location="payload" @close="close" />
    <Overview v-else @open="props => open(props)" />
  </div>
</template>

<script>
import firebase from 'firebase/app'

import { siteName } from '../global'

// Components
import Overview from '@/components/admin/Overview'
import Group from '@/components/admin/Group'
import Route from '@/components/admin/Route'
import Location from '@/components/admin/Location'
import EditGroup from '@/components/admin/EditGroup'
import EditRoute from '@/components/admin/EditRoute'
import EditLocation from '@/components/admin/EditLocation'

export default {
  name: 'Admin',
  components: {
    Overview,
    Group,
    Route,
    Location,
    EditGroup,
    EditRoute,
    EditLocation
  },
  data() {
    return {
      state: null,
      payload: null,
      siteName
    }
  },
  methods: {
    logout () {
      firebase.auth().signOut().then(() => {
        this.$router.replace({ name: 'Login' })
      })
    },
    open({ state, payload }) {
      window.scrollTo(0, 0)
      this.state = state
      if (payload !== undefined) {
        this.payload = payload
      }
    },
    close() {
      window.scrollTo(0, 0)
      this.state = null
    }
  }
}
</script>