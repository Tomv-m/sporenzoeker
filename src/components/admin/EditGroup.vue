<template>
  <div class="admin-container">
    <div class="admin-container-header">
      <h2>Edit Groep</h2>
      <button class="admin-button admin-button-end" @click="$emit('close')">Terug naar Overzicht</button>
    </div>
    <label class="admin-label">Naam</label>
    <input type="text" class="admin-input" placeholder="Naam" v-model="name">
    <p v-if="slug" class="admin-feedback admin-feedback-dark">/{{ slug }}</p>
    <label class="admin-label">Onder Title</label>
    <input type="text" class="admin-input" placeholder="Onder Title" v-model="subtitle">
    <label class="admin-label">Type</label>
    <select v-model="type" class="admin-input" disabled>
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
    <button class="admin-button admin-button-publish" @click="update">Update</button>
    <p v-if="feedback" class="admin-feedback">{{ feedback }}</p>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { v4 as uuid } from 'uuid'
import slugify from 'slugify'

import { routesCollection } from '../../global'

export default {
  name: 'EditGroup',
  props: {
    group: Object
  },
  data() {
    return {
      name: '',
      subtitle: '',
      image: null,
      headerImage: null,
      coverImage: null,
      type: null,
      slug: null,
      feedback: null,
      headerFeedback: null,
      coverFeedback: null,
      headerImageName: '',
      coverImageName: ''
    }
  },
  methods: {
    setGroup() {
      this.name = this.group.name
      this.subtitle = this.group.subtitle
      this.type = this.group.type
      this.slug = this.group.slug
      // Download header image
      const storage = firebase.storage()
      storage.ref(this.group.headerImage).getDownloadURL().then(result => {
        this.headerImage = { name: this.group.headerImage, data: null, result }
      }).catch(err => {
        console.log(err)
      })
      // Download cover image
      storage.ref(this.group.coverImage).getDownloadURL().then(result => {
        this.coverImage = { name: this.group.coverImage, data: null, result }
      }).catch(err => {
        console.log(err)
      })
    },
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
    update() {
      if (
        this.name.trim() !== '' &&
        this.subtitle.trim() !== '' &&
        this.type !== null
      ) {
        this.feedback = 'Gegevens uploaden..'
        const storage = firebase.storage().ref()
        if (this.headerImage.data !== null && this.coverImage.data !== null) {
          // Delete current images
          storage.child(this.group.headerImage).delete()
          storage.child(this.group.coverImage).delete()
          // upload all new images
          const uploadHeader = storage.child('header/' + this.headerImage.name).put(this.headerImage.data)
          const uploadCover = storage.child('cover/' + this.coverImage.name).put(this.coverImage.data)
          Promise.all([uploadHeader, uploadCover]).then(values => {
            const headerPath = values[0].metadata.fullPath
            const coverPath = values[1].metadata.fullPath
            this.updateDocument(headerPath, coverPath)
          }).catch(err => {
            console.log(err)
            this.feedback = 'Uploading mislukt.. Probeer opnieuw'
          })
        } else if (this.headerImage.data !== null) {
          // Delete current image
          storage.child(this.group.headerImage).delete()
          // Upload new image
          storage.child('header/' + this.headerImage.name).put(this.headerImage.data).then(img => {
            this.updateDocument(img.metadata.fullPath, this.group.coverImage)
          })
        } else if (this.coverImage.data !== null) {
          // Delete current image
          storage.child(this.group.coverImage).delete()
          // Upload new image
          storage.child('cover/' + this.coverImage.name).put(this.headerImage.data).then(img => {
            this.updateDocument(this.group.headerImage, img.metadata.fullPath)
          })
        } else {
          this.updateDocument(this.group.headerImage, this.group.coverImage)
        }
      } else {
        this.feedback = 'Eerst alle velden invullen'
      }
    },
    updateDocument(headerPath, coverPath) {
      const group = {
        name: this.name,
        subtitle: this.subtitle,
        type: this.type,
        headerImage: headerPath,
        coverImage: coverPath,
      }
      firebase.firestore().collection(routesCollection).doc(this.group.id).update(group).then(() => {
        this.feedback = null
        this.$emit('close')
      }).catch(err => {
        this.feedback = 'Uploading mislukt.. Probeer opnieuw'
      })
    }
  },
  created() {
    this.setGroup()
  }
}
</script>