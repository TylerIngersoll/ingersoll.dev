<template>
  <div class="app-upper">
    <Header :content="content.meta" />
    <MobileNav
      v-if="mediaQuery.isSmall"
      :content="content.navigation"
      @MobileNavClicked="onMobileNavClicked"
    />
    <Navigation v-if="!mediaQuery.isSmall" :content="content.navigation" />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :content="content" />
        </transition>
      </router-view>
    </main>
  </div>
  <Footer class="app-sticky-bottom" :content="content.footer" />
</template>

<script setup>
import { useContentStore } from "@/store";
import { reactive, inject, computed, onBeforeMount, onUnmounted } from "vue";

const store = useContentStore();
const mediaQuery = inject("mediaQuery");

const mobileNav = reactive({
  isOpen: false,
});

const content = computed(() => {
  return store.content || { meta: {}, navigation: {}, footer: {} };
});

const onMobileNavClicked = (value) => {
  mobileNav.isOpen = value;
};

onBeforeMount(() => store.loadContent());

onUnmounted(() => {
  this.$cleanupMediaQueryListeners();
});
</script>

<style lang="scss">
@import "@/styles/partials/fade";

* {
  font-family: "Roboto Condensed", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  background-color: $gray6;
  color: $gray0;
  font-size: 100%;
  line-height: 1.2;

  &.menu-open {
    overflow-y: hidden;
  }
}

h1,
h2,
h3,
h4,
h5 {
  margin: 0;
  transition: all 0.3s;

  &:focus-visible {
    outline-offset: 0.2rem;
  }
}

h1 {
  font-size: 2.5rem;
  color: $gray0;
}

h2 {
  margin-bottom: 2rem;
  font-size: 1.75rem;
  color: $highlight3;

  &.first-heading {
    @media screen and (max-width: $md) {
      padding-top: 2rem;
      border-top: 2px solid $highlight3;
    }
  }
}

h3 {
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
  color: $highlight3;
}

h4 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

h5 {
  font-size: 1rem;
}

p {
  line-height: 1.5;
}

a {
  color: $highlight1;
  transition: all 0.3s;

  &:hover {
    color: $highlight2;
  }

  &:focus-visible {
    outline-offset: 2px;
  }
}

article {
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
}

.container {
  max-width: 768px;
  width: 100%;
  padding: 10px 24px;
  margin: 0 auto;
}

.justified {
  text-align: justify;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

:focus-visible {
  outline: $highlight5 solid 2px;
  border-radius: 2px;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-upper {
  flex: 1 0 auto;
}

.app-sticky-bottom {
  flex-shrink: 0;
}
</style>
