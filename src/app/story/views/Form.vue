<template>
  <section class="section">
    <div class="container">
      <h1 class="title"
        v-if="currentRoute === 'storyCreate'">
        {{ $t('default.label.add', [ $tc('default.label.story', 1) ]) }}
      </h1>

      <h1 class="title"
        v-if="currentRoute === 'storyEdit'">
        {{ $t('default.label.edit', [ $tc('default.label.story', 1) ]) }}
      </h1>

      <div class="box">
        <b-steps
          type="is-primary"
          v-model="activeStep"
          v-bind:has-navigation="false">
          <b-step-item v-bind:label="$t('story.view.form.step.info')">
            <b-field
            v-bind:label="$t('story.view.form.label.title')"
            v-bind:type="{ 'is-danger': $v.story.title.$error }"
            v-bind:message="[ !$v.story.title.required && $v.story.title.$error ? $t('error.field.is.required'):'']">
              <b-input
                v-model.trim="story.title"
                v-bind:disabled="isUnderRequest"/>
            </b-field>

            <b-field
              v-bind:label="$t('story.view.form.label.keywords')"
              v-bind:message="$t('story.view.form.message.keywords')">
              <b-taginput
                type="is-primary"
                v-model="story.keywords"
                v-bind:disabled="isUnderRequest"/>
            </b-field>

            <b-field v-bind:label="$t('story.view.form.label.objective')">
              <b-input
                type="textarea"
                v-model.trim="story.objective"
                v-bind:disabled="isUnderRequest"/>
            </b-field>
          </b-step-item>

          <b-step-item v-bind:label="$t('story.view.form.step.author')">
            <b-field v-bind:label="$t('story.view.form.label.leader')">
              <b-input
                v-bind:value="story.leader.name"
                disabled/>
            </b-field>

            <b-field v-bind:label="$t('story.view.form.label.reviewers')">
              <b-taginput
                v-model="story.reviewers"
                v-bind:data="filteredUsersList"
                v-bind:disabled="isUnderRequest"
                v-on:typing="getFilteredUsers"
                field="name"
                type="is-primary"
                autocomplete>
              </b-taginput>
            </b-field>

            <b-field v-bind:label="$t('story.view.form.label.authors')">
              <b-taginput
                v-model="story.authors"
                v-bind:data="filteredUsersList"
                v-bind:disabled="isUnderRequest"
                v-on:typing="getFilteredUsers"
                field="name"
                type="is-primary"
                autocomplete>
              </b-taginput>
            </b-field>
          </b-step-item>

          <b-step-item v-bind:label="$t('story.view.form.step.archetype')">
            <b-table
              v-bind:data="archetypesTableData"
              v-bind:checked-rows.sync="story.archetypes"
              v-bind:show-detail-icon="true"
              v-bind:is-row-checkable="(row) => row.isRequired !== true"
              v-bind:loading="isUnderRequest"
              v-on:check-all="checkAllArchetypes"
              ref="archetypesTable"
              checkable
              detailed>
              <template slot-scope="props">
                <b-table-column
                  v-bind:label="$tc('default.label.archetype', 2)"
                  field="name"
                  width="180">
                  <a v-on:click="$refs.archetypesTable.toggleDetails(props.row)">
                    {{ props.row.name }}
                  </a>
                </b-table-column>

                <b-table-column
                  v-bind:label="$tc('default.label.character', 2)"
                  field="character">
                  <b-field
                    v-bind:type="{ 'is-danger': story.archetypes.includes(props.row) && !props.row.character && !archetypesAreValid }"
                    v-bind:message="[ story.archetypes.includes(props.row) && !props.row.character && !archetypesAreValid ? $t('error.field.is.required'):'']">
                    <b-input v-model.trim="props.row.character"/>
                  </b-field>
                </b-table-column>
              </template>

              <template
                slot="detail"
                slot-scope="props">
                {{ props.row.description }}
              </template>
            </b-table>
          </b-step-item>

          <b-step-item v-bind:label="$t('story.view.form.step.stage')">
            <b-table
              v-bind:data="stagesTableData"
              v-bind:checked-rows.sync="story.stages"
              v-bind:show-detail-icon="true"
              v-bind:is-row-checkable="(row) => row.isRequired !== true"
              v-bind:loading="isUnderRequest"
              v-on:check-all="checkAllStages"
              ref="stagesTable"
              checkable
              detailed>
              <template
                slot-scope="props">
                <b-table-column
                  v-bind:label="$tc('default.label.number', 1)"
                  field="description">
                  {{ props.row.number }}
                </b-table-column>

                <b-table-column
                  v-bind:label="$tc('default.label.stage', 2)"
                  field="name">
                  <a
                  v-on:click="$refs.stagesTable.toggleDetails(props.row)">
                    {{ props.row.name }}
                  </a>
                </b-table-column>

                <b-table-column
                  v-bind:label="$tc('default.label.description', 1)"
                  field="description">
                  {{ props.row.description }}
                </b-table-column>
              </template>

              <template
                slot="detail"
                slot-scope="props">
                <div class="columns">
                  <div class="column">
                    <div class="content">
                      <p>{{ $tc('default.label.context', 2) }}</p>
                      <ul>
                        <li
                          v-for="context in props.row.contexts"
                          v-bind:key="context">
                          {{ context }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="column">
                    <div class="content">
                      <p>{{ $tc('default.label.keyPhrase', 2) }}</p>
                      <ul>
                        <li
                          v-for="keyPhrase in props.row.keyPhrases"
                          v-bind:key="keyPhrase">
                          {{ keyPhrase }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </template>
            </b-table>
          </b-step-item>
        </b-steps>

        <div class="level m-t-3">
          <div class="level-left">
            <div class="level-item">
              <b-button
                v-if="activeStep > 0"
                v-on:click="previousStep"
                rounded>
                <vue-fontawesome icon="chevron-left"/>
                {{ $t('default.label.backward') }}
              </b-button>
            </div>
          </div>

          <div class="level-right">
            <div class="level-item">
              <b-button
                v-if="activeStep <= 2"
                v-on:click="nextStep"
                type="is-primary"
                rounded>
                {{ $t('default.label.forward') }}
                <vue-fontawesome icon="chevron-right"/>
              </b-button>

              <b-button
                v-if="activeStep === 3 && currentRoute === 'storyCreate'"
                v-on:click="addStory"
                v-bind:loading="isUnderRequest"
                type="is-primary"
                rounded>
                {{ $t('default.label.add', [ $tc('default.label.story', 1) ]) }}
              </b-button>

              <b-button
                v-if="activeStep === 3 && currentRoute === 'storyEdit'"
                v-on:click="editStory"
                v-bind:loading="isUnderRequest"
                type="is-primary"
                rounded>
                {{ $t('default.label.edit', [ $tc('default.label.story', 1) ]) }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import { required } from 'vuelidate/lib/validators'
import { db } from '@/libs/firebase'
import storyEnums from '@/app/story/story.enum'

export default {
  data () {
    return {
      activeStep: 0,
      userList: [],
      filteredUsersList: [],
      archetypesTableData: [],
      stagesTableData: [],
      archetypesAreValid: true,
      currentRoute: this.$route.name,
      story: {
        status: storyEnums.STATUS.underConstruction,
        title: null,
        keywords: [],
        objective: null,
        leader: {},
        reviewers: [],
        authors: [],
        archetypes: [],
        stages: []
      }
    }
  },
  validations: {
    story: {
      title: {
        required
      }
    }
  },
  methods: {
    nextStep () {
      if (this.activeStep === 0) {
        this.$v.story.title.$touch()
      }

      if (this.activeStep === 2) {
        this.validateArchetypes()
      }

      if (!this.$v.$invalid && this.archetypesAreValid && this.activeStep <= 2) {
        this.activeStep++
      }
    },
    previousStep () {
      if (this.activeStep > 0) {
        this.archetypesAreValid = true
        this.activeStep--
      }
    },
    async getUsers () {
      try {
        await this.$bind('userList', db.collection('users'))
        this.filteredUsersList = this.userList
      } catch (error) {
        throw error
      }
    },
    getFilteredUsers (text) {
      this.filteredUsersList = this.userList.filter((user) => {
        return user.name.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0
      })
    },
    async getArchetypes () {
      const querySnapshot = await db.collection('archetypes').orderBy('name').get()
      querySnapshot.forEach(doc => {
        let archetype = doc.data()
        archetype.id = doc.id
        this.archetypesTableData.push(archetype)
      })
    },
    checkAllArchetypes (archetypes) {
      const requiredArchetypes = this.archetypesTableData.filter(archetype => {
        return archetype.isRequired === true
      })

      archetypes.push.apply(archetypes, requiredArchetypes)
    },
    validateArchetypes () {
      this.archetypesAreValid = true

      this.story.archetypes.forEach(archetype => {
        if (!archetype.character) {
          this.archetypesAreValid = false
        }
      })
    },
    async getStages () {
      const querySnapshot = await db.collection('stages').orderBy('number').get()
      querySnapshot.forEach(doc => {
        let stage = doc.data()
        stage.id = doc.id
        this.stagesTableData.push(stage)
      })
    },
    checkAllStages (stages) {
      const requiredStages = this.stagesTableData.filter(stage => {
        return stage.isRequired === true
      })

      stages.push.apply(stages, requiredStages)
    },
    async addStory () {
      this.startRequest()
      try {
        if (!this.$v.$invalid && this.archetypesAreValid && this.activeStep === 3) {
          await db.collection('stories').add(this.story)

          this.$router.push({ name: 'storyList' })
        }
      } catch (error) {
        this.errorHandler(error)
      }
      this.endRequest()
    },
    async getStory (id) {
      this.startRequest()
      try {
        await this.$bind('story', db.collection('stories').doc(id))
      } catch (error) {
        this.errorHandler(error)
      }
      this.endRequest()
    },
    async editStory () {
      this.startRequest()
      try {
        if (!this.$v.$invalid && this.archetypesAreValid && this.activeStep === 3) {
          await db.collection('stories').doc(this.story.id).update(this.story)

          this.$router.push({ name: 'storyList' })
        }
      } catch (error) {
        this.errorHandler(error)
      }
      this.endRequest()
    }
  },
  async beforeMount () {
    if (this.$route.params.id) {
      await this.getStory(this.$route.params.id)
    }

    await this.getUsers()
    await this.getArchetypes()
    await this.getStages()

    if (this.$route.params.id) {
      this.story.archetypes.forEach(storyArchetype => {
        this.archetypesTableData = this.archetypesTableData.filter(archetype => {
          return archetype.name !== storyArchetype.name
        })
        this.archetypesTableData.push(storyArchetype)
      })
      this.archetypesTableData.sort((a, b) => (a.name > b.name) ? 1 : -1)

      this.story.stages.forEach(storyStage => {
        this.stagesTableData = this.stagesTableData.filter(stage => {
          return stage.name !== storyStage.name
        })
        this.stagesTableData.push(storyStage)
      })
      this.stagesTableData.sort((a, b) => (a.number > b.number) ? 1 : -1)
    } else {
      const currentUser = firebase.auth().currentUser

      this.story.leader = {
        uid: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email
      }

      this.story.archetypes = this.archetypesTableData.filter(archetype => {
        return archetype.isRequired === true
      })

      this.story.stages = this.stagesTableData.filter(stage => {
        return stage.isRequired === true
      })
    }
  }
}
</script>
