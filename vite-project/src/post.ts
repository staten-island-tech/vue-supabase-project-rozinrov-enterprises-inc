import { defineStore } from 'pinia'

const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Array<{
      user_id: string,
      post_id: string,
      lat: number,
      lng: number,
      title: string,
      caption: string,
      created_at: string,
      played: number
    }>,
    selectedPost: null as { post_id: string, lat: number, lng: number } | null,
  }),
  actions: {
    setPosts(posts: Array<{
      user_id: string,
      post_id: string,
      lat: number,
      lng: number,
      title: string,
      caption: string,
      created_at: string
      played: number
    }>) {
      this.posts = posts
    },
    selectPost(post: { title: string, post_id: string, lat: number, lng: number }) {
      this.selectedPost = post
    },
    updatePost(updatedPost: {
      post_id: string,
      title: string,
      caption: string
    }) {
      const index = this.posts.findIndex(post => post.post_id === updatedPost.post_id)
      if (index !== -1) {
        this.posts[index] = { ...this.posts[index], ...updatedPost }
      }
    },
    deletePost(post_id: string) {
      this.posts = this.posts.filter(post => post.post_id !== post_id)
    }
  },
})

export default usePostStore