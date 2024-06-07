<script setup lang="ts">


/* const users = ref([])

async function getUsers() {
  const { data } = await supabase.from('People').select()
  users.value = data
}

onMounted(() => {
  getUsers()
})

console.log(users)

async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'example3@email.com',
    password: 'example-password',
  })
}

signUpNewUser()

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'example@email.com',
    password: 'example-password',
  })
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
} */


</script>

<template>
  <div>
    <nav>
      <RouterLink to="/feed">Feed</RouterLink>
      <RouterLink to="/maps">Maps</RouterLink>
      <RouterLink to="/guess">Guess</RouterLink>
      <RouterLink to="/login">Log In</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
</style>