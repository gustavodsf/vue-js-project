<template>
  <section class="section">
    <div class="container">
      <h1 class="title" v-if="currentRoute === 'archetypeCreate'">
        {{ $t("default.label.add", [$tc("default.label.archetype", 1)]) }}
      </h1>

      <h1 class="title" v-if="currentRoute === 'archetypeEdit'">
        {{ $t("default.label.edit", [$tc("default.label.archetype", 1)]) }}
      </h1>

      <div class="box">
        <b-field
          v-bind:label="$t('archetype.view.form.label.name')"
          v-bind:type="{ 'is-danger': $v.archetype.name.$error }"
          v-bind:message="[
            !$v.archetype.name.required && $v.archetype.name.$error
              ? $t('error.field.is.required')
              : ''
          ]"
        >
          <b-input
            v-model.trim="archetype.name"
            v-bind:disabled="isUnderRequest"
          />
        </b-field>

        <b-field
          v-bind:label="$t('archetype.view.form.label.description')"
          v-bind:type="{ 'is-danger': $v.archetype.description.$error }"
          v-bind:message="[
            !$v.archetype.description.required &&
            $v.archetype.description.$error
              ? $t('error.field.is.required')
              : ''
          ]"
        >
          <b-input
            v-model.trim="archetype.description"
            v-bind:disabled="isUnderRequest"
            type="textarea"
          />
        </b-field>

        <b-field v-bind:label="$t('archetype.view.form.label.isRequired')">
          <b-switch
            v-model="archetype.isRequired"
            v-bind:disabled="isUnderRequest"
          >
            {{
              archetype.isRequired
                ? $t("default.label.required")
                : $t("default.label.optional")
            }}
          </b-switch>
        </b-field>

        <div class="has-text-centered">
          <b-button
            v-if="currentRoute === 'archetypeCreate'"
            v-on:click="addArchetype"
            v-bind:loading="isUnderRequest"
            type="is-primary"
            rounded
          >
            {{ $t("default.label.add", [$tc("default.label.archetype", 1)]) }}
          </b-button>

          <b-button
            v-if="currentRoute === 'archetypeEdit'"
            v-on:click="editArchetype"
            v-bind:loading="isUnderRequest"
            type="is-primary"
            rounded
          >
            {{ $t("default.label.edit", [$tc("default.label.archetype", 1)]) }}
          </b-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { db } from "@/libs/firebase";

export default {
  data() {
    return {
      currentRoute: this.$route.name,
      archetype: {
        name: "",
        description: "",
        isRequired: false
      }
    };
  },
  validations: {
    archetype: {
      name: {
        required
      },
      description: {
        required
      }
    }
  },
  methods: {
    async addArchetype() {
      this.startRequest();
      try {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          await db.collection("archetypes").add(this.archetype);

          this.$router.push({ name: "archetypeList" });
        }
      } catch (error) {
        this.errorHandler(error);
      }
      this.endRequest();
    },
    async getArchetype(id) {
      this.startRequest();
      try {
        await this.$bind("archetype", db.collection("archetypes").doc(id));
      } catch (error) {
        this.errorHandler(error);
      }
      this.endRequest();
    },
    async editArchetype() {
      this.startRequest();
      try {
        await db
          .collection("archetypes")
          .doc(this.archetype.id)
          .update(this.archetype);

        this.$router.push({ name: "archetypeList" });
      } catch (error) {
        this.errorHandler(error);
      }
      this.endRequest();
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.getArchetype(this.$route.params.id);
    }
  }
};
</script>
