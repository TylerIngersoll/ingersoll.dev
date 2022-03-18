<template>
  <transition name="fade" mode="out-in">
    <div class="container wordle">
      <h2 class="first-heading">Projects - Wordle Clone</h2>
      <div class="game-wrapper" :key="data.instance">
        <div
          v-for="row in 6"
          :key="row"
          :ref="
            (el) => {
              rowRefs[`row${row}`] = el;
            }
          "
          :class="['row', `row-${row}`]"
        >
          <div
            v-for="tile in 5"
            :key="tile"
            :ref="
              (el) => {
                tileRefs[`row${row}-tile${tile}`] = el;
              }
            "
            :class="['tile', `tile-${tile}`, 'empty']"
          >
            {{ getLetter(row, tile) }}
          </div>
        </div>

        <Keyboard :keyClass="data.keyClasses" @key-event="onKeyEvent" />

        <Modal
          :modalOpen="data.modalOpen"
          maxWidth="34rem"
          @modal-close="onModalClose"
        >
          <h1 class="modal-heading" v-if="data.success">You win! 🎉</h1>
          <h1 class="modal-heading" v-else>
            <span style="margin: 0 auto; display: block"
              >😲 🤡 😲 🤡 😲 🤡
            </span>
            You lose! The word was:
            <span class="highlight">{{ data.baseWord }}</span>
          </h1>
          <Results
            v-if="data.modalOpen"
            :stats="data.stats"
            :attempt="data.row"
          />
        </Modal>
      </div></div
  ></transition>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from "vue";
import { Keyboard } from "../index";
import { Results } from "./";
import { Modal } from "../../components";
import { library, words } from "./library";

var rowRefs = ref([]);
var tileRefs = ref([]);

const data = reactive({
  library: library,
  baseWord: "",
  word: [],
  guess: "",
  inputValue: "",
  row: 1,
  tiles: [],
  instance: 0,
  keyClasses: [],
  modalOpen: false,
  modalContent: "",
  modalComponent: {},
  success: false,
  stats: {},
});

const dictionary = computed(() => {
  return data.library.concat(words);
});

const getLetter = (row, tile) => {
  let letter = "";
  if (data.tiles[row - 1]) {
    letter = data.tiles[row - 1][tile - 1];
  }
  return letter;
};

const splitWord = (string) => {
  return string.split("");
};

const getWord = () => {
  data.baseWord = data.library[Math.floor(Math.random() * data.library.length)];
  data.word = splitWord(data.baseWord);
};

const onReset = () => {
  data.inputValue = "";
  data.row = 1;
  data.tiles = [];
  data.guess = "";
  data.disableSubmit = true;
  data.instance = data.instance + 1;
  data.modalContent = "";
  data.success = false;
  data.keyClasses = [];
  data.stats = {};
  getWord();
  getStats();
};

const onKeyEvent = (key) => {
  if (data.guess.length === 5 && key === "Enter") {
    if (data.success) return;
    splitGuess();
    onSubmit();
  } else if (key === "Backspace" && data.guess.length !== 0) {
    data.guess = data.guess.slice(0, -1);
    splitGuess();
  } else if (key === "Reset") {
    onReset();
  } else if (data.guess.length === 5) {
    data.guess = data.guess.slice(0, -1);
    data.guess = data.guess + key;
    splitGuess();
  } else if (key !== "Backspace" && key !== "Enter") {
    data.guess = data.guess + key;
    splitGuess();
  }
};

const splitGuess = () => {
  data.tiles[data.row - 1] = splitWord(data.guess);
};

const getMatches = () => {
  let matches = [];
  for (let i = 0; i < data.word.length; i++) {
    if (data.tiles[data.row - 1][i] === data.word[i]) {
      matches.push(data.tiles[data.row - 1][i]);
    }
  }
  return matches;
};

const getOccurance = (dataProp, letter) => {
  let occurance = 0;
  for (var j = 0; j < data.word.length; ++j) {
    if (dataProp[j] == letter) occurance++;
  }
  return occurance;
};

const setClasses = () => {
  const matches = getMatches();

  let presents = [];

  for (let i = 0; i < data.word.length; i++) {
    const tileLetter = data.tiles[data.row - 1][i];
    const tileEl = tileRefs.value[`row${data.row}-tile${i + 1}`];

    const occuranceInWord = getOccurance(data.word, tileLetter);
    const occuranceInMatches = getOccurance(matches, tileLetter);

    if (tileLetter === data.word[i]) {
      tileEl.classList.add("match");
      data.keyClasses = [
        ...data.keyClasses,
        { key: data.word[i], class: "match" },
      ];
    } else if (data.word.includes(tileLetter)) {
      presents.push(tileLetter);
      const occuranceInPresents = getOccurance(presents, tileLetter);

      if (occuranceInPresents + occuranceInMatches > occuranceInWord) {
        tileEl.classList.add("miss");
      } else {
        tileEl.classList.add("present");
        data.keyClasses = [
          ...data.keyClasses,
          { key: tileLetter, class: "present" },
        ];
      }
    } else {
      tileEl.classList.add("miss");
      data.keyClasses = [
        ...data.keyClasses,
        { key: tileLetter, class: "miss" },
      ];
    }
  }
};

