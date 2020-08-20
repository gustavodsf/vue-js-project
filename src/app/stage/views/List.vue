<template>
  <section class="section">
    <b-loading
      v-bind:is-full-page="true"
      v-bind:active.sync="isUnderRequest"
      v-bind:can-cancel="false"
    />

    <div class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title">
              {{ $tc("default.label.stage", 2) }}
            </h1>
          </div>
        </div>

        <div class="level-right">
          <div class="level-item">
            <router-link
              class="button is-primary is-rounded"
              v-bind:to="{ name: 'stageCreate' }"
            >
              {{ $t("default.label.add", [$tc("default.label.stage", 1)]) }}
            </router-link>
          </div>
        </div>
      </div>

      <div class="card mb-4" v-for="stage in stages" v-bind:key="stage.id">
        <header class="card-header">
          <div class="card-header-title">
            {{ stage.number }} - {{ stage.name }}
            <b-tag
              class="ml-2"
              v-bind:type="stage.isRequired ? 'is-primary' : 'is-secondary'"
              rounded
            >
              {{
                stage.isRequired
                  ? $t("default.label.required")
                  : $t("default.label.optional")
              }}
            </b-tag>
          </div>
        </header>

        <div class="card-content">
          {{ stage.description }}

          <div class="columns mt-2">
            <div class="column">
              <div class="content">
                <p class="is-capitalized has-text-weight-bold">
                  {{ $tc("default.label.archetype", stage.archetypes.length) }}
                </p>
                <ul>
                  <li
                    v-for="archetype in stage.archetypes"
                    v-bind:key="archetype.id"
                  >
                    {{ archetype.name }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="column">
              <div class="content">
                <p class="is-capitalized has-text-weight-bold">
                  {{ $tc("default.label.context", stage.contexts.length) }}
                </p>
                <ul>
                  <li v-for="context in stage.contexts" v-bind:key="context">
                    {{ context }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="column">
              <div class="content">
                <p class="is-capitalized has-text-weight-bold">
                  {{ $tc("default.label.keyPhrase", stage.keyPhrases.length) }}
                </p>
                <ul>
                  <li
                    v-for="keyPhrase in stage.keyPhrases"
                    v-bind:key="keyPhrase"
                  >
                    {{ keyPhrase }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <footer class="card-footer">
          <router-link
            class="button is-primary mr-2"
            v-bind:to="{ name: 'stageEdit', params: { id: stage.id } }"
          >
            {{ $t("default.label.edit", []) }}
          </router-link>

          <button class="button is-danger" v-on:click="confirmDelete(stage)">
            {{ $t("default.label.delete", []) }}
          </button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from "@/libs/firebase";

export default {
  data() {
    return {
      stages: [],
      stageToDelete: null
    };
  },
  methods: {
    async getStages() {
      this.startRequest();
      try {
        await this.$bind("stages", db.collection("stages").orderBy("number"));
      } catch (error) {
        throw error;
      }
      this.endRequest();
    },
    async deleteStage() {
      try {
        await db
          .collection("stages")
          .doc(this.stageToDelete.id)
          .delete();
        this.$buefy.toast.open(
          this.$tc("default.message.delete", 1, [
            this.$tc("default.label.stage", 1)
          ])
        );
      } catch (error) {
        this.errorHandler(error);
      }
    },
    confirmDelete(stage) {
      this.stageToDelete = stage;

      this.$buefy.dialog.confirm({
        title: this.$t("default.confirm.delete.title", [
          this.$tc("default.label.stage", 1)
        ]),
        message: this.$t("default.confirm.delete.message"),
        confirmText: this.$t("default.confirm.delete.confirmText", [
          this.$tc("default.label.stage", 1)
        ]),
        cancelText: this.$t("default.confirm.delete.cancelText"),
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          await this.deleteStage();
          this.stageToDelete = null;
        }
      });
    }
  },
  mounted() {
    try {
      this.getStages();
    } catch (error) {
      this.errorHandler(error);
    }
  }
};
</script>

<style scoped>
.card-footer {
  text-align: right;
  padding: 0.5rem;
  display: block;
}
</style>
