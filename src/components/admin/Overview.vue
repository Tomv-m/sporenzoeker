<template>
  <div v-if="edit">
    <EditLocation :location="edit" @close="closeEdit()" />
  </div>
  <div v-else>
    <h2>Overzicht</h2>
    <div class="admin-container">
      <h3>Groepen</h3>
      <VueGoodTable
        :columns="[{ label: 'Naam', field: 'name' }, { label: 'Onder title', field: 'subtitle' }, { label: 'Type', field: 'type' }, { label: 'Verwijder', field: 'remove', sortable: false }]"
        :rows="groups"
        :search-options="{ enabled: true }"
        :pagination-options="{ enabled: true }"
        :sort-options="{ enabled: true, initialSortBy: {field: 'name', type: 'asc'}}"
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field === 'remove'">
            <button class="admin-remove-btn" @click="deleteGroup(props.row)">Delete</button>
          </span>
        </template>
      </VueGoodTable>
    </div>
    <div class="admin-container">
      <h3>Routes</h3>
      <VueGoodTable
        :columns="[{ label: 'Naam', field: 'name' }, { label: 'Group', field: 'group' }, { label: 'Afstand', field: 'distance' }, { label: 'Type', field: 'type' }, { label: 'Verwijder', field: 'remove', sortable: false }]"
        :rows="routes"
        :search-options="{ enabled: true }"
        :pagination-options="{ enabled: true }"
        :sort-options="{ enabled: true, initialSortBy: {field: 'name', type: 'asc'}}"
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field === 'distance'">
            {{ parseFloat(props.row.distance).toFixed(2) }} km
          </span>
          <span v-else-if="props.column.field === 'remove'">
            <button class="admin-remove-btn" @click="deleteRoute(props.row)">Delete</button>
          </span>
        </template>
      </VueGoodTable>
    </div>
    <div class="admin-container">
      <h3>Locaties</h3>
      <VueGoodTable
        :columns="[{ label: 'Naam', field: 'name' }, { label: 'Categorie', field: 'category' }, { label: 'Icon', field: 'type' }, { label: 'Verwijder', field: 'remove', sortable: false }, { label: 'Bewerk', field: 'edit', sortable: false }]"
        :rows="locations"
        :search-options="{ enabled: true }"
        :pagination-options="{ enabled: true }"
        :sort-options="{ enabled: true, initialSortBy: {field: 'type', type: 'asc'}}"
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field === 'remove'">
            <button class="admin-remove-btn" @click="deleteLocation(props.row)">Delete</button>
          </span>
          <span v-else-if="props.column.field === 'edit'">
            <button @click="editLocation(props.row)">Edit</button>
          </span>
        </template>
      </VueGoodTable>
    </div>
  </div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'

import firebase from 'firebase/app'
import { VueGoodTable } from 'vue-good-table';

import EditLocation from './EditLocation'

import { routesCollection } from '../../global'

export default {
  name: 'Overview',
  components: {
    EditLocation,
    VueGoodTable
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
      const groupRef = firebase.firestore().collection(routesCollection).where('data', '==', null)
      groupRef.get().then(snapshot => {
        let groups = []
        snapshot.forEach(doc => {
          groups.push({ id: doc.id, ...doc.data() })
        })
        this.groups = groups
      })
    },
    getRoutes() {
      const groupRef = firebase.firestore().collection(routesCollection).orderBy('distance', 'asc')
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
      const deleteGroup = firebase.firestore().doc(`${routesCollection}/${group.id}`).delete()
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
      const deleteRoute = firebase.firestore().doc(`${routesCollection}/${route.id}`).delete()
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