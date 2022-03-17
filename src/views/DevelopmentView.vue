<template>
  <section v-if="development" class="development container">
    <h2 class="first-heading" v-html="development.heading" />
    <article>
      <p
        v-for="(para, index) in development.summary"
        :key="index"
        v-html="para"
      />
    </article>
    <article>
      <h3>Tech stack</h3>
      <p class="tech-stack">
        <span
          v-for="(tech, index) in development.technologies"
          :key="index"
          class="tech-item"
        >
          <span class="tech" v-html="tech" />
          <span
            v-if="development.technologies.length - 1 !== index"
            class="bullet"
            >&bull;</span
          >
        </span>
      </p>
    </article>
  </section>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  content: {
    type: Object,
    default: () => {},
  },
});

const development = computed(() => {
  return props.content.development;
});
</script>

<style lang="scss" scoped>
.tech {
  transition: all 0.3s ease-in-out;

  &:hover {
    color: $highlight1;
    cursor: default;
  }

  &-stack {
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

.uses {
  &-item {
    ::v-deep > span {
      font-weight: 600;
      color: $highlight2;
      /* border-top: 1px solid $highlight3; */
      border-bottom: 1px solid $highlight3;
    }
  }
}

.job {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  h4 {
    margin-bottom: 0.5rem;
    font-weight: 400;
    font-size: 1rem;
  }

  .time-period {
    margin: 0;
    font-size: 1rem;
    font-weight: 400;

    @media screen and (min-width: 768px) {
      margin-left: 0.5rem;
    }
  }
}
</style>
