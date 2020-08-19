<template>
  <b-navbar
    type="has-background-secondary"
    v-bind:fixed-top="true">
    <template slot="brand">
      <b-navbar-item
        tag="router-link"
        v-bind:to="{ name: 'home' }">
        TellYou
      </b-navbar-item>
    </template>

    <template slot="end" v-if="currentUser">
      <b-navbar-dropdown
        v-bind:label="currentUser.email"
        v-bind:boxed="true">
        <b-navbar-item
          tag="router-link"
          v-bind:to="{ name: 'archetype' }">
          {{ $tc('default.label.archetype', 2) }}
        </b-navbar-item>

        <b-navbar-item
          tag="router-link"
          v-bind:to="{ name: 'stage' }">
          {{ $tc('default.label.stage', 2) }}
        </b-navbar-item>

        <b-navbar-item
          tag="router-link"
          v-bind:to="{ name: 'story' }">
          {{ $tc('default.label.story', 2) }}
        </b-navbar-item>

        <a
          class="navbar-item"
          v-on:click="signOut">
          {{ $t('navbar.singOut') }}
        </a>
      </b-navbar-dropdown>
    </template>

    <template slot="end" v-else>
      <b-navbar-item tag="div">
        <div class="buttons">
          <router-link
            class="button is-primary is-rounded"
            v-bind:to="{ name: 'singUp' }">
            {{ $t('navbar.button.singUp') }}
          </router-link>

          <router-link
            class="button is-light is-rounded"
            v-bind:to="{ name: 'singIn' }">
            {{ $t('navbar.button.singIn') }}
          </router-link>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import firebase from 'firebase/app'

export default {
  computed: {
    currentUser () {
      return firebase.auth().currentUser
    }
  },
  methods: {
    async signOut () {
      try {
        await firebase.auth().signOut()
        this.$router.push({ name: 'home' })
      } catch (error) {
        this.errorHandler(error)
      }
    }
  }
}
</script>
