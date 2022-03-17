<template>
  <footer v-if="content" class="footer-container">
    <div class="container">
      <h2 v-html="content.socialHeading" />
      <div class="social">
        <SocialIcons
          class="social-icon"
          v-for="(link, index) in content.socialIcons"
          :key="index"
          :svg="link.svg"
          :alt="link.alt"
          :title="link.title ? link.title : null"
          :url="link.url"
        />
      </div>
    </div>
  </footer>
</template>

<script setup>
import { defineProps } from "vue";
import SocialIcons from "./SocialIcons.vue";

defineProps({
  content: {
    type: Object,
    default: () => {},
  },
});
</script>

<style lang="scss" scoped>
.footer-container {
  margin: auto 0 0;
  padding: 2rem 0;
  background-color: $gray7;
}

.social {
  margin: 1rem -0.5rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;

  @media screen and (max-width: $md) {
    justify-content: space-between;
  }
}
</style>
