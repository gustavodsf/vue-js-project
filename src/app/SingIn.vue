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
                v-bind:label="$t('home.view.singIn.label.email')"
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
                v-bind:label="$t('home.view.singIn.label.password')"
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
                  v-on:click="singIn"
                  v-bind:loading="isUnderRequest"
                  type="is-primary"
                  rounded
                >
                  {{ $t("home.view.singIn.button.singIn") }}
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

export default {
  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },
  validations: {
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
    async singIn() {
      this.startRequest();

      try {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          await firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password);
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
