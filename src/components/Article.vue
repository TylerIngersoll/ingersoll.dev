<template>
  <article>
    <h3 :class="{ 'first-heading': index === 0 }" v-html="article.heading" />
    <p
      v-for="(para, paraIndex) in article.content"
      :key="paraIndex"
      v-html="para"
    />
    <slot />
  </article>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  article: {
    type: Object,
    default: () => {},
  },

  index: {
    type: Number,
    default: -1,
  },
});
</script>
