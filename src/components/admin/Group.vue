<template>
  <div>
    <h2>Nieuwe Groep Maken</h2>
    <label>Naam</label>
    <input type="text" class="admin-input" placeholder="Naam" v-model="name">
    <label>Onder Title</label>
    <input type="text" class="admin-input" placeholder="Onder Title" v-model="subtitle">
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
      <label>Header Afbeelding</label><br><small>400 x 200</small>
      <input class="admin-input" type="file" @change="selectHeaderImage">
      <p v-if="headerFeedback" style="color: red;">{{ headerFeedback }}</p>
    </div>
    <div>
      <label>Cover Afbeelding</label><br><small>100 x 100</small>
      <input class="admin-input" type="file" @change="selectCoverImage">
      <p v-if="coverFeedback" style="color: red;">{{ coverFeedback }}</p>
    </div>
    <button @click="$emit('close')">X</button>
    <button @click="publish">Publiseer</button>
    <p v-if="feedback">{{ feedback }}</p>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { v4 as uuid } from 'uuid'
import slugify from 'slugify'

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
      coverFeedback: null
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
                resolve({ name, data: file })
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
      this.selectImage(e, { h: 200, w: 400 }).then(image => {
        this.headerImage = image
      }).catch(m => {
        this.headerFeedback = m
      })
    },
    selectCoverImage(e) {
      this.coverFeedback = null
      this.selectImage(e, { h: 100, w: 100 }).then(image => {
        this.coverImage = image
      }).catch(m => {
        this.coverFeedback = m
      })
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
            name: this.name,
            subtitle: this.subtitle,
            type: this.type,
            headerImage: headerPath,
            coverImage: coverPath,
            data: null,
            group: null
          }
          firebase.firestore().collection('routes').doc(slugify(this.name.toLowerCase())).set(group).then(doc => {
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