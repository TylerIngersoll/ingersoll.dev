<template>
  <nav class="navigation-menu menu--spin" :class="{ active: nav.isOpen }">
    <button class="menu" type="button" tabindex="0" @click="onClick">
      <span class="menu-box">
        <span class="menu-inner" />
      </span>
    </button>
    <div class="mobile-navigation" :class="{ active: nav.isOpen }">
      <ul v-if="nav.isOpen" :class="['navigation-items', { open: nav.isOpen }]">
        <li
          v-for="(item, index) in content"
          class="navigation-item"
          :key="index"
          @keydown.enter="() => onKeydown(item.url)"
          @click="onClick"
        >
          <router-link :to="item.url" v-html="item.name" />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { defineEmits, defineProps, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  content: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["nav:clicked"]);
const nav = reactive({ isOpen: false });

const onClick = () => {
  nav.isOpen = !nav.isOpen;

  if (nav.isOpen) {
    document.body.classList.add("menu-open");
  } else {
    document.body.classList.remove("menu-open");
  }

  emit("nav:clicked", nav.isOpen);
};

const onKeydown = (url) => {
  router.push(url);
  onClick();
};
</script>

<style lang="scss" scoped>
$menu-padding-x: 2rem !default;
$menu-padding-y: 2rem !default;
$menu-layer-width: 40px !default;
$menu-layer-height: 4px !default;
$menu-layer-spacing: 6px !default;
$menu-layer-color: $highlight1 !default;
$menu-layer-border-radius: 4px !default;
$menu-hover-opacity: 1 !default;
$menu-active-layer-color: $menu-layer-color !default;
$menu-active-hover-opacity: $menu-hover-opacity !default;

$menu-hover-use-filter: true !default;
$menu-hover-filter: opacity(100%) !default;
$menu-active-hover-filter: $menu-hover-filter !default;

.navigation-menu {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}

.menu {
  padding: $menu-padding-y $menu-padding-x;
  display: inline-block;
  cursor: pointer;

  transition-property: opacity, filter;
  transition-duration: 0.15s;
  transition-timing-function: linear;

  font: inherit;
  color: inherit;
  text-transform: none;
  background-color: transparent;
  border: 0;
  margin: 0;
  overflow: visible;

  z-index: 3;

  &:focus {
    outline: 0;
  }

  &:hover {
    @if $menu-hover-use-filter == true {
      filter: $menu-hover-filter;
    } @else {
      opacity: $menu-hover-opacity;
    }
  }

  &.active {
    &:hover {
      @if $menu-hover-use-filter == true {
        filter: $menu-active-hover-filter;
      } @else {
        opacity: $menu-active-hover-opacity;
      }
    }

    .menu-inner,
    .menu-inner::before,
    .menu-inner::after {
      background-color: $menu-active-layer-color;
    }
  }
}

.menu-box {
  width: $menu-layer-width;
  height: $menu-layer-height * 3 + $menu-layer-spacing * 2;
  display: inline-block;
  position: relative;
}

.menu-inner {
  display: block;
  top: 50%;
  margin-top: $menu-layer-height / -2;

  &,
  &::before,
  &::after {
    width: $menu-layer-width;
    height: $menu-layer-height;
    background-color: $menu-layer-color;
    border-radius: $menu-layer-border-radius;
    position: absolute;
    transition-property: transform;
    transition-duration: 0.15s;
    transition-timing-function: ease;
  }

  &::before,
  &::after {
    content: "";
    display: block;
  }

  &::before {
    top: ($menu-layer-spacing + $menu-layer-height) * -1;
  }

  &::after {
    bottom: ($menu-layer-spacing + $menu-layer-height) * -1;
  }
}

.menu--spin {
  .menu-inner {
    transition-duration: 0.22s;
    transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);

    &::before {
      transition: top 0.1s 0.25s ease-in, opacity 0.1s ease-in;
    }

    &::after {
      transition: bottom 0.1s 0.25s ease-in,
        transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
  }

  &.active {
    .menu-inner {
      transform: rotate(225deg);
      transition-delay: 0.12s;
      transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);

      &::before {
        top: 0;
        opacity: 0;
        transition: top 0.1s ease-out, opacity 0.1s 0.12s ease-out;
      }

      &::after {
        bottom: 0;
        transform: rotate(-90deg);
        transition: bottom 0.1s ease-out,
          transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
      }
    }
  }
}

.mobile-navigation {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  background-color: $gray8;
  transform: translateX(120vw);
  transition: all 0.5s 0.3s ease-in-out;
  z-index: -1;

  &:after {
    content: "";
    background-image: url("../assets/drum_bg.png");
    background-size: cover;
    position: absolute;
    top: 1rem;
    right: 0;
    bottom: 0;
    left: -3rem;
    opacity: 0;
    transition: opacity 0.5s 0.75s ease-in;
    z-index: -1;
  }

  &.active {
    transform: translateX(0);

    &:after {
      opacity: 0.04;
    }
  }

  .navigation {
    &-items {
      list-style-type: none;
      margin-top: 6rem;
      padding: 1.5rem 2.5rem;
      overflow: hidden;
    }

    &-item {
      margin: 0 0 2rem;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      text-decoration: none;
      letter-spacing: 0.2rem;
      transition: all 0.3s;
      cursor: pointer;

      @media screen and (min-width: $md) {
        display: inline-block;
        margin: 0 2rem 1rem 0;
      }
    }
  }

  a {
    color: white;
    /* font-size: 1.1rem; */
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
      color: $highlight1;
      outline-offset: 3px;
      transition: all 0.3s;
    }
  }

  .router-link-exact-active {
    color: $highlight2;
    &:focus-visible {
      color: $highlight2;
    }
  }
}

button {
  &:focus-visible {
    .menu-box {
      outline: 2px solid $highlight5 !important;
      outline-offset: 0.5rem;
      border-radius: 2px;
      transition: all 0.3s;
    }
  }
}
</style>
