<template>
  <div v-if="edit">
    <EditLocation :location="edit" @close="closeEdit()" />
  </div>
  <div v-else>
    <h2>Overzicht</h2>
    <label v-if="groups.length > 0">Groepen</label>
    <div class="admin-groups">
      <div class="admin-groups-group admin-container" v-for="group in groups" :key="group.id">
        <h3>{{ group.name }}</h3>
        <p>{{ group.subtitle }}</p>
        <small>{{ group.type }}</small>
        <button class="admin-remove-btn" @click="deleteGroup(group)">Delete</button>
      </div>
    </div>
    <label v-if="routes.length > 0">Routes</label>
    <div class="admin-routes">
      <div class="admin-routes-route admin-container" v-for="route in routes" :key="route.id">
        <h3>{{ route.name }}</h3>
        <p v-if="route.group">Groep: {{ route.group }}</p>
        <p>{{ parseFloat(route.distance).toFixed(2) }} km</p>
        <small>{{ route.type }}</small>
        <button class="admin-remove-btn" @click="deleteRoute(route)">Delete</button>
      </div>
    </div>
    <label v-if="locations.length > 0">Locaties</label>
    <div class="admin-locations">
      <div class="admin-locations-location admin-container" v-for="location in locations" :key="location.id">
        <h3>{{ location.name }}</h3>
        <p>{{ location.category }}</p>
        <small>{{ location.type }}-icon</small>
        <button class="admin-remove-btn" @click="deleteLocation(location)">Delete</button>
        <button @click="editLocation(location)">Edit</button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import EditLocation from './EditLocation'

export default {
  name: 'Overview',
  components: {
    EditLocation
  },
  data() {
    return {
      groups: [],
      routes: [],
      locations: [],
      edit: null
    }
  },
  methods: {
    closeEdit() {
      this.edit = null
      this.getLocation()
    },
    getGroups() {
      const groupRef = firebase.firestore().collection('routes').where('data', '==', null)
      groupRef.get().then(snapshot => {
        let groups = []
        snapshot.forEach(doc => {
          groups.push({ id: doc.id, ...doc.data() })
        })
        this.groups = groups
      })
    },
    getRoutes() {
      const groupRef = firebase.firestore().collection('routes').orderBy('distance', 'asc')
      groupRef.get().then(snapshot => {
        let routes = []
        snapshot.forEach(doc => {
          routes.push({ id: doc.id, ...doc.data() })
        })
        this.routes = routes
      })
    },
    getLocation() {
      const groupRef = firebase.firestore().collection('locations')
      groupRef.get().then(snapshot => {
        let locations = []
        snapshot.forEach(doc => {
          locations.push({ id: doc.id, ...doc.data() })
        })
        this.locations = locations
      })
    },
    deleteGroup(group) {
      const storage = firebase.storage().ref()
      // delete cover
      const deleteCover = storage.child(group.coverImage).delete()
      // delete header
      const deleteHeader = storage.child(group.headerImage).delete()
      // delete current group
      const deleteGroup = firebase.firestore().doc('routes/' + group.id).delete()
      // call delete actions
      Promise.all([deleteCover, deleteHeader, deleteGroup]).then(values => {
        this.groups = this.groups.filter(groupItem => groupItem.id !== group.id)
      }).catch(err => {
        console.log(err)
      })
    },
    deleteRoute(route) {
      const storage = firebase.storage().ref()
      // delete cover
      const deleteCover = storage.child(route.coverImage).delete()
      // delete data
      const deleteData = firebase.firestore().doc(route.data).delete()
      // delete current route
      const deleteRoute = firebase.firestore().doc('routes/' + route.id).delete()
      // call delete actions
      Promise.all([deleteCover, deleteData, deleteRoute]).then(values => {
        this.routes = this.routes.filter(routeItem => routeItem.id !== route.id)
      }).catch(err => {
        console.log(err)
      })
    },
    deleteLocation(location) {
      // delete current location
      firebase.firestore().collection('locations').doc(location.id).delete().then(value => {
        this.locations = this.locations.filter(locationItem => locationItem.id !== location.id)
      }).catch(err => {
        console.log(err)
      })
    },
    editLocation(location) {
      this.edit = location
    }
  },
  created() {
    this.getGroups()
    this.getRoutes()
    this.getLocation()
  }
}
</script>

<style lang="scss" scoped>

</style>