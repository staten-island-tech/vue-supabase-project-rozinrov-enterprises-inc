import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

import { defineStore } from 'pinia'

const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Array<{ post_id: string, lat: number, lng: number, title: string, caption: string, created_at: string }>,
    selectedPost: null as { post_id: string, lat: number, lng: number } | null,
  }),
  actions: {
    setPosts(posts: Array<{ post_id: string, lat: number, lng: number, title: string, caption: string, created_at: string }>) {
      this.posts = posts
    },
    selectPost(post: { post_id: string, lat: number, lng: number }) {
      this.selectedPost = post
    },
  },
})

export default usePostStore