<template>
  <transition name="fade" mode="out-in">
    <div
      v-show="props.modalOpen"
      class="modal-background"
      @click.self="onModalClose"
    >
      <div
        class="modal-window"
        tabindex="0"
        :style="`max-width: ${props.maxWidth}`"
        ref="modal"
        :role="props.modalOpen ? 'dialog' : null"
        :aria-modal="props.modalOpen ? 'true' : null"
        :aria-labelledby="props.modalTitle"
        :aria-describedby="props.modalContentId"
      >
        <button
          class="close-button"
          tabindex="0"
          @click="onModalClose"
          v-html="icons.close"
        />
        <slot>
          <span
            v-if="props.modalContent"
            :id="props.modalContentId"
            v-html="props.modalContent"
          />
          <component
            v-else-if="props.modalComponent"
            :is="props.modalComponent"
            :componentData="props.modalComponentData"
          />
        </slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {
  ref,
  computed,
  defineEmits,
  defineProps,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useContentStore } from "@/store";

const store = useContentStore();
const emit = defineEmits(["modal-close"]);
const modal = ref(null);

const props = defineProps({
  modalOpen: {
    type: Boolean,
    default: false,
  },

  modalTitle: {
    type: String,
    default: "",
  },

  modalContentId: {
    type: String,
    default: "",
  },

  modalContent: {
    type: String,
    default: "",
  },

  modalComponent: {
    type: Object,
    default: () => {},
  },

  modalComponentData: {
    type: Object,
    default: () => {},
  },

  maxWidth: {
    type: String,
    default: "",
  },
});

const icons = computed(() => {
  return store.content.icons;
});

const onModalClose = () => {
  if (props.modalOpen) {
    emit("modal-close");
    document.querySelector("body").classList.remove("modal-open");
  }
};

const onKeydown = (e) => {
  if (e.key === "Escape") onModalClose();
};

watch(
  () => props.modalOpen,
  () => {
    if (props.modalOpen) {
      nextTick(() => {
        modal.value.focus();
      });
      document.querySelector("body").classList.add("modal-open");
    } else {
      document.querySelector("body").classList.remove("modal-open");
    }
  }
);

onBeforeMount(() => {
  window.addEventListener("keydown", onKeydown);
});

onMounted(() => {
  if (props.modalOpen === true)
    document.querySelector("body").classList.add("modal-open");
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<style>
body.modal-open {
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.modal {
  &-background {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: rgba($gray7, 0.95);
    z-index: 200;
  }

  &-window {
    position: relative;
    max-width: calc(100% - 2rem);
    width: 100%;
    padding: 4rem 2rem 2rem;
    background-color: $gray8;
    border-radius: 1rem;
    border: 0.15rem solid black;

    @media screen and (min-width: $md) {
      max-width: calc(100% - 4rem);
      padding: 4rem;
    }

    &:focus-visible {
      outline: none;
    }

    * {
      font-size: 1.5rem;
    }
  }
}

button.close-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0;
  width: 2rem;
  height: 2rem;
  border: 0;
  outline: 0;
  background: transparent;

  &:hover {
    cursor: pointer;
  }

  &:focus-visible {
    outline-offset: 0.3rem;
    outline-color: $highlight5;
    outline-width: 0.2rem;
    outline-style: solid;
    border-radius: 50%;
  }
}
</style>

<style lang="scss">
.close-button {
  svg {
    width: 2rem;
    height: 2rem;
  }

  .svg-bg {
    stroke: none;
    fill: transparent;
  }
  .svg-x {
    stroke: white;
    height: 2rem;
    width: 2rem;
    transition: all 0.3s;
  }

  &:hover {
    .svg-x {
      stroke: $highlight1;
    }
  }
}
</style>
