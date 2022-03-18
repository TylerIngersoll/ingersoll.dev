<template>
  <section v-if="projects" class="projects container">
    <h2 class="first-heading" v-html="projects.heading" />
    <p
      v-for="(para, paraIndex) in projects.summary"
      :key="paraIndex"
      v-html="para"
    />
    <Article
      v-for="(projectItem, index) in projects.projectList"
      :key="index"
      :article="projectItem"
    >
      <UntappdBeers
        v-if="projectItem.project === 'Untappd API'"
        sort="highest_rated_you"
        limit="10"
        :icons="true"
      />
    </Article>
    <!-- <article>

    </article> -->
  </section>
</template>

<script setup>
import { computed, defineProps } from "vue";
import { Article } from "@/components";

// eslint-disable-next-line no-unused-vars
import { UntappdBeers } from "@/projects";

const props = defineProps({
  content: {
    type: Object,
    default: () => {},
  },
});

const projects = computed(() => {
  return props.content.projects;
});
</script>

<style lang="scss" scoped></style>
