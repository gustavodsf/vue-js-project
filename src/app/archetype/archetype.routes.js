export default {
  path: "archetype",
  name: "archetype",
  redirect: { name: "archetypeList" },
  meta: {
    requiresSession: true
  },
  component: () =>
    import(
      /* webpackChunkName: "archetype" */ "@/app/archetype/views/Index.vue"
    ),
  children: [
    {
      path: "list",
      name: "archetypeList",
      component: () =>
        import(
          /* webpackChunkName: "archetype" */ "@/app/archetype/views/List.vue"
        )
    },
    {
      path: "create",
      name: "archetypeCreate",
      component: () =>
        import(
          /* webpackChunkName: "archetype" */ "@/app/archetype/views/Form.vue"
        )
    },
    {
      path: "edit/:id",
      name: "archetypeEdit",
      component: () =>
        import(
          /* webpackChunkName: "archetype" */ "@/app/archetype/views/Form.vue"
        )
    }
  ]
};
