<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

//Iterate through all of the post data in supabase
//Create a series of posts to represent a feed
//Should basically be like Guess.vue since that represents the guesser's end

</script>

<template>
    <nav>
        <RouterLink to="/feed">Feed</RouterLink>
        <RouterLink to="/maps">Maps</RouterLink>
        <RouterLink to="/">login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <RouterLink to="/guess">Guess</RouterLink>
        <RouterLink to="/post">Post</RouterLink>
    </nav>
    <div>
        <h1>Welcome to GeoGuessr Social!</h1>
    </div>
</template>