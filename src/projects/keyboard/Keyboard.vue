<template>
  <div class="keyboard">
    <div v-for="(row, index) in keyboard.keys" :key="index" class="row">
      <button
        v-for="(key, keyIndex) in row"
        :key="keyIndex"
        :ref="
          (el) => {
            keyRefs[key] = el;
          }
        "
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

<script setup>
import {
  defineEmits,
  defineProps,
  reactive,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  watch,
} from "vue";

const keyRefs = ref([]);
const emit = defineEmits(["key-event"]);

const props = defineProps({
  /**
   * `{ key: 'x', class: 'miss | present | match' }`
   */
  keyClass: {
    type: Array,
    default: () => [],
  },
});

const keyboard = reactive({
  keys: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
    ["Enter", "Backspace" /*, "Reset"*/],
  ],
});

const keyset = computed(() => {
  return keyboard.keys[0].concat(
    keyboard.keys[1],
    keyboard.keys[2],
    keyboard.keys[3]
  );
});

const onKeyPress = (key) => {
  emit("key-event", key);
};

const onKeydown = (e) => {
  if (keyset.value.includes(e.key)) {
    onKeyPress(e.key);
    onPressed(e.key);
  }
};

const onKeyup = (e) => {
  if (keyset.value.includes(e.key)) {
    onRelease(e.key);
  }
};

const onPressed = (key) => {
  keyRefs.value[key].classList.add("pressed");
};

const onRelease = (key) => {
  keyRefs.value[key].classList.remove("pressed");
};

const updateKeyClass = () => {
  for (const key of props.keyClass) {
    keyRefs.value[`${key.key}`].classList.add(key.class);
  }
};

watch(
  () => props.keyClass,
  () => {
    if (props.keyClass.length > 0) updateKeyClass();
  }
);

onBeforeMount(() => {
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("keyup", onKeyup);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("keyup", onKeyup);
});
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
