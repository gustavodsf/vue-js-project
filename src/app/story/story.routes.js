export default {
  path: "story",
  name: "story",
  redirect: { name: "storyList" },
  meta: {
    requiresSession: true
  },
  component: () =>
    import(/* webpackChunkName: "story" */ "@/app/story/views/Index.vue"),
  children: [
    {
      path: "list",
      name: "storyList",
      component: () =>
        import(/* webpackChunkName: "story" */ "@/app/story/views/List.vue")
    },
    {
      path: "create",
      name: "storyCreate",
      component: () =>
        import(/* webpackChunkName: "story" */ "@/app/story/views/Form.vue")
    },
    {
      path: "edit/:id",
      name: "storyEdit",
      component: () =>
        import(/* webpackChunkName: "story" */ "@/app/story/views/Form.vue")
    },
    {
      path: ":id",
      name: "storyView",
      component: () =>
        import(/* webpackChunkName: "story" */ "@/app/story/views/View.vue")
    },
    {
      path: ":storyId/stage/:stageId",
      name: "storyStageView",
      component: () =>
        import(
          /* webpackChunkName: "story" */ "@/app/story/views/StoryStage.vue"
        )
    }
  ]
};