const onSubmit = () => {
  if (data.row > 6) return;

  if (dictionary.value.includes(data.guess)) {
    setClasses();

    if (data.word.join("") === data.guess) {
      onSuccess();
    } else if (data.row === 6) {
      setStats();
      data.modalOpen = true;
      data.modalContent = `You lose! The word was ${data.word.join("")}!`;
    } else {
      data.row = data.row + 1;
      data.guess = "";
    }
  } else {
    rowRefs.value[`row${data.row}`].classList.add("oops");

    setTimeout(() => {
      rowRefs.value[`row${data.row}`].classList.remove("oops");
    }, 800);
  }
};

const onSuccess = () => {
  data.success = true;
  rowRefs.value[`row${data.row}`].classList.add("success");
  setStats();

  setTimeout(() => {
    data.modalOpen = true;
  }, 4000);
};

const onModalClose = () => {
  data.modalOpen = false;

  if (data.success) {
    // You win
    onReset();
  } else if (data.row === 6) {
    // You lose
    onReset();
  } else {
    data.guess = "";
  }
};

const getStats = () => {
  const statsJSON = window.localStorage.getItem("wordleStats");

  if (statsJSON) {
    data.stats = JSON.parse(statsJSON);
  } else {
    data.stats = {
      gamesPlayed: 0,
      totalWins: 0,
      winPercent: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {
        guess1: 0,
        guess2: 0,
        guess3: 0,
        guess4: 0,
        guess5: 0,
        guess6: 0,
      },
    };
  }
};

const setStats = () => {
  if (data.success) {
    data.stats.gamesPlayed++;
    data.stats.totalWins++;
    data.stats.currentStreak++;
    data.stats.maxStreak =
      data.stats.currentStreak >= data.stats.maxStreak
        ? data.stats.currentStreak
        : data.stats.maxStreak;
    data.stats.winPercent = (
      (data.stats.totalWins / data.stats.gamesPlayed) *
      100
    ).toFixed();
    data.stats.guessDistribution[`guess${data.row}`]++;

    window.localStorage.setItem("wordleStats", JSON.stringify(data.stats));
  } else {
    data.stats.gamesPlayed++;
    data.stats.currentStreak = 0;
    data.stats.winPercent = (
      (data.stats.totalWins / data.stats.gamesPlayed) *
      100
    ).toFixed();

    window.localStorage.setItem("wordleStats", JSON.stringify(data.stats));
  }
};

onMounted(() => {
  getWord();
  getStats();
});
</script>

<style lang="scss" scoped>
.game-wrapper {
  max-width: 28rem;
  width: 100%;
  margin: 4rem auto 2rem;
}

::v-deep .keyboard {
  margin-top: 2rem;
}

.highlight {
  text-transform: uppercase;
  font-weight: bold;
  color: $highlight1;
}

.modal-heading {
  margin-bottom: 2rem;
}

.row {
  display: flex;
  justify-content: center;
  margin: 0 0 6px;

  &.oops {
    animation-name: shake;
    animation-duration: 0.125s;
    animation-iteration-count: 3;
  }
}

.tile {
  margin: 0 6px 0 0;
  max-width: 72px;
  width: 100%;
  height: 62px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  vertical-align: middle;
  box-sizing: border-box;
  text-transform: uppercase;
  user-select: none;
  border: 0;
  transition: background-color 0.5s ease-out;

  &.empty {
    border: 2px solid gray;
  }

  &.miss {
    border: 0;
    background-color: black;
  }

  &.present {
    border: 0;
    background-color: #b59f3b;
  }

  &.match {
    border: 0;
    background-color: #538d4e;
  }

  &-1 {
    transition-delay: 0;
  }

  &-2 {
    transition-delay: 0.25s;
  }

  &-3 {
    transition-delay: 0.5s;
  }

  &-4 {
    transition-delay: 0.75s;
  }

  &-5 {
    transition-delay: 1s;
  }
}

.success {
  .tile {
    animation: celebrate 0.25s linear 5;

    &-1 {
      animation-delay: 1.5s;
    }

    &-2 {
      animation-delay: 1.6s;
    }

    &-3 {
      animation-delay: 1.7s;
    }

    &-4 {
      animation-delay: 1.8s;
    }

    &-5 {
      animation-delay: 1.9s;
    }
  }
}

@keyframes celebrate {
  0% {
    transform: translateY(0);
  }
  25% {
    border: 2px solid black;
    transform: translateY(-15px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    border: 2px solid black;
    transform: translateY(15px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(0);
  }
  75% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
