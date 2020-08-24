<template>
  <section class="hero has-background-secondary is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <h1 class="title is-size-3-mobile is-size-2-desktop is-spaced">
              {{ $t("home.view.singUp.title") }}
            </h1>

            <h2 class="subtitle is-size-4-mobile is-size-3-desktop">
              {{ $t("home.view.singUp.subtitle") }}
            </h2>
          </div>
        </div>

        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div class="box">
              <b-field
                v-bind:label="$t('home.view.singUp.label.name')"
                v-bind:type="{ 'is-danger': $v.name.$error }"
                v-bind:message="[
                  !$v.name.required && $v.name.$error
                    ? $t('error.field.is.required')
                    : ''
                ]"
              >
                <b-input v-model.trim="name" v-bind:disabled="isUnderRequest" />
              </b-field>

              <b-field
                v-bind:label="$t('home.view.singUp.label.email')"
                v-bind:type="{ 'is-danger': $v.email.$error }"
                v-bind:message="[
                  !$v.email.required && $v.email.$error
                    ? $t('error.field.is.required')
                    : '',
                  !$v.email.email && $v.email.$error
                    ? $t('error.email.is.invalid')
                    : ''
                ]"
              >
                <b-input
                  v-model.trim="email"
                  v-bind:disabled="isUnderRequest"
                  type="email"
                />
              </b-field>

              <b-field
                v-bind:label="$t('home.view.singUp.label.password')"
                v-bind:type="{ 'is-danger': $v.password.$error }"
                v-bind:message="[
                  !$v.password.required && $v.password.$error
                    ? $t('error.field.is.required')
                    : '',
                  !$v.password.minLength && $v.password.$error
                    ? $t('error.password.minLength', { minLength: 6 })
                    : ''
                ]"
              >
                <b-input
                  v-model.trim="password"
                  v-bind:disabled="isUnderRequest"
                  type="password"
                  password-reveal
                />
              </b-field>

              <div class="has-text-centered">
                <b-button
                  v-on:click="singUp"
                  v-bind:loading="isUnderRequest"
                  type="is-primary"
                  rounded
                >
                  {{ $t("home.view.singUp.button.singUp") }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from "firebase/app";
import { required, email, minLength } from "vuelidate/lib/validators";
import { db } from "@/libs/firebase";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },
  validations: {
    name: {
      required
    },
    email: {
      required,
      email
    },
    password: {
      required,
      minLength: minLength(6)
    }
  },
  methods: {
    async singUp() {
      this.startRequest();

      try {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password);

          const user = firebase.auth().currentUser;
          user.updateProfile({ displayName: this.name });

          db.collection("users").add({
            uid: user.uid,
            name: this.name,
            email: user.email,
            type: "user"
          });

          this.$router.push({ name: "storyList" });
        }
      } catch (error) {
        this.errorHandler(error);
      }

      this.endRequest();
    }
  }
};
</script>
