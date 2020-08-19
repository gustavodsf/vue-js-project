import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ptBR from '@/i18n/ptBR'

Vue.use(VueI18n)

const messages = {
  ptBR
}

export default new VueI18n({
  locale: 'ptBR', // set locale
  messages // set locale messages
})
