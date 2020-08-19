export default {
  path: 'stage',
  name: 'stage',
  redirect: { name: 'stageList' },
  meta: {
    requiresSession: true
  },
  component: () => import(/* webpackChunkName: "stage" */ '@/app/stage/views/Index.vue'),
  children: [
    {
      path: 'list',
      name: 'stageList',
      component: () => import(/* webpackChunkName: "stage" */ '@/app/stage/views/List.vue')
    },
    {
      path: 'create',
      name: 'stageCreate',
      component: () => import(/* webpackChunkName: "stage" */ '@/app/stage/views/Form.vue')
    },
    {
      path: 'edit/:id',
      name: 'stageEdit',
      component: () => import(/* webpackChunkName: "stage" */ '@/app/stage/views/Form.vue')
    }
  ]
}
