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
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/maps',
      name: 'maps',
      component: () => import('../views/Maps.vue')
    },
    {
      path: '/guess',
      name: 'guess',
      component: () => import('../views/Guess.vue'),
      
    },
    {
      path: '/post',
      name: 'post',
      component: () => import('../views/Post.vue')
      component: () => import('../views/Guess1.vue')
    }

  ]
})

export default router