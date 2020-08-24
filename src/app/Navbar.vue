<template>
  <b-navbar type="has-background-secondary" v-bind:fixed-top="true">
    <template slot="brand">
      <b-navbar-item tag="router-link" v-bind:to="{ name: 'home' }">
        <img src="@/assets/img/logo_tellyou.svg" />
      </b-navbar-item>
    </template>

    <template slot="end" v-if="currentUser">
      <b-navbar-dropdown v-bind:label="currentUser.email" v-bind:boxed="true">
        <b-navbar-item
          tag="router-link"
          v-bind:to="{ name: 'archetype' }"
          v-if="adminUser == true"
        >
          {{ $tc("default.label.archetype", 2) }}
        </b-navbar-item>

        <b-navbar-item
          tag="router-link"
          v-bind:to="{ name: 'stage' }"
          v-if="adminUser == true"
        >
          {{ $tc("default.label.stage", 2) }}
        </b-navbar-item>

        <b-navbar-item tag="router-link" v-bind:to="{ name: 'story' }">
          {{ $tc("default.label.story", 2) }}
        </b-navbar-item>

        <a class="navbar-item" v-on:click="signOut">
          {{ $t("navbar.singOut") }}
        </a>
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script>
import firebase from "firebase/app";
import { db } from "@/libs/firebase";

export default {
  data: function() {
    return {
      adminUser: false
    };
  },
  computed: {
    currentUser() {
      return firebase.auth().currentUser;
    }
  },
  methods: {
    async signOut() {
      try {
        await firebase.auth().signOut();
        this.$router.push({ name: "home" });
      } catch (error) {
        this.errorHandler(error);
      }
    },
    isAdmin() {
      let currentUser = firebase.auth().currentUser;
      db.collection("users")
        .where("email", "==", currentUser.email)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log("No matching documents.");
            this.adminUser = false;
          }
          snapshot.forEach(doc => {
            let test = doc.data()["type"] == "admin";
            this.adminUser = test;
          });
        })
        .catch(err => {
          console.log("Error getting documents", err);
          this.adminUser = false;
        });
    }
  },
  mounted: function() {
    this.isAdmin();
  }
};
</script>
