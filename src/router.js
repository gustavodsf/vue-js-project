import Vue from "vue";
import Router from "vue-router";
import * as firebase from "firebase/app";
import archetype from "@/app/archetype/archetype.routes";
import stage from "@/app/stage/stage.routes";
import story from "@/app/story/story.routes";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: { name: "home" },
      component: () => import(/* webpackChunkName: "init" */ "@/app/Index.vue"),
      children: [
        {
          path: "home",
          name: "home",
          component: () =>
            import(/* webpackChunkName: "init" */ "@/app/Home.vue")
        },
        {
          path: "singup",
          name: "singUp",
          component: () =>
            import(/* webpackChunkName: "init" */ "@/app/SingUp.vue")
        },
        {
          path: "singin",
          name: "singIn",
          component: () =>
            import(/* webpackChunkName: "init" */ "@/app/SingIn.vue")
        },
        {
          path: "404",
          name: "404",
          component: () =>
            import(/* webpackChunkName: "init" */ "@/app/404.vue")
        },
        archetype,
        stage,
        story
      ]
    },
    {
      path: "*",
      redirect: {
        name: "404"
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const sessionExists = firebase.auth().currentUser;
  const requiresSession = to.matched.some(route => route.meta.requiresSession);

  if (requiresSession && sessionExists) {
    next();
  }

  if (!requiresSession && !sessionExists) {
    next();
  }

  if (!requiresSession && sessionExists) {
    next({ name: "storyList" });
  }

  if (requiresSession && !sessionExists) {
    next({ name: "home" });
  }

  if (to.name === "404") {
    next();
  }
});

export default router;
