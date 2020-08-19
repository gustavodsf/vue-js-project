<template>
  <section class="section">
    <b-loading
      v-bind:is-full-page="true"
      v-bind:active.sync="isUnderRequest"
      v-bind:can-cancel="false"/>

    <div class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title">
              {{ story.title }}
            </h1>
          </div>
        </div>

        <div class="level-right">
          <div class="level-item">
            <button
              class="button is-primary is-rounded"
              v-if="isLeader && !isFinished"
              v-on:click="goToNextHistoryStage">
              {{ buttonNextStageText }}
            </button>
          </div>
        </div>
      </div>

      <div class="box">
        <h1 class="is-size-4 mb-4">
          {{ $tc('default.label.objective') }}
        </h1>

        <p>
          {{ story.objective }}
        </p>

        <pre
          class="mt-5"
          v-html="story.finalStory"
          v-if='isFinished'>
        </pre>

        <section v-else>
          <h1 class="is-size-4 mt-4 mb-4">
            {{ $tc('default.label.stage', story.stages.length) }}
          </h1>

          <div class="timeline">
            <div
              class="timeline-item"
              v-for="(stage, index) in orderedStages"
              v-bind:key="stage.id">
              <div
                class="timeline-marker is-32x32"
                v-bind:class="[ stage.events && stage.events.length === 0 ? 'is-danger' : 'is-primary']">
              </div>
              <b-tooltip
                v-bind:label="stage.description"
                position="is-right"
                animated
                multilined>
                <div class="timeline-content">
                  <router-link
                    class="heading has-badge-rounded"
                    v-bind:to="{ name: 'storyStageView', params: { storyId: story.id, stageId: stage.id } }">
                    {{ `${index + 1} - ${stage.name}` }}
                  </router-link>
                </div>
              </b-tooltip>
            </div>
          </div>
        </section>

      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import storyEnums from '@/app/story/story.enum'
import { db } from '@/libs/firebase'

export default {
  data () {
    return {
      buttonNextStageText: '',
      story: {}
    }
  },
  computed: {
    isLeader () {
      const currentUser = firebase.auth().currentUser

      return this.story.leader.uid === currentUser.uid
    },
    orderedStages () {
      const orderedStages = this.story.stages
      return orderedStages.sort((a, b) => (a.number > b.number) ? 1 : -1)
    },
    isFinished () {
      return storyEnums.STATUS.finished === this.story.status
    }
  },
  methods: {
    setButtonNextStageText () {
      const storyStatus = this.story.status

      switch (storyStatus) {
        case storyEnums.STATUS.underConstruction:
          this.buttonNextStageText = 'colocar história em revisão'
          break
        case storyEnums.STATUS.inReview:
          this.buttonNextStageText = 'definir história como revisada'
          break
        case storyEnums.STATUS.revised:
          this.buttonNextStageText = 'finalizar história'
          break
      }
    },
    async goToNextHistoryStage () {
      this.startRequest()
      const currentStatus = this.story.status
      const nextStatus = currentStatus + 1

      if (nextStatus === storyEnums.STATUS.finished) {
        await this.finishStory(currentStatus)
      } else {
        await this.goToNextStage(currentStatus, nextStatus)
      }

      this.setButtonNextStageText()
      this.endRequest()
    },
    async goToNextStage (currentStatus, nextStatus) {
      await db.collection('stories').doc(this.story.id).update({
        status: nextStatus
      })

      db.collection('stories')
        .doc(this.story.id)
        .collection('events')
        .where('storyStatus', '==', currentStatus)
        .get()
        .then(async querySnapshot => {
          querySnapshot.forEach(async doc => {
            let newEvent = doc.data()
            newEvent.storyStatus = nextStatus

            await db.collection('stories').doc(this.story.id).collection('events').add(newEvent)
          })
        })
    },
    async finishStory (currentStatus) {
      const events = []
      let finalStory = ''

      db.collection('stories')
        .doc(this.story.id)
        .collection('events')
        .where('storyStatus', '==', currentStatus)
        .get()
        .then(async querySnapshot => {
          querySnapshot.forEach(doc => {
            events.push(doc.data())
          })

          const stages = this.story.stages
          stages.sort((a, b) => (a.number > b.number) ? 1 : -1)

          stages.forEach((stage, index) => {
            if (index !== 0) {
              finalStory += '\n \n'
            }

            const stageEvents = events.filter(event => {
              return event.stageId === stage.id
            })

            stageEvents.sort((a, b) => (a.number > b.number) ? 1 : -1)
            stageEvents.forEach((event, index) => {
              if (event.number !== 1) {
                finalStory += '\n'
              }

              const body = event.keyPhrase !== '' ? event.keyPhrase + ' ' + event.body : event.body
              finalStory += body
            })
          })

          this.story.finalStory = finalStory
          this.story.status = storyEnums.STATUS.finished

          await db.collection('stories').doc(this.story.id).update(this.story)
        })
    }
  },
  async beforeMount () {
    await this.$bind('story', db.collection('stories').doc(this.$route.params.id))
    this.setButtonNextStageText()
  }
}
</script>

<style scoped>
.heading {
  font-size: 15px;
}
</style>
