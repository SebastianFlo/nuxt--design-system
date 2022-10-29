<template>
  <section class="[ theme-typography ]">
    <div class="[ theme-typography__text-row theme-typography__header ]">
      <div>Property</div>
      <div class="[ theme-typography__header-examples ]">
        <div>
          Size
        </div>
        <div>
          Mabry
        </div>
        <div>
          Canela
        </div>
      </div>
    </div>
    <div
      v-for="(type, i) in typography" :key="type + i"
      class="theme-typography__text-row">
      <div class="[ theme-typography__text-title ]">
        {{ type }}
      </div>
      <div class="[ theme-typography__examples ]">
        <div>
          {{ getSize(type) }}
        </div>
        <div
          :id="type" class="[ theme-typography__examples-main ]"
          :style="{
            'font-size': `var(${type})`,
          }">
          {{ getText(type, true) }}
        </div>
        <div
          v-if="secondary[type]" :id="type"
          :style="{
            'font-size': `var(${type})`,
            'font-family': 'var(--font-family--secondary)',
            'font-weight': 300
          }">
          {{ getText(type, false) }}
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    typography: [
      '--font-size--title-lg',
      '--font-size--title-base',
      '--font-size--title-sm',
      '--font-size--body-xl',
      '--font-size--body-lg',
      '--font-size--body-base',
      '--font-size--body-sm',
      '--font-size--body-xs',
    ],
    secondary: {
      '--font-size--title-base': '--font-secondary-size--title-base',
      '--font-size--title-sm': '--font-secondary-size--title-sm',
    },
  }),
  created() {
    if (!process.client) {
      return '';
    }
    window.addEventListener('resize', this.recalculateSizes);
  },
  destroyed() {
    if (!process.client) {
      return '';
    }
    window.removeEventListener('resize', this.recalculateSizes);
  },
  mounted() {
    this.$forceUpdate();
  },
  methods: {
    getSize(type: string): string {
      if (!process.client) {
        return '';
      }

      const text = document.getElementById(type);

      if (!text) {
        return '';
      }

      const fontSize = window.getComputedStyle(text).getPropertyValue('font-size').substring(0, 4);

      return fontSize.endsWith('px') ? fontSize : fontSize + 'px';
    },
    getText(type: string, titleUppercase: boolean) {
      if (type.includes('title')) {
        return titleUppercase ? 'Sebastian Florian' : 'Sebastian Florian';
      } else {
        return 'Your nuxt design system';
      }
    },
    recalculateSizes() {
      this.$forceUpdate();
    },
  },
});
</script>


<style lang="scss">
.theme-typography {
  padding: 2rem;
  display: grid;
  row-gap: 10px;
  width: 100%;

  .theme-typography__header {
    color: var(--c-dark-variant);
    font-weight: 600;

    >div:first-child {
      flex: 1;
    }

    >div:not(:first-child) {
      flex: 5;
    }


    .theme-typography__header-examples {
      display: flex;
      height: 30px;

      div {
        display: flex;
        align-items: center;
      }
    }
  }

  div {
    width: 100%;
  }

  div.theme-typography__text-row {
    display: flex;
    font-size: var(--font-size--body-base);

    >div:first-child {
      flex: 1;
    }

    div.theme-typography__text-title {
      align-items: center;
      display: flex;
      max-width: 30ch;
    }

    >div:not(:first-child) {
      flex: 5;
    }

    .theme-typography__examples {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      box-shadow: rgb(0 0 0 / 10%) 0px 1px 3px 0px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px;

      div {
        padding: var(--spacer-2xs);

        &:last-child {
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }

        &:last-child {
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
  }
}
</style>
