<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        {{ $t("default.label.edit", { arg: $tc("stage.event.label", 1) }) }}
      </p>
    </header>

    <section class="modal-card-body">
      <b-field
        v-bind:label="$tc('stage.keyPhrase', 0)"
        v-if="keyPhrase"
        v-bind:type="{ 'is-danger': $v.keyPhrase.$error }"
        v-bind:message="[
          !$v.keyPhrase.required && $v.keyPhrase.$error
            ? $t('default.error.field.is.required')
            : ''
        ]"
      >
        <b-select v-model="keyPhrase">
          <option
            v-for="keyPhrase in keyPhrases"
            v-bind:key="keyPhrase"
            v-bind:value="keyPhrase"
          >
            {{ keyPhrase }}
          </option>
        </b-select>
      </b-field>

      <b-field
        v-bind:type="{ 'is-danger': $v.body.$error }"
        v-bind:message="[
          !$v.body.required && $v.body.$error
            ? $t('default.error.field.is.required')
            : ''
        ]"
      >
        <b-input v-model="body" type="textarea" />
      </b-field>
    </section>

    <footer class="modal-card-foot">
      <button class="button" type="button" v-on:click="$parent.close()">
        {{ $t("default.label.close") }}
      </button>

      <button class="button is-primary" v-on:click="updateEvent">
        {{ $t("default.label.edit", []) }}
      </button>
    </footer>
  </div>
</template>

<script>
import { required, requiredIf } from "vuelidate/lib/validators";
import { db } from "@/libs/firebase";

export default {
  props: ["keyPhrases", "event", "storyId"],
  data() {
    return {
      keyPhrase: this.event.keyPhrase,
      body: this.event.body
    };
  },
  validations: {
    keyPhrase: {
      required: requiredIf(function() {
        return this.event.keyPhrase;
      })
    },
    body: {
      required
    }
  },
  methods: {
    async updateEvent() {
      try {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          this.event.keyPhrase = this.keyPhrase;
          this.event.body = this.body;

          const eventRef = db
            .collection("stories")
            .doc(this.storyId)
            .collection("events")
            .doc(this.event.id);
          await eventRef.update(this.event);

          this.$parent.close();
        }
      } catch (error) {
        this.errorHandler(error);
      }
    }
  }
};
</script>
