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
              {{ stage.name }}
            </h1>
          </div>
        </div>

        <div class="level-right">
          <div class="level-item">
            <b-select
              v-if="isLeader"
              v-model="currentStatus"
              v-on:input="selectEventsFromStatus"
            >
              <option
                v-for="status in storyStatusList"
                v-bind:value="status.value"
                v-bind:key="status.value"
              >
                {{ status.text }}
              </option>
            </b-select>
          </div>
        </div>
      </div>

      <h2 class="subtitle">
        {{ stage.description }}
      </h2>

      <draggable
        v-model="events"
        v-on:end="updateEvents"
        v-bind:options="{ disabled: isAuthor }"
      >
        <transition-group>
          <div class="card mb-4" v-for="event in events" v-bind:key="event.id">
            <div class="card-content">
              <div class="content">
                {{ `${event.keyPhrase} ${event.body}` }}
              </div>

              <div class="is-size-7 has-text-right">
                {{ event.author.name }}
              </div>
            </div>
            <footer class="card-footer">
              <button
                class="button is-primary mr-2"
                v-if="isLeader || isReviewer || isEventAuthor(event)"
                v-on:click="openEditEventModal(event)"
              >
                {{ $t("default.label.edit", []) }}
              </button>

              <button
                class="button is-danger"
                v-if="isLeader || isReviewer || isEventAuthor(event)"
                v-on:click="confirmDelete(event)"
              >
                {{ $t("default.label.delete", []) }}
              </button>
            </footer>
          </div>
        </transition-group>
      </draggable>

      <b-field
        v-bind:label="$tc('default.label.keyPhrase')"
        v-if="events.length === 0"
        v-bind:type="{ 'is-danger': $v.event.keyPhrase.$error }"
        v-bind:message="[
          !$v.event.keyPhrase.required && $v.event.keyPhrase.$error
            ? $t('error.field.is.required')
            : ''
        ]"
      >
        <b-select v-model="event.keyPhrase" required>
          <option
            v-for="keyPhrase in stage.keyPhrases"
            v-bind:key="keyPhrase"
            v-bind:value="keyPhrase"
          >
            {{ keyPhrase }}
          </option>
        </b-select>
      </b-field>

      <b-field
        v-bind:label="$t('default.label.add', [])"
        v-bind:type="{ 'is-danger': $v.event.body.$error }"
        v-bind:message="[
          !$v.event.body.required && $v.event.body.$error
            ? $t('error.field.is.required')
            : ''
        ]"
      >
        <b-input v-model="event.body" type="textarea" />
      </b-field>

      <div class="has-text-centered">
        <b-button v-on:click="addEvent" type="is-primary" rounded>
          {{ $t("default.label.add", []) }}
        </b-button>
      </div>
    </div>

    <b-modal v-bind:active.sync="isEditEventModalActive" has-modal-card>
      <event-edit-modal
        v-bind:keyPhrases="stage.keyPhrases"
        v-bind:event="eventToBeUpdated"
        v-bind:storyId="story.id"
      />
    </b-modal>
  </section>
</template>

<script>
import firebase from "firebase/app";
import { required, requiredIf } from "vuelidate/lib/validators";
import draggable from "vuedraggable";
import { db } from "@/libs/firebase";
import EventEditModal from "@/app/story/components/EventEditModal.vue";
import storyEnums from "@/app/story/story.enum";

