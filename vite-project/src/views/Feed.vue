<template>
  <div>
    <nav id="navbar">
      <RouterLink to="/">Login</RouterLink>
      <RouterLink to="/post">Post</RouterLink>
      <button @click="signOutCurrentUser">Logout</button>
      <div class="points">
        Total Points: {{ totalPoints }}
      </div>
    </nav>
    <div v-if="loading">
      <p>Loading posts...</p>
    </div>
    <div v-else>
      <h1>Welcome to GeoGuessr Social!</h1>
      <div v-if="posts.length === 0">No posts available.
        <button @click="retryFetchPosts">Retry</button></div>
      <div v-else>
        <div v-for="post in posts" :key="post.post_id" class="post">
          <h2>{{ post.title }}</h2>
          <p>{{ post.caption }}</p>
          <img :src="streetView(post.lat, post.lng)" alt="Street View Image" />
          <p><small>Posted on: {{ new Date(post.created_at).toLocaleString() }}</small></p>
          <p><small>Times Played: {{ post.played }}</small></p>
          <button @click="selectPost(post)">
            <RouterLink :to="{ name: 'guess1' }">Guess</RouterLink>
          </button>
          <button v-if="post.user_id === userId" @click="editPost(post)">Edit</button>
          <button v-if="post.user_id === userId" @click="deletePost(post.post_id)">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h2>Edit Post</h2>
        <form @submit.prevent="updatePost">
          <div>
            <label for="title">Title:</label>
            <input v-model="editPostData.title" type="text" id="title" required />
          </div>
          <div>
            <label for="caption">Caption:</label>
            <textarea v-model="editPostData.caption" id="caption" required></textarea>
          </div>
          <button type="submit">Update</button>
          <button type="button" @click="cancelEdit">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import usePostStore from '../post'
import { useRouter } from 'vue-router'

const store = usePostStore()
const totalPoints = ref(0)
const userId = ref<string | null>(null)
const showEditModal = ref(false)
const editPostData = ref({ post_id: '', title: '', caption: '' })
const loading = ref(true)
const router = useRouter()

async function signOutCurrentUser() {
  await supabase.auth.signOut();
  router.push('/')
}


const streetView = (lat: number, lng: number) => {
  const apiKey = "AIzaSyDALWA-g2AFNDsDyYFlo43-1mjrP3KsoL4"
  return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&key=${apiKey}`
}

async function fetchPosts() {
  loading.value = true
  const { data, error } = await supabase
    .from('Posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
  } else {
    store.setPosts(data)
    loading.value = false
  }
}

async function fetchPoints() {
  const user = await supabase.auth.getUser()
  if (!user) {
    console.error('User is not logged in.')
    return }

  if (user.data.user !== null){ const { data, error } = await supabase
    .from('Games')
    .select('points')
    .eq('user_id', user.data.user.id) 

  if (error) {
    console.error('Error fetching points:', error.message)
  } else {
    totalPoints.value = data.reduce((sum, game) => sum + game.points, 0)
  }
}
}
async function retryFetchPosts() {
  console.log(userId)
  await fetchPosts()
}

function selectPost(post: {title: string, post_id: string, lat: number, lng: number }) {
  store.selectPost(post)
}

function editPost(post: { post_id: string, title: string, caption: string }) {
  editPostData.value = { post_id: post.post_id, title: post.title, caption: post.caption }
  showEditModal.value = true
}

function cancelEdit() {
  showEditModal.value = false
  editPostData.value = { post_id: '', title: '', caption: '' }
}

async function updatePost() {
  const { error } = await supabase
    .from('Posts')
    .update({
      title: editPostData.value.title,
      caption: editPostData.value.caption
    })
    .eq('post_id', editPostData.value.post_id)

  if (error) {
    console.error('Error updating post:', error.message)
  } else {
    store.updatePost(editPostData.value)
    showEditModal.value = false
  }
}

async function deletePost(postId: string) {
  const { error } = await supabase
    .from('Posts')
    .delete()
    .eq('post_id', postId)

  if (error) {
    console.error('Error deleting post:', error.message)
  } else {
    store.deletePost(postId)
  }
}

onMounted(async () => {
  await fetchPosts()
  await fetchPoints()
  const user = await supabase.auth.getUser()
  if (userId.value !== null) {
    userId.toString()
  if (user) {
    if (userId.value !== null && user.data.user !== null) {
    userId.value = user.data.user.id
    }} }
}) 

const posts = store.posts
</script>

<style scoped>
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 10;
}

.post {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
}

h2 {
  margin-top: 0;
}

small {
  color: gray;
}

img {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: black;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
}
</style>