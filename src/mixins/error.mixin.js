import Vue from 'vue'

const errorMixin = {
  methods: {
    errorHandler (error) {
      const errorMessage = error.message ? error.message : error

      this.$buefy.toast.open({
        duration: 5000,
        message: errorMessage,
        type: 'is-danger'
      })
    }
  }
}

Vue.mixin(errorMixin)
