import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import i18n from "./i18n/i18n";
import "./libs";
import "./mixins";
import Notifications from "vue-notification";

Vue.use(Notifications);
Vue.config.productionTip = false;

firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount("#app");
});
