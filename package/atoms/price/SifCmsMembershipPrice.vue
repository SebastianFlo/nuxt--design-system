<template>
  <div class="sif-membership-price">
    <SfButton class="sf-button--outline">
      <SifPrice
        :regular="nonmemberPrice"
        :currency="currency"
        :info="nonmemberLabel"
        @click="$emit('nonMemberClick')"
      />
    </SfButton>

    <SfButton>
      <SifPrice
        :regular="memberPrice"
        :currency="currency"
        :info="memberLabel"
        @click="$emit('memberClick')"
      />
    </SfButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api';
import { SfButton } from '@storefront-ui/vue';

import { useDatasource } from '../../base/hooks/use-datasource';

import SifPrice from './SifPrice.vue';

export default defineComponent({
  components: {
    SfButton,
    SifPrice,
  },
  props: {
    memberPrice: {
      type: String,
      default: '',
    },
    nonmemberPrice: {
      type: String,
      default: '',
    },
    currency: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { dataSource } = useDatasource('generic-labels');

    const nonmemberLabel = computed(() => {
      return dataSource.value?.find(label => label.name === 'nonmember_label')?.value;
    });
    const memberLabel = computed(() => {
      return dataSource.value?.find(label => label.name === 'member_label')?.value;
    });

    return {
      nonmemberLabel,
      memberLabel,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/_helpers.scss';

.sif-ds {
  .sif-membership-price {
    --theme-background: var(--c-neon);
    --theme-color: var(--c-dark-green);
    border-color: var(--c-primary);
    display: flex;

    @include for-mobile() {
      width: 100%;
    }


    .sif-price {
      grid-template-areas:
        "info info info"
        "currency price .";
      justify-items: center;
      grid-template-rows: auto 1fr;

      .sif-price__regular {
        font-size: var(--font-size--body-base);
        font-weight: var(--font-weight--light);
      }

      .sif-price__info {
        font-size: var(--font-size--body-3xs);
      }
    }

    .sf-button {
      --button-height: max(35px, min(6vw, 45px));
      --button-width: 100%;
      font-style: normal;

      @include for-desktop() {
        --button-width: max(90px, min(12vw, 100px));
        min-width: 5rem;
      }
    }

    .sf-button:first-child {
      border-bottom-right-radius: 0px;
      border-top-right-radius: 0px;
      border-right: none;

      &:hover {
        .sif-price {
          --theme-color: var(--c-neon);
        }
      }
    }

    .sf-button:last-child {
      --button-border-color: var(--c-dark-green);
      --theme-color: var(--c-neon);
      --theme-background: var(--c-dark-green);
      border-bottom-left-radius: 0px;
      border-top-left-radius: 0px;

      &:hover {
        --button-hover-background: var(--c-dark-green);
        --button-hover-color: var(--c-neon);

        .sif-price {
          --theme-color: var(--c-neon);
        }
      }

      .sif-price {
        --theme-color: var(--c-dark-green);
        --theme-background: var(--c-neon);
      }
    }
  }
}
</style>
