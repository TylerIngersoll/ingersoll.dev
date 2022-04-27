<template>
  <div class="svg-footer-icon">
    <a
      :href="icon.url"
      :title="computedTitle"
      target="_blank"
      v-html="icon.svg"
    />
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const icon = defineProps({
  svg: {
    type: String,
    required: true,
  },

  alt: {
    type: String,
    required: true,
  },

  url: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: false,
  },
});

const computedTitle = computed(() => {
  return icon.title ? icon.title : `Follow me on ${icon.alt}`;
});
</script>

<style lang="scss">
.svg-footer-icon {
  padding: 0.5rem 0;

  @media screen and (min-width: $md) {
    padding: 0.5rem 1rem;
  }

  a {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border: 2px solid $highlight1;
    border-radius: 50%;
    transition: all 0.3s;

    svg {
      fill: $highlight1;
      max-height: 1rem;
      max-width: 1rem;
      width: 100%;
      height: 100%;
      transition: all 0.3s;

      &.github {
        max-height: 2rem;
        max-width: 2rem;
      }

      &.linkedin {
        max-height: 1.1rem;
        max-width: 1.1rem;
      }

      &.twitter {
        max-height: 1.5rem;
        max-width: 1.5rem;
      }
    }

    &:hover {
      border: 2px solid $highlight3;

      svg {
        fill: $highlight2;
      }
    }

    &:focus-visible {
      outline-offset: 0.5rem;
    }
  }
}
</style>
