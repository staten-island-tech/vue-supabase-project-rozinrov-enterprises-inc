import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/feed',
      name: 'feed',
      component: () => import('../views/Feed.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/',
      name: 'login1',
      component: () => import('../views/Login1.vue')
    },
    {
      path: '/maps',
      name: 'maps',
      component: () => import('../views/Maps.vue')
    },
    {
      path: '/guess1',
      name: 'guess1',
      component: () => import('../views/Guess1.vue'),
      
    },
    {
      path: '/post',
      name: 'post',
      component: () => import('../views/Post.vue')
    }

  ]
})

export default router