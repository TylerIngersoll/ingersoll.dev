<template>
  <section v-if="content.projects" class="projects container">
    <transition
      name="fade"
      mode="out-in"
      v-for="(article, index) in content.projects"
      :key="index"
    >
      <Article :article="article" :index="index">
        <UntappdBeers
          v-if="article.component === 'UntappdBeers'"
          sort="highest_rated_you"
          limit="10"
          :icons="true"
        />
      </Article>
    </transition>
  </section>
</template>

<script setup>
import { defineProps } from "vue";

// eslint-disable-next-line no-unused-vars
import { UntappdBeers } from "@/projects";

defineProps({
  content: {
    type: Object,
    default: () => {},
  },
});
</script>
