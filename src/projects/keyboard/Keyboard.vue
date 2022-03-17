<template>
  <div class="keyboard">
    <div v-for="(row, index) in keys" :key="index" class="row">
      <button
        v-for="(key, keyIndex) in row"
        :key="keyIndex"
        :ref="`key${key}`"
        :class="['key', key.toLowerCase()]"
        @click="() => onKeyPress(key)"
        @touch="() => onKeyPress(key)"
        @mousedown="() => onPressed(key)"
        @mouseup="() => onRelease(key)"
        v-html="key"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Keyboard",

  props: {
    /**
     * `{ key: 'x', class: 'miss | present | match' }`
     */
    keyClass: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      keys: [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m"],
        ["Enter", "Backspace" /*, "Reset"*/],
      ],
    };
  },

  computed: {
    keyset() {
      return this.keys[0].concat(this.keys[1], this.keys[2], this.keys[3]);
    },
  },

  methods: {
    onKeyPress(key) {
      this.$emit("key-event", key);
    },

    onKeydown(e) {
      if (this.keyset.includes(e.key)) {
        this.onKeyPress(e.key);
        this.onPressed(e.key);
      }
    },

    onKeyup(e) {
      if (this.keyset.includes(e.key)) {
        this.onRelease(e.key);
      }
    },

    onPressed(key) {
      this.$refs[`key${key}`][0].classList.add("pressed");
    },

    onRelease(key) {
      this.$refs[`key${key}`][0].classList.remove("pressed");
    },

    updateKeyClass() {
      for (const key of this.keyClass) {
        this.$refs[`key${key.key}`][0].classList.add(key.class);
      }
    },
  },

  watch: {
    keyClass() {
      if (this.keyClass.length > 0) {
        this.updateKeyClass();
      }
    },
  },

  created() {
    window.addEventListener("keydown", this.onKeydown);
    window.addEventListener("keyup", this.onKeyup);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeydown);
    window.removeEventListener("keyup", this.onKeyup);
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px auto;
}

.key {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 2px 2px;
  padding: 1rem 0.725rem;
  font-family: inherit;
  font-size: 0.8rem;
  line-height: 0;
  text-transform: uppercase;
  font-weight: bold;
  border: 2px solid gray;
  border-radius: 0.6rem;
  background-color: #222;
  color: white;
  transition: box-shadow 0.025s ease-in-out, background-color 0.4s 1.6s ease-in;

  @media screen and (min-width: $md) {
    padding: 1.2rem 0.8rem;
    font-family: inherit;
    font-size: 1.2rem;
  }

  &:focus-visible {
    outline: none;
  }

  &.pressed {
    box-shadow: inset 0 0 16px #000, inset 0 0 8px #000, inset 0 0 4px #000;
  }

  &.miss {
    background-color: black;
  }

  &.present {
    background-color: #b59f3b;
  }

  &.match {
    background-color: #538d4e;
  }

  &.enter {
    width: 10rem;
    margin-top: 1.5rem;
    margin-right: 4rem;
    background-color: $highlight5;
  }

  &.backspace {
    width: 10rem;
    margin-top: 1.5rem;
    margin-left: 4rem;
    color: $gray8;
    background-color: $highlight2;
  }

  &.reset {
    margin-top: 1.5rem;
    background-color: $highlight4;
  }
}
</style>
