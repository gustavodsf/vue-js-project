import Vue from 'vue'

const requestMixin = {
  data () {
    return {
      isUnderRequest: false
    }
  },
  methods: {
    startRequest () {
      this.isUnderRequest = true
    },
    endRequest () {
      this.isUnderRequest = false
    }
  }
}

Vue.mixin(requestMixin)
