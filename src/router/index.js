import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    name:'layout',
    path:'/',
    component: ()=> import('@/views/layout/LayoutIndex.vue'),
    redirect:'/article/manage',
    children: [
      {
        path: '/article/manage',
        component: () => import('@/views/article/ArticleManage.vue')
      },
      {
        path: '/article/channel',
        component: () => import('@/views/article/ArticleChannel.vue')
      },
      {
        path: '/user/profile',
        component: () => import('@/views/user/UserProfile.vue')
      },
      {
        path: '/user/avatar',
        component: () => import('@/views/user/UserAvatar.vue')
      },
      {
        path: '/user/password',
        component: () => import('@/views/user/UserPassword.vue')
      }
    ]
  },{
    name:'login',
    path:'/login',
    component: ()=> import('@/views/login/LoginIndex.vue'),
  }],
})

export default router
