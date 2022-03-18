<template>
  <article>
    <component
      :is="headingLevel"
      :class="{ 'first-heading': props.index === 0 }"
      v-html="props.article.heading"
    />
    <p v-if="inlineStyle" class="inline-theme">
      <span
        v-for="(para, paraIndex) in props.article.content"
        :key="paraIndex"
        class="inline-item"
      >
        <span class="inline" v-html="para" />
        <span
          v-if="props.article.content.length - 1 !== paraIndex"
          class="bullet"
          >&bull;</span
        >
      </span>
    </p>
    <p
      v-else
      v-for="(para, paraIndex) in props.article.content"
      :key="paraIndex"
      v-html="para"
    />
    <slot />
  </article>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  article: {
    type: Object,
    default: () => {},
  },

  index: {
    type: Number,
    default: -1,
  },
});

const headingLevel = computed(() => {
  return props.article.headingLevel ? `h${props.article.headingLevel}` : "h3";
});

const inlineStyle = computed(() => {
  return props.article.contentStyle && props.article.contentStyle === "inline";
});
</script>

<style scoped lang="scss">
.inline {
  transition: all 0.2s ease-in-out;

  &:hover {
    color: $highlight1;
    cursor: default;
  }

  &-theme {
    line-height: 1.5;
    text-transform: lowercase;
  }

  &-item {
    display: inline-block;
    white-space: nowrap;
  }
}

.bullet {
  margin: 0 0.5rem;
}
</style>