export default {
  components: {
    draggable,
    EventEditModal
  },
  data() {
    return {
      eventToDeleted: {},
      eventToBeUpdated: {},
      isEditEventModalActive: false,
      storyStatusList: storyEnums.STATUS_LIST,
      currentStatus: 0,
      story: {},
      stage: {},
      events: [],
      event: {
        keyPhrase: "",
        body: ""
      }
    };
  },
  validations: {
    event: {
      keyPhrase: {
        required: requiredIf(function() {
          return this.events.length === 0;
        })
      },
      body: {
        required
      }
    }
  },
  computed: {
    isLeader() {
      const currentUser = firebase.auth().currentUser;

      return this.story.leader.uid === currentUser.uid;
    },
    isReviewer() {
      const currentUser = firebase.auth().currentUser;

      const reviewer = this.story.reviewers.filter(reviewer => {
        return reviewer.uid === currentUser.uid;
      })[0];

      return reviewer;
    },
    isAuthor() {
      const currentUser = firebase.auth().currentUser;

      const author = this.story.authors.filter(author => {
        return author.uid === currentUser.uid;
      })[0];

      return author;
    }
  },
  methods: {
    async addEvent() {
      this.startRequest();
      try {
        this.$v.event.$touch();

        if (!this.$v.event.$invalid) {
          const currentUser = firebase.auth().currentUser;

          this.event.storyStatus = this.story.status;
          this.event.stageId = this.stage.id;
          this.event.number = this.events.length + 1;
          this.event.author = {
            uid: currentUser.uid,
            name: currentUser.displayName
          };
          this.event.readBy = [currentUser.uid];

          await db
            .collection("stories")
            .doc(this.story.id)
            .collection("events")
            .add(this.event);

          this.event.keyPhrase = "";
          this.event.body = "";
          this.$v.event.$reset();
        }
      } catch (error) {
        this.errorHandler(error);
      }
      this.endRequest();
    },
    confirmDelete(event) {
      this.eventToDeleted = event;

      this.$buefy.dialog.confirm({
        title: this.$t("default.confirm.delete.title", [
          this.$tc("default.label.event")
        ]),
        message: this.$t("default.confirm.delete.message"),
        confirmText: this.$t("default.confirm.delete.confirmText", [
          this.$tc("default.label.event")
        ]),
        cancelText: this.$t("default.confirm.delete.cancelText"),
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          await this.deleteEvent();
          this.eventToDeleted = null;
        }
      });
    },
    async deleteEvent() {
      try {
        await db
          .collection("stories")
          .doc(this.story.id)
          .collection("events")
          .doc(this.eventToDeleted.id)
          .delete();
        this.$buefy.toast.open(
          this.$tc("default.message.delete", 1, [
            this.$tc("default.label.event")
          ])
        );
      } catch (error) {
        this.errorHandler(error);
      }
    },
    openEditEventModal(event) {
      this.eventToBeUpdated = event;
      this.isEditEventModalActive = true;
    },
    async selectEventsFromStatus(status) {
      await this.$bind(
        "events",
        db
          .collection("stories")
          .doc(this.story.id)
          .collection("events")
          .where("storyStatus", "==", status)
          .where("stageId", "==", this.stage.id)
          .orderBy("number")
      );
    },
    isEventAuthor(event) {
      const currentUser = firebase.auth().currentUser;

      return event.author.uid === currentUser.uid;
    },
    async updateEvents() {
      this.startRequest();

      try {
        this.events.forEach(async (event, index) => {
          const currentNumber = index + 1;

          if (event.number !== currentNumber) {
            event.number = currentNumber;

            await db
              .collection("stories")
              .doc(this.story.id)
              .collection("events")
              .doc(event.id)
              .update(event);
          }
        });
      } catch (error) {
        this.errorHandler(error);
      }
      this.endRequest();
    }
  },
  created() {
    db.collection("stories")
      .doc(this.$route.params.storyId)
      .get()
      .then(doc => {
        this.story = doc.data();
        this.story.id = doc.id;

        this.stage = this.story.stages.filter(stage => {
          return stage.id === this.$route.params.stageId;
        })[0];

        this.$bind(
          "events",
          db
            .collection("stories")
            .doc(this.story.id)
            .collection("events")
            .where("storyStatus", "==", this.story.status)
            .where("stageId", "==", this.stage.id)
            .orderBy("number")
        );

        this.currentStatus = this.story.status;
      });
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
