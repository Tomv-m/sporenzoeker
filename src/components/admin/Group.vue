<template>
  <div class="admin-container">
    <div class="admin-container-header">
      <h2>Nieuwe Groep Maken</h2>
      <button class="admin-button admin-button-end" @click="$emit('close')">Terug naar Overzicht</button>
    </div>
    <label class="admin-label">Naam</label>
    <input type="text" class="admin-input" placeholder="Naam" v-model="name">
    <p v-if="slug" class="admin-feedback admin-feedback-dark">/{{ slug }}</p>
    <label class="admin-label">Onder Title</label>
    <input type="text" class="admin-input" placeholder="Onder Title" v-model="subtitle">
    <label class="admin-label">Type</label>
    <select v-model="type" class="admin-input">
      <option value="null">-- maak keuzen --</option>
      <option value="fietsen">
        Fietsen
      </option>
      <option value="lopen">
        Wandelen
      </option>
    </select>
    <div>
      <label class="admin-label">Header Afbeelding <span>400 x 200</span></label>
      <div class="admin-image-header">
        <img v-if="headerImage" :src="headerImage.result">
      </div>
      <input class="admin-input-file" type="file" @change="selectHeaderImage">
      <p v-if="headerFeedback" class="admin-feedback">{{ headerFeedback }}</p>
      <p v-else-if="headerImageName !== ''" class="admin-feedback admin-feedback-dark">{{headerImageName}}</p>
    </div>
    <div>
      <label class="admin-label">Cover Afbeelding <span>100 x 100</span></label>
      <div class="admin-image-cover">
        <img v-if="coverImage" :src="coverImage.result" />
      </div>
      <input class="admin-input-file" type="file" @change="selectCoverImage">
      <p v-if="coverFeedback" class="admin-feedback">{{ coverFeedback }}</p>
      <p v-else-if="headerImageName !== ''" class="admin-feedback admin-feedback-dark">{{coverImageName}}</p>
    </div>
    <button class="admin-button admin-button-publish" @click="publish">Publiseer</button>
    <p v-if="feedback" class="admin-feedback">{{ feedback }}</p>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { v4 as uuid } from 'uuid'
import slugify from 'slugify'

import { routesCollection } from '../../global'

export default {
  name: 'Group',
  data() {
    return {
      name: '',
      subtitle: '',
      image: null,
      headerImage: null,
      coverImage: null,
      type: null,
      feedback: null,
      headerFeedback: null,
      coverFeedback: null,
      headerImageName: '',
      coverImageName: ''
    }
  },
  computed: {
    slug () {
      return this.name.trim() !== '' ? slugify(this.name.toLowerCase()) : null
    }
  },
  methods: {
    selectImage(selectedFile, imageSize) {
      return new Promise((resolve, reject) => {
        const file = selectedFile.target.files[0]
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            const img = new Image
            img.src = reader.result
            img.onload = function() {
              if (imageSize.h === this.height && imageSize.w === this.width) {
                const name = `${uuid()}-${file.name}`
                resolve({ name, data: file, result: reader.result })
              } else {
                reject(`Niet juiste grote ${imageSize.w} x ${imageSize.h}`)
              }
            }
          }
        } else {
          reject('Er is geen afbeelding geselecteerd')
        }
      })
    },
    selectHeaderImage(e) {
      this.headerFeedback = null
      if (e.target.files[0]) {
        this.selectImage(e, { h: 200, w: 400 }).then(image => {
          this.headerImageName = image.data.name
          this.headerImage = image
        }).catch(m => {
          this.headerFeedback = m
        })
      }
    },
    selectCoverImage(e) {
      this.coverFeedback = null
      if (e.target.files[0]) {
        this.selectImage(e, { h: 100, w: 100 }).then(image => {
          this.coverImageName = image.data.name
          this.coverImage = image
        }).catch(m => {
          this.coverFeedback = m
        })
      }
    },
    publish() {
      if (
        this.name.trim() !== '' &&
        this.subtitle.trim() !== '' &&
        this.type !== null &&
        this.headerImage !== null &&
        this.coverImage !== null
      ) {
        this.feedback = 'Gegevens uploaden..'
        const storage = firebase.storage().ref()
        const uploadHeader = storage.child('header/' + this.headerImage.name).put(this.headerImage.data)
        const uploadCover = storage.child('cover/' + this.coverImage.name).put(this.coverImage.data)
        Promise.all([uploadHeader, uploadCover]).then(values => {
          const headerPath = values[0].metadata.fullPath
          const coverPath = values[1].metadata.fullPath
          const group = {
            slug: this.slug,
            name: this.name,
            subtitle: this.subtitle,
            type: this.type,
            headerImage: headerPath,
            coverImage: coverPath,
            data: null,
            group: null
          }
          firebase.firestore().collection(routesCollection).doc(this.slug).set(group).then(doc => {
            this.feedback = null
            this.$emit('close')
          })
        }).catch(err => {
          console.log(err)
          this.feedback = 'Uploading mislukt.. Probeer opnieuw'
        })
      } else {
        this.feedback = 'Eerst alle velden invullen'
      }
    }
  }
}
</script>