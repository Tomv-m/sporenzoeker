<template>
  <main class="main-wrapper" id="app">
    <router-view/>
  </main>
</template>

<style lang="scss">
$primary-color: #363C52;
$accent-color: #008D36;
$primary-light-color: rgba($primary-color, .7);
$accent-light-color: rgba($accent-color, .5);
$bg-image: rgba($primary-color, .2);
$bg-color: #FCFCFD;
$white: #fff;
$font: 'Roboto', sans-serif;

::-moz-selection {
  background: $accent-light-color;
}
::selection {
  background: $accent-light-color;
}

body {
  margin: 0;
  padding: 0;
  background: $bg-color;
  color: $primary-color;
  font-family: $font;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
button {
  cursor: pointer;
  outline: none;
}
a {
  color: $primary-color;
  text-decoration: none;
}
input {
  font-family: 'Roboto', sans-serif;
  outline: none;
  border: none;
  background: transparent;
  color: $primary-color;
  &::placeholder {
    color: rgba($primary-color, .25);
  }
}
#map {
  position:absolute;
  top:0;
  bottom:0;
  width:100%;
  z-index: -1;
}
.wrapper {
  position: relative;
  max-width: 425px;
  margin: 0 auto;
  padding: 0 22px;
}
.logo-color {
  fill: $primary-color;
}
.icon-color {
  fill: $accent-color;
}
.divider {
  display: inline-block;
  margin: 2px 8px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: $accent-light-color;
}
.icon-button {
  background: transparent;
  border: $accent-color 1px solid;
  border-radius: 12px;
  padding: 7px;
  width: 50px;
  height: 50px;
  transition: all .3s ease-in-out;
  svg {
    width: 100%;
  }
  &:hover {
    background: rgba($accent-color, .15);
  }
  &:active {
    background: rgba($accent-color, .05);
  }
  &.active {
    background: $accent-color;
    .icon-color {
      fill: $bg-color;
    }
  }
}
.main-header {
  margin-top: 72px;
  .wrapper {
    display: flex;
    align-items: center;
    min-height: 50px;
  }
  .right-content {
    margin-left: auto;
    .icon-button {
      margin-left: 22px;
    }
  }
}
.not-found {
  margin-top: 18vh;
  a {
    color: $accent-color;
    text-decoration: underline;
  }
}
.search-wrapper {
  position: relative;
  width: 100%;
  height: 45px;
  display: flex;
  margin: 22px 0;
  background: rgba($primary-color, .05);
  background: linear-gradient(90deg,  rgba($primary-color, .08), rgba($primary-color, .03));
  border-radius: 12px;
  input {
    font-size: 18px;
    padding-left: 18px;
    width: 100%;
  }
  .search-button {
    width: 60px;
    background: transparent;
    border: none;
    padding: 0 18px;
    .icon-color {
      width: 100%;
      fill: $primary-color;
    }
  }
}
.route-list {
  width: 100%;
}
.route-item {
  padding: 14px;
  background: $white;
  box-shadow: 0px 4px 6px rgba($primary-color, .1);
  border-radius: 10px;
  display: flex;
  overflow: hidden;
  &-image {
    background-color: $bg-image;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 8px;
    min-width: 90px;
    height: 90px;
    width: 90px;
  }
  &-info {
    margin-left: 18px;
    width: 100%;
    display: flex;
    flex-direction: column;
    &-top h2 {
      font-size: 21px;
      margin: 0;
      overflow: hidden;
    }
    &-bottom {
      height: 20px;
      margin-top: auto;
      display: flex;
      align-items: flex-end;
      .content {
        color: $accent-color;
        font-size: 12px;
        &-icon {
          margin-left: auto;
          height: 100%;
          svg {
            height: 100%; 
          }  
        }
      }
    }
  }
  &-normal {
    margin-bottom: 14px;
    transition: box-shadow .3s ease-in-out;
    .route-item {
      &-info {
        &-top h2 {
          height: 56px;
        }
      }
    }
    &:hover {
      box-shadow: 0px 6px 8px rgba($primary-color, .15);
    }
  }
  &-small {
    border-radius: 10px 10px 0 0;
    .route-item {
      &-image {
        min-width: 52px;
        height: 52px;
        width: 52px;
      }
      &-info {
        &-top h2 {
          height: 28px;
        }
      }
    }
  }
}
.routes {
  &-header {
    margin-bottom: 18px;
    margin-top: 22px;
    &-image {
      position: relative;
      height: 200px;
      background-color: $bg-image;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      border-radius: 10px;
      margin-bottom: 6px;
      h1 {
        position: absolute;
        color: $white;
        font-size: 24px;
        padding: 18px;
        margin: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
    span {
      font-size: 12px;
      color: $primary-light-color;
    }
  }
}
.route-page {
  &-button {
    font-size: 14px;
    font-weight: 500;
    border: none;
    font-family: $font;
    background: $white;
    color: $primary-color;
    box-shadow: 0px 4px 6px rgba($primary-color, .1);
  }
  &-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  &-info {
    width: 32px;
    height: 32px;
    padding: 0;
    font-size: 21px;
    border-radius: 50%;
  }
  &-actions {
    display: flex;
    margin: 0 -10px; 
    margin-bottom: 12px;
    a {
      text-align: center;
      width: 50%;
      padding: 12px 0;
      margin: 0 10px;
      border-radius: 10px;
    }
  }
}
.modal {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background:  rgba($primary-color, .4);
  .wrapper {
    height: 100%;
  }
  &-close {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 21px;
    color: $primary-light-color;
    line-height: 1;
    padding: 0;
    background: transparent;
    border: none;
  }
  &-inner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }
  &-body { 
    position: relative;
    max-height: 80vh;
    overflow: auto;
    border-radius: 10px;
    background: $bg-color;
  }
  &-info {
    padding: 14px;
    margin: 14px 0;
    header {
      margin-bottom: 18px;
      h2 {
        margin: 0;
        line-height: 1;
        font-size: 24px;
      }
      span {
        font-size: 14px;
        color: $primary-light-color;
      }
    }
    .contact {
      &-info {
        font-weight: 500;
        width: 100px;
        display: inline-block;
      }
      li {
        margin-bottom: 8px;
        a {
          color: $accent-color;
          text-decoration: underline;
        }
      }
    }
  }
}
.map-footer {
  text-align: center;
  margin: 28px 0;
  li {
    margin-bottom: 8px;
    a {
      color: $accent-color;
      text-decoration: underline;
    }
  }
}
</style>
