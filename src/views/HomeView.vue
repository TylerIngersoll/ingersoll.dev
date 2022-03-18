<template>
  <section v-if="content.home" class="home container">
    <transition
      name="fade"
      mode="out-in"
      v-for="(article, index) in content.home"
      :key="index"
    >
      <Article :article="article" :index="index" />
    </transition>
  </section>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  content: {
    type: Object,
    default: () => {},
  },
});
</script>
