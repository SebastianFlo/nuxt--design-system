<template>
  <section
    class="[ theme-colors ]"
    :class="[theme && `theme--${theme}`]">
    <div class="[ theme-colors__color-row theme-colors__header ]">
      <div>Name</div>
      <div class="[ theme-colors__header-swatches ]">
        <div>
          Base
        </div>
        <div>
          Darken
        </div>
        <div>
          Lighten
        </div>
        <!-- <div>
          Variant
        </div> -->
      </div>
    </div>
    <div
      v-for="color in colors"
      :key="color" class="[ theme-colors__color-row ]">
      <div
        class="[ theme-colors__color-title ]"
        :style="'background-color: var(--c-' + color + '); color: var(--c-' + complementary[color] + ');'"
        @click="setTheme(color)">
        {{ color }} / {{ complementary[color] }}
        <em>{{ getHex(color) }}</em>
      </div>
      <div class="[ theme-colors__swatches ]">
        <div
          :id="color" :title="'--c-' + color"
          :style="'--hex: var(--c-' + color + '); color: var(--c-' + complementary[color] + ');background-color: var(--hex);'">
          {{ showVars ? '--c-' + color : getHex(color) }}
        </div>
        <div
          :id="color + '-darken'" :title="'--c-' + color + '-darken'"
          :style="'--hex: var(--c-' + color + '-darken); color: var(--c-' + complementary[color] + ');background-color: var(--hex);'">
          {{ showVars ? '--c-' + color + '-darken' : getHex(color + '-darken') }}
        </div>
        <div
          :id="color + '-lighten'" :title="'--c-' + color + '-lighten'"
          :style="'--hex: var(--c-' + color + '-lighten); color: var(--c-' + complementary[color] + ');background-color: var(--hex);'">
          {{ showVars ? '--c-' + color + '-lighten' : getHex(color + '-lighten') }}
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

import { rgb2hex } from './-utils';

export default defineComponent({
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    colors: [
      'blue',
      'clay',
      'creme',
      'dark-green',
      'dark-red',
      'lavender',
      'light-green',
      'light',
      'light-lighten',
      'neon',
      'patina',
      'peach',
      'pink',
      'red',
    ],
    complementary: {
      'blue': 'creme',
      'clay': 'neon',
      'creme': 'pink',
      'dark-green': 'neon',
      'dark-red': 'peach',
      'lavender': 'blue',
      'light-green': 'dark-green',
      'light': 'dark',
      'light-lighten': 'dark',
      'neon': 'dark-green',
      'patina': 'dark-green',
      'peach': 'dark-red',
      'pink': 'creme',
      'red': 'creme',
    },
    showVars: true,
    theme: '',
  }),
  created() {
    if (!process.client) {
      return '';
    }
    window.addEventListener('resize', this.recalculateHex);
  },
  destroyed() {
    if (!process.client) {
      return '';
    }
    window.removeEventListener('resize', this.recalculateHex);
  },
  mounted() {
    this.$forceUpdate();
  },
  methods: {
    getHex(color: string): string {
      if (!process.client) {
        return '';
      }

      const swatch = document.getElementById(color);

      if (!swatch) {
        return '';
      }

      const swatchBg = window.getComputedStyle(swatch).getPropertyValue('background-color');

      return rgb2hex(swatchBg);
    },
    setTheme(color) {
      this.theme = `${color}_${this.complementary[color]}`;
    },
    recalculateHex() {
      this.$forceUpdate();
    },
  },
});
</script>


<style lang="scss">
.theme-colors {
  color: var(--theme-color);
  background-color: var(--theme-background);
  padding: 2rem;
  display: grid;
  row-gap: 10px;
  width: 100%;

  .theme-colors__header {
    color: var(--theme-color, var(--c-dark-variant));
    font-weight: 600;

    .theme-colors__header-swatches {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr;
      height: 30px;

      .theme-colors__clickable {
        cursor: pointer;
        margin-left: 10px;
        width: 30px;
        height: 30px;
      }

      div {
        display: flex;
        align-items: center;
      }
    }
  }

  div {
    width: 100%;
  }

  div.theme-colors__color-row {
    display: flex;
    font-size: var(--font-size--body-base);

    div:first-child {
      flex: 1;
    }

    div.theme-colors__color-title {
      cursor: pointer;
      align-items: center;
      display: flex;
      padding: var(--spacer-2xs);
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      max-width: 30ch;
      justify-content: space-around;
    }

    div:not(:first-child) {
      flex: 3;
    }

    .theme-colors__swatches {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr;
      box-shadow: rgb(0 0 0 / 10%) 0px 1px 3px 0px;
      border-radius: 10px;

      div {
        padding: var(--spacer-2xs);

        &:last-child {
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
  }
}
</style>
