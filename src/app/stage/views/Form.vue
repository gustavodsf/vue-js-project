<template>
  <section class="section">
    <div class="container">
      <h1 class="title"
        v-if="currentRoute === 'stageCreate'">
        {{ $t('default.label.add', [ $tc('default.label.stage', 1) ]) }}
      </h1>

      <h1 class="title"
        v-if="currentRoute === 'stageEdit'">
        {{ $t('default.label.edit', [ $tc('default.label.stage', 1) ]) }}
      </h1>

      <div class="box">
        <b-field
          v-bind:label="$tc('default.label.number', 1)"
          v-bind:type="{ 'is-danger': $v.stage.number.$error }"
          v-bind:message="[ !$v.stage.number.required && $v.stage.number.$error ? $t('error.field.is.required'):'',
                            !$v.stage.number.minValue && $v.stage.number.$error ? $t('error.minValue', [ '0' ]):'' ]">
          <b-numberinput
            v-model="stage.number"
            v-bind:disabled="isUnderRequest"
            min="0"/>
        </b-field>

        <b-field
          v-bind:label="$t('stage.view.form.label.name')"
          v-bind:type="{ 'is-danger': $v.stage.name.$error }"
          v-bind:message="[ !$v.stage.name.required && $v.stage.name.$error ? $t('error.field.is.required'):'']">
          <b-input
            v-model.trim="stage.name"
            v-bind:disabled="isUnderRequest"/>
        </b-field>

        <b-field
          v-bind:label="$t('stage.view.form.label.description')"
          v-bind:type="{ 'is-danger': $v.stage.description.$error }"
          v-bind:message="[ !$v.stage.description.required && $v.stage.description.$error ? $t('error.field.is.required'):'']">
          <b-input
            v-model.trim="stage.description"
            v-bind:disabled="isUnderRequest"
            type="textarea"/>
        </b-field>

        <b-field v-bind:label="$t('stage.view.form.label.archetypes')">
          <b-taginput
            v-model="stage.archetypes"
            v-bind:data="filteredArchetypesList"
            v-bind:disabled="isUnderRequest"
            v-on:typing="getFilteredArchetypes"
            field="name"
            type="is-primary"
            autocomplete>
            <template slot="empty">{{ $t('default.label.no.result') }}</template>
          </b-taginput>
        </b-field>

        <b-field v-bind:label="$t('stage.view.form.label.contexts')">
          <b-taginput
            v-model="stage.contexts"
            v-bind:disabled="isUnderRequest"
            type="is-primary"/>
        </b-field>

        <b-field v-bind:label="$t('stage.view.form.label.keyPhrases')">
          <b-taginput
            v-model="stage.keyPhrases"
            v-bind:disabled="isUnderRequest"
            type="is-primary"/>
        </b-field>

        <b-field v-bind:label="$t('stage.view.form.label.isRequired')">
          <b-switch
            v-model="stage.isRequired"
            v-bind:disabled="isUnderRequest">
            {{ stage.isRequired ? $t('default.label.required') : $t('default.label.optional') }}
          </b-switch>
        </b-field>

        <div class="has-text-centered">
          <b-button
            v-if="currentRoute === 'stageCreate'"
            v-on:click="addStage"
            v-bind:loading="isUnderRequest"
            type="is-primary"
            rounded>
            {{ $t('default.label.add', [ $tc('default.label.stage', 1) ]) }}
          </b-button>

          <b-button
            v-if="currentRoute === 'stageEdit'"
            v-on:click="editStage"
            v-bind:loading="isUnderRequest"
            type="is-primary"
            rounded>
            {{ $t('default.label.edit', [ $tc('default.label.stage', 1) ]) }}
          </b-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
import { db } from '@/libs/firebase'

export default {
  data () {
    return {
      currentRoute: this.$route.name,
      archetypesList: null,
      filteredArchetypesList: [],
      stage: {
        number: 0,
        name: '',
        description: '',
        archetypes: [],
        contexts: [],
        keyPhrases: [],
        isRequired: false
      }
    }
  },
  validations: {
    stage: {
      number: {
        required,
        minValue: minValue(0)
      },
      name: {
        required
      },
      description: {
        required
      }
    }
  },
  methods: {
    async getArchetypes () {
      try {
        await this.$bind('archetypesList', db.collection('archetypes'))
        this.filteredArchetypesList = this.archetypesList
      } catch (error) {
        throw error
      }
    },
    getFilteredArchetypes (text) {
      this.filteredArchetypesList = this.archetypesList.filter((archetype) => {
        return archetype.name.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0
      })
    },
    async addStage () {
      this.startRequest()
      try {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          await db.collection('stages').add(this.stage)

          this.$router.push({ name: 'stageList' })
        }
      } catch (error) {
        this.errorHandler(error)
      }
      this.endRequest()
    },
    async getStage (id) {
      this.startRequest()
      try {
        await this.$bind('stage', db.collection('stages').doc(id))
      } catch (error) {
        this.errorHandler(error)
      }
      this.endRequest()
    },
    async editStage () {
      this.startRequest()
      try {
        await db.collection('stages').doc(this.stage.id).update(this.stage)

        this.$router.push({ name: 'stageList' })
      } catch (error) {
        this.errorHandler(error)
      }
      this.endRequest()
    }
  },
  mounted () {
    this.getArchetypes()

    if (this.$route.params.id) {
      this.getStage(this.$route.params.id)
    }
  }
}
</script>
