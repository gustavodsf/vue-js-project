<template>
  <section class="hero has-background-secondary is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <h1 class="title is-size-3-mobile is-size-2-desktop is-spaced">
              {{ $t("home.view.singIn.title") }}
            </h1>
          </div>
        </div>

        <div class="columns">
          <div class="column is-half is-offset-one-quarter">
            <div class="box">
              <b-field
                v-bind:label="$t('home.view.singIn.label.emailStored')"
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
              <div class="has-text-centered">
                <b-button
                  v-on:click="resetPassword"
                  v-bind:loading="isUnderRequest"
                  type="is-primary"
                  rounded
                >
                  {{ $t("home.view.singIn.button.reset") }}
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
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      name: "",
      email: ""
    };
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    async resetPassword() {
      this.startRequest();

      try {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          let auth = firebase.auth();
          await auth.sendPasswordResetEmail(this.email);
          this.$router.push({ name: "home" });
        }
      } catch (error) {
        this.errorHandler(error);
      }

      this.endRequest();
    }
  }
};
</script>
