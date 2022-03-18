<template>
  <header v-if="content" class="container">
    <div class="header-container">
      <div
        class="header-item header-container-content"
        @keydown.enter="() => $router.push('/')"
        @click="() => $router.push('/')"
      >
        <router-link to="/" custom>
          <h1
            class="name"
            tabindex="0"
            title="Home"
            role="link"
            v-html="content.name"
          />
        </router-link>
      </div>
      <div class="header-item header-container-image">
        <img
          src="/profile_glitch_subtle.gif"
          :alt="`Profile image of ${content.name}`"
        />
      </div>
    </div>
  </header>
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

<style lang="scss" scoped>
header {
  @media screen and (max-width: $md) {
    margin: 2rem 0 1rem;
    padding: 0 1rem;
  }
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap-reverse;
  margin: 2rem auto 0;

  @media screen and (min-width: $md) {
    margin: 2rem auto;
    justify-content: space-between;
  }

  &-content {
    margin-top: 1rem;
    width: 100%;
    text-align: center;

    @media screen and (min-width: $md) {
      margin-top: 0;
      width: auto;
      text-align: left;
    }
  }

  &-image {
    position: relative;
    width: 280px;
    height: 280px;
    border: 2px solid $highlight3;
    border-radius: 50%;
    overflow: hidden;

    @media screen and (min-width: $md) {
      width: 220px;
      height: 220px;
    }

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 100%;
    }
  }
}

.name {
  @media screen and (min-width: $md) {
    cursor: pointer;

    &::before {
      display: block;
      content: "";
      padding-bottom: 1rem;
      border-top: 2px solid $highlight3;
      transform: scaleX(0);
      transform-origin: 0% 50%;
      transition: transform 250ms ease-in-out;
    }

    &::after {
      display: block;
      content: "";
      padding-top: 1rem;
      border-bottom: 2px solid $highlight3;
      transform: scaleX(0);
      transform-origin: 50% 0%;
      transition: transform 250ms ease-in-out;
    }

    &:hover {
      color: $highlight1;

      &::before,
      &::after {
        transform: scaleX(1);
      }
    }
  }
}
</style>
