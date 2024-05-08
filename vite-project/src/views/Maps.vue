<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

const location = ref('')

console.log(location.value)

</script>

<template>
    <div>
        <h1>Google Maps Integration Test</h1>
        <input type="text" v-model="location" placeholder="Input Location" />
    </div>
</template>