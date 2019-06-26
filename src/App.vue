<template>
  <main class="main-wrapper" id="app">
    <router-view/>
  </main>
</template>

<style lang="scss">
$primary-color: #363C52;
$accent-color: #22A06A;
$primary-light-color: rgba(#363C52, .7);
$accent-light-color: rgba(#22A06A, .5);
$bg-color: #FCFCFD;
$white: #fff;

body {
  margin: 0;
  padding: 0;
  background: $bg-color;
  color: $primary-color;
  font-family: 'Roboto', sans-serif;
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
  .route {
    padding: 14px;
    margin-bottom: 14px;
    background: $white;
    box-shadow: 0px 4px 6px rgba($primary-color, .1);
    border-radius: 10px;
    display: flex;
    &-image {
      background: rgba($primary-color, .2);
      border-radius: 8px;
      height: 90px;
      width: 90px;
      min-width: 90px;
    }
    &-info {
      margin-left: 18px;
      width: 100%;
      display: flex;
      flex-direction: column;
      &-top {
        h2 {
          max-height: 50px;
          font-size: 21px;
          margin: 0;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
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
    transition: box-shadow .3s ease-in-out;
    &:hover {
      box-shadow: 0px 6px 8px rgba($primary-color, .15);
    }
  }
}
</style>
