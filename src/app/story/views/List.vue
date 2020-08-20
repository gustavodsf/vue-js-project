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
              {{ $tc("default.label.story", 2) }}
            </h1>
          </div>
        </div>

        <div class="level-right">
          <div class="level-item">
            <router-link
              class="button is-primary is-rounded"
              v-bind:to="{ name: 'storyCreate' }"
            >
              {{ $t("default.label.add", [$tc("default.label.story", 1)]) }}
            </router-link>
          </div>
        </div>
      </div>

      <b-collapse
        class="card mb-4"
        v-for="story in stories"
        v-bind:key="story.id"
        v-bind:open="false"
      >
        <header
          class="card-header"
          slot="trigger"
          slot-scope="props"
          role="button"
        >
          <div class="card-header-title">
            {{ story.title }}
          </div>
          <a class="card-header-icon">
            <b-icon v-bind:icon="props.open ? 'caret-up' : 'caret-down'" />
          </a>
        </header>

        <div class="card-content">
          <div class="content">
            {{ story.objective }}

            <b-taglist class="mt-3">
              <b-tag
                v-for="keyword in story.keywords"
                v-bind:key="keyword"
                type="is-secondary"
                rounded
              >
                {{ keyword }}
              </b-tag>
            </b-taglist>
          </div>
        </div>

        <footer class="card-footer">
          <router-link
            class="button is-primary mr-2"
            v-bind:to="{ name: 'storyView', params: { id: story.id } }"
          >
            {{ $t("default.label.tell", [$tc("default.label.story")]) }}
          </router-link>

          <router-link
            class="button is-primary mr-2"
            v-if="userCanEditStory(story)"
            v-bind:to="{ name: 'storyEdit', params: { id: story.id } }"
          >
            {{ $t("default.label.edit", []) }}
          </router-link>

          <button
            class="button is-danger"
            v-if="userCanDeleteStory(story)"
            v-on:click="confirmDelete(story)"
          >
            {{ $t("default.label.delete", []) }}
          </button>
        </footer>
      </b-collapse>
    </div>
  </section>
</template>

<script>
import firebase from "firebase/app";
import { db } from "@/libs/firebase";

export default {
  data() {
    return {
      stories: [],
      storyToDelete: null
    };
  },
  methods: {
    async getStories() {
      this.startRequest();
      try {
        await this.$bind("stories", db.collection("stories"));
      } catch (error) {
        throw error;
      }
      this.endRequest();
    },
    async deleteStory() {
      try {
        await db
          .collection("stories")
          .doc(this.storyToDelete.id)
          .delete();
        this.$buefy.toast.open(
          this.$tc("default.message.delete", 1, [
            this.$tc("default.label.story", 1)
          ])
        );
      } catch (error) {
        this.errorHandler(error);
      }
    },
    confirmDelete(story) {
      this.storyToDelete = story;

      this.$buefy.dialog.confirm({
        title: this.$t("default.confirm.delete.title", [
          this.$tc("default.label.story", 1)
        ]),
        message: this.$t("default.confirm.delete.message"),
        confirmText: this.$t("default.confirm.delete.confirmText", [
          this.$tc("default.label.story", 1)
        ]),
        cancelText: this.$t("default.confirm.delete.cancelText"),
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          await this.deleteStory();
          this.storyToDelete = null;
        }
      });
    },
    userCanEditStory(story) {
      const currentUser = firebase.auth().currentUser;
      const isLeader = story.leader.uid === currentUser.uid;

      return isLeader;
    },
    userCanDeleteStory(story) {
      const currentUser = firebase.auth().currentUser;
      const isLeader = story.leader.uid === currentUser.uid;

      return isLeader;
    }
  },
  mounted() {
    try {
      this.getStories();
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
