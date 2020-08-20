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
              {{ $tc("default.label.archetype", 2) }}
            </h1>
          </div>
        </div>

        <div class="level-right">
          <div class="level-item">
            <router-link
              class="button is-primary is-rounded"
              v-bind:to="{ name: 'archetypeCreate' }"
            >
              {{ $t("default.label.add", [$tc("default.label.archetype", 1)]) }}
            </router-link>
          </div>
        </div>
      </div>

      <div
        class="card mb-4"
        v-for="archetype in archetypes"
        v-bind:key="archetype.id"
      >
        <header class="card-header">
          <div class="card-header-title">
            {{ archetype.name }}
            <b-tag
              class="ml-2"
              v-bind:type="archetype.isRequired ? 'is-primary' : 'is-secondary'"
              rounded
            >
              {{
                archetype.isRequired
                  ? $t("default.label.required")
                  : $t("default.label.optional")
              }}
            </b-tag>
          </div>
        </header>

        <div class="card-content">
          {{ archetype.description }}
        </div>

        <footer class="card-footer">
          <router-link
            class="button is-primary mr-2"
            v-bind:to="{ name: 'archetypeEdit', params: { id: archetype.id } }"
          >
            {{ $t("default.label.edit", []) }}
          </router-link>

          <button
            class="button is-danger"
            v-on:click="confirmDelete(archetype)"
          >
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
      archetypes: [],
      archetypeToDelete: null
    };
  },
  methods: {
    async getArchetypes() {
      this.startRequest();

      try {
        await this.$bind("archetypes", db.collection("archetypes"));
      } catch (error) {
        throw error;
      }

      this.endRequest();
    },
    async deleteArchetype() {
      try {
        await db
          .collection("archetypes")
          .doc(this.archetypeToDelete.id)
          .delete();
        this.$buefy.toast.open(
          this.$tc("default.message.delete", 1, [
            this.$tc("default.label.archetype", 1)
          ])
        );
      } catch (error) {
        this.errorHandler(error);
      }
    },
    confirmDelete(archetype) {
      this.archetypeToDelete = archetype;

      this.$buefy.dialog.confirm({
        title: this.$t("default.confirm.delete.title", [
          this.$tc("default.label.archetype", 1)
        ]),
        message: this.$t("default.confirm.delete.message"),
        confirmText: this.$t("default.confirm.delete.confirmText", [
          this.$tc("default.label.archetype", 1)
        ]),
        cancelText: this.$t("default.confirm.delete.cancelText"),
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          await this.deleteArchetype();
          this.archetypeToDelete = null;
        }
      });
    }
  },
  mounted() {
    try {
      this.getArchetypes();
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
