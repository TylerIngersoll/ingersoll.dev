<template>
  <transition name="fade" mode="out-in">
    <div class="container wordle">
      <h2 class="first-heading">Projects - Wordle Clone</h2>
      <div class="game-wrapper" :key="instance">
        <div
          v-for="row in 6"
          :key="row"
          :ref="`row${row}`"
          :class="['row', `row-${row}`]"
        >
          <div
            v-for="tile in 5"
            :key="tile"
            :ref="`row${row}tile${tile}`"
            :class="['tile', `tile-${tile}`, 'empty']"
          >
            {{ getLetter(row, tile) }}
          </div>
        </div>

        <Keyboard :keyClass="keyClasses" @key-event="onKeyEvent" />

        <Modal
          :modalOpen="modalOpen"
          maxWidth="34rem"
          @modal-close="onModalClose"
        >
          <h1 class="modal-heading" v-if="success">You win! 🎉</h1>
          <h1 class="modal-heading" v-else>
            <span style="margin: 0 auto; display: block;"
              >😲 🤡 😲 🤡 😲 🤡
            </span>
            You lose! The word was:
            <span class="highlight">{{ baseWord }}</span>
          </h1>
          <Results v-if="modalOpen" :stats="stats" :attempt="row" />
        </Modal>
      </div></div
  ></transition>
</template>

<script>
import { Keyboard } from "../index";
import { Results } from "./";
import { Modal } from "../../components";
import { library, dictionary } from "./library";

export default {
  name: "WordleClone",

  components: { Keyboard, Modal, Results },

  data() {
    return {
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
    };
  },

  computed: {
    dictionary() {
      return this.library.concat(dictionary);
    },
  },

  methods: {
    getLetter(row, tile) {
      let letter = "";
      if (this.tiles[row - 1]) {
        letter = this.tiles[row - 1][tile - 1];
      }
      return letter;
    },

    splitWord(string) {
      return string.split("");
    },

    getWord() {
      this.baseWord = this.library[
        Math.floor(Math.random() * this.library.length)
      ];
      this.word = this.splitWord(this.baseWord);

      console.log(this.baseWord);
    },

    onReset() {
      this.inputValue = "";
      this.row = 1;
      this.tiles = [];
      this.guess = "";
      this.disableSubmit = true;
      this.instance = this.instance + 1;
      this.modalContent = "";
      this.getWord();
      this.success = false;
      this.keyClasses = [];
      this.stats = {};
      this.getStats();
    },

    onKeyEvent(key) {
      if (this.guess.length === 5 && key === "Enter") {
        if (this.success) return;
        this.splitGuess();
        this.onSubmit();
      } else if (key === "Backspace" && this.guess.length !== 0) {
        this.guess = this.guess.slice(0, -1);
        this.splitGuess();
      } else if (key === "Reset") {
        this.onReset();
      } else if (this.guess.length === 5) {
        this.guess = this.guess.slice(0, -1);
        this.guess = this.guess + key;
        this.splitGuess();
      } else if (key !== "Backspace" && key !== "Enter") {
        this.guess = this.guess + key;
        this.splitGuess();
      }
    },

    splitGuess() {
      this.tiles[this.row - 1] = this.splitWord(this.guess);
    },

    getMatches() {
      let matches = [];
      for (let i = 0; i < this.word.length; i++) {
        if (this.tiles[this.row - 1][i] === this.word[i]) {
          matches.push(this.tiles[this.row - 1][i]);
        }
      }
      return matches;
    },

    getOccurance(dataProp, letter) {
      let occurance = 0;
      for (var j = 0; j < this.word.length; ++j) {
        if (dataProp[j] == letter) occurance++;
      }
      return occurance;
    },

    setClasses() {
      const matches = this.getMatches();

      let presents = [];

      for (let i = 0; i < this.word.length; i++) {
        const tileLetter = this.tiles[this.row - 1][i];
        const tileEl = this.$refs[`row${this.row}tile${i + 1}`][0];
        const occuranceInWord = this.getOccurance(this.word, tileLetter);
        const occuranceInMatches = this.getOccurance(matches, tileLetter);

        if (tileLetter === this.word[i]) {
          tileEl.classList.add("match");
          this.keyClasses = [
            ...this.keyClasses,
            { key: this.word[i], class: "match" },
          ];
        } else if (this.word.includes(tileLetter)) {
          presents.push(tileLetter);
          const occuranceInPresents = this.getOccurance(presents, tileLetter);

          if (occuranceInPresents + occuranceInMatches > occuranceInWord) {
            tileEl.classList.add("miss");
          } else {
            tileEl.classList.add("present");
            this.keyClasses = [
              ...this.keyClasses,
              { key: tileLetter, class: "present" },
            ];
          }
        } else {
          tileEl.classList.add("miss");
          this.keyClasses = [
            ...this.keyClasses,
            { key: tileLetter, class: "miss" },
          ];
        }
      }
    },

    onSubmit() {
      if (this.row > 6) return;

      if (this.dictionary.includes(this.guess)) {
        this.setClasses();

        if (this.word.join("") === this.guess) {
          this.onSuccess();
        } else if (this.row === 6) {
          this.setStats();
          this.modalOpen = true;
          this.modalContent = `You lose! The word was ${this.word.join("")}!`;
        } else {
          this.row = this.row + 1;
          this.guess = "";
        }
      } else {
        this.$refs[`row${this.row}`][0].classList.add("oops");

        setTimeout(() => {
          this.$refs[`row${this.row}`][0].classList.remove("oops");
        }, 800);
      }
    },

    onSuccess() {
      this.success = true;
      this.$refs[`row${this.row}`][0].classList.add("success");
      this.setStats();

      setTimeout(() => {
        this.modalOpen = true;
      }, 4000);
    },

    onModalClose() {
      this.modalOpen = false;

      if (this.success) {
        // You win
        this.onReset();
      } else if (this.row === 6) {
        // You lose
        this.onReset();
      } else {
        this.guess = "";
      }
    },

    getStats() {
      const statsJSON = window.localStorage.getItem("wordleStats");

      if (statsJSON) {
        this.stats = JSON.parse(statsJSON);
      } else {
        this.stats = {
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
    },

    setStats() {
      if (this.success) {
        this.stats.gamesPlayed++;
        this.stats.totalWins++;
        this.stats.currentStreak++;
        this.stats.maxStreak =
          this.stats.currentStreak >= this.stats.maxStreak
            ? this.stats.currentStreak
            : this.stats.maxStreak;
        this.stats.winPercent = (
          (this.stats.totalWins / this.stats.gamesPlayed) *
          100
        ).toFixed();
        this.stats.guessDistribution[`guess${this.row}`]++;

        window.localStorage.setItem("wordleStats", JSON.stringify(this.stats));
      } else {
        this.stats.gamesPlayed++;
        this.stats.currentStreak = 0;
        this.stats.winPercent = (
          (this.stats.totalWins / this.stats.gamesPlayed) *
          100
        ).toFixed();

        window.localStorage.setItem("wordleStats", JSON.stringify(this.stats));
      }
    },
  },

  mounted() {
    this.getWord();
    this.getStats();
  },
};
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
