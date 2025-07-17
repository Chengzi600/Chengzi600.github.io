<script lang="ts" setup>
import type { Post } from 'valaxy'
import { useLayout } from 'valaxy'
import YunPostMeta from 'valaxy-theme-yun/components/YunPostMeta.vue'

defineProps<{
  frontmatter: Post
}>()

// 仅在 Post 布局显示
const isPost = useLayout('post')
</script>

<template>
  <YunPostMeta :frontmatter="frontmatter">
    <span v-if="isPost" id="busuanzi_container_page_pv">
    <span class="watch inline-flex-center gap-1" title="访问量"><div i-ri-eye-line=""></div><span id="busuanzi_value_page_pv" /></span></span>
  </YunPostMeta>
</template>