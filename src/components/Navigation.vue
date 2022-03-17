<template>
  <nav class="navigation">
    <div class="container">
      <ul class="navigation-items">
        <li
          v-for="(item, index) in content"
          :key="index"
          class="navigation-item"
        >
          <router-link :to="item.url" v-html="item.name" />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  content: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.navigation {
  padding-bottom: 1rem;

  &-items {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    border-bottom: 2px solid $highlight3;
  }

  &-item {
    display: none;
    margin: 0 0 1rem 0;
    transition: all 0.3s;

    @media screen and (min-width: $md) {
      display: inline-block;
      margin: 0 2rem 1rem 4px;
    }

    &::before {
      display: block;
      content: "";
      padding-bottom: 1rem;
      border-top: 2px solid $highlight3;
      transform: scaleX(0);
      transform-origin: 0% 50%;
      transition: transform 250ms ease-in-out;
    }

    &:hover {
      &::before {
        transform: scaleX(1);
      }
    }
  }
}

a {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.2rem;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: $highlight1;
  }

  &:focus-visible {
    outline-offset: 3px;
    transition: all 0.3s;
  }
}

.router-link-exact-active {
  display: inline-block;
  color: $highlight2;

  @media screen and (max-width: 767px) {
    pointer-events: none;
    cursor: default;
  }
}
</style>
