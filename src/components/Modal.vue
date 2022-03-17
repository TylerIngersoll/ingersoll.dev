<template>
  <transition name="fade" mode="out-in">
    <div v-show="modalOpen" class="modal-background" @click.self="onModalClose">
      <div
        class="modal-window"
        tabindex="0"
        :style="`max-width: ${maxWidth}`"
        ref="modal"
        :role="modalOpen ? 'dialog' : null"
        :aria-modal="modalOpen ? 'true' : null"
        :aria-labelledby="modalTitle"
        :aria-describedby="modalContentId"
      >
        <button
          class="close-button"
          tabindex="0"
          @click="onModalClose"
          v-html="icons.close"
        />
        <slot>
          <span
            v-if="modalContent"
            :id="modalContentId"
            v-html="modalContent"
          />
          <component
            v-else-if="modalComponent"
            :is="modalComponent"
            :componentData="modalComponentData"
          />
        </slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "modal-component",

  props: {
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
  },

  computed: {
    icons() {
      return this.$store.state.content.icons;
    },
  },

  watch: {
    modalOpen(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.modal.focus();
        });
        document.querySelector("body").classList.add("modal-open");
      } else {
        document.querySelector("body").classList.remove("modal-open");
      }
    },
  },

  created() {
    window.addEventListener("keydown", this.onKeydown);
  },

  mounted() {
    if (this.modalOpen === true)
      document.querySelector("body").classList.add("modal-open");
  },

  methods: {
    onModalClose() {
      if (this.modalOpen) {
        this.$emit("modal-close");
        document.querySelector("body").classList.remove("modal-open");
      }
    },

    onKeydown(e) {
      if (e.key === "Escape") this.onModalClose();
    },
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeydown);
  },
};
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
    background-color: rgba($gray8, 0.85);
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
