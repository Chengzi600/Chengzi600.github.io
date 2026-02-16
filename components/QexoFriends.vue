<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Load CSS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/qexo-friends/friends.css'
  document.head.appendChild(link)

  // Load JavaScript library
  const script1 = document.createElement('script')
  script1.src = 'https://registry.npmmirror.com/qexo-static/1.6.0/files/hexo/friends.js'
  document.head.appendChild(script1)

  // Execute initialization
  const script2 = document.createElement('script')
  script2.textContent = 'loadQexoFriends("qexo-friends", "https://dash.zhaozilin.cn")'
  document.body.appendChild(script2)
})
</script>

<template>
  <!-- This component renders nothing, only loads resources on mount -->
</template>