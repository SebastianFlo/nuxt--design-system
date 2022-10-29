<template>
  <SfModal
    :visible="isOpen || blok.isOpen" :title="forgotPasswordMode ? blok.forgotTitle : blok.title"
    class="sif-login" :class="blok.theme && `theme--${blok.theme}`"
    @close="() => $emit('cancel')">
    <h2
      v-html="renderRichText($storyapi, forgotPasswordMode ? blok.forgotHeadline : blok.headline, { unwrap: true })" />

    <Transition
      v-if="!successState"
      name="fade" mode="out-in">
      <form
        v-if="!forgotPasswordMode"
        ref="loginForm" key="1"
        novalidate>
        <SifCmsInput
          v-if="blok.emailInput && blok.emailInput.length" v-editable="blok.emailInput[0]"
          :value="prefilledEmail" :blok="blok.emailInput[0]"
          :error="formErrors.email && formErrors.email[0]"
          @enter="loginUser" />

        <SifCmsInput
          v-if="blok.passwordInput && blok.passwordInput.length" v-editable="blok.passwordInput[0]"
          :blok="blok.passwordInput[0]" :error="formErrors.password && formErrors.password[0]"
          @enter="loginUser" />
      </form>

      <form
        v-if="forgotPasswordMode"
        ref="forgotPassForm" key="2"
        novalidate>
        <SifCmsInput
          v-if="blok.emailInput && blok.emailInput.length" v-editable="blok.emailInput[0]"
          :blok="blok.emailInput[0]" :error="forgotFormErrors.email && forgotFormErrors.email[0]"
          @enter="forgotPassword" />
      </form>
    </Transition>

    <div
      v-if="!formErrors.default && !forgotFormErrors.default && userState && userState.error"
      class="sif-login--errors">
      {{ userState.error.value }}
    </div>

    <div
      v-if="formErrors.default"
      class="sif-login--errors">
      {{ formErrors.default[0] }}
    </div>

    <div
      v-if="forgotFormErrors.default"
      class="sif-login--errors">
      {{ forgotFormErrors.default[0] }}
    </div>

    <div
      v-if="successState"
      class="sif-login--success">
      <h3>{{ blok.successLabel }}</h3>
    </div>

    <SfButton
      v-if="!successState && !forgotPasswordMode" class="sf-button--pure"
      @click.prevent="forgotPasswordMode = true">
      {{ blok.forgotPasswordLabel }}
    </SfButton>

    <SfButton
      v-if="!successState && forgotPasswordMode" class="sf-button--pure"
      @click.prevent="forgotPasswordMode = false">
      {{ blok.backToLoginLabel }}
    </SfButton>

    <Transition
      v-if="!successState"
      name="fade" mode="out-in">
      <div
        v-if="!forgotPasswordMode"
        key="1" class="[ sf-modal__ctas ]">
        <SifCmsButton
          slot="primary-cta" v-editable="blok.primaryCTA"
          :blok="blok.primaryCTA && blok.primaryCTA[0]"
          @click.native="loginUser" />

        <SfButton
          class="sf-button--facebook"
          @click.prevent="loginUserWithFacebook()">
          {{ blok.loginFacebookLabel }}
        </SfButton>

      </div>

      <div
        v-if="forgotPasswordMode"
        key="2" class="[ sf-modal__ctas ]">
        <SifCmsButton
          slot="primary-cta" v-editable="blok.forgotPassCTA"
          :blok="blok.forgotPassCTA && blok.forgotPassCTA[0]" @click.native="forgotPassword" />
      </div>
    </Transition>
  </SfModal>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, useRoute } from '@nuxtjs/composition-api';
import { SfModal, SfButton } from '@storefront-ui/vue';

import { renderRichText, hasRichText } from '../../base/helpers/storyblock-richtext.helper';

import SifCmsButton from '../../atoms/button/SifCmsButton.vue';

export default defineComponent({
  components: {
    SfModal,
    SfButton,
    SifCmsButton,
  },
  props: {
    blok: {
      type: Object as PropType<{
        description: any,

      }>,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { emit }) {
    const loginForm = ref<HTMLFormElement | null>(null);
    const forgotPassForm = ref<HTMLFormElement | null>(null);
    const forgotPasswordMode = ref(false);
    const route = useRoute();

    const successState = ref(false);
    const prefilledEmail = computed(() => route.value.query?.email?.toString() ?? undefined);

    const loginUser = () => {
      emit('close');
    };

    const loginUserWithFacebook = () => {
      emit('close');
    };

    const forgotPassword = () => {
      emit('close');
    };

    return {
      loginForm,
      forgotPassForm,

      prefilledEmail,

      loginUser,
      loginUserWithFacebook,

      forgotPasswordMode,
      forgotPassword,

      hasRichText,
      renderRichText,

      successState,
    };
  },
});
</script>

<style lang="scss">
@import '@storefront-ui/shared/styles/helpers';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sif-ds {

  .sif-login {
    @include for-desktop {
      &.sf-modal {
        --modal-width: min(100vh, 25rem);
        --modal-max-height: 28rem;

      }
    }

    &--errors {
      margin-top: var(--spacer-2xs);
      color: var(--c-red);
    }

    &--success {
      margin-top: var(--spacer-2xs);
      color: var(--c-patina);
    }

    &.sf-modal {
      color: var(--theme-color);
      --modal-background: var(--theme-background);
      --modal-border: thin solid var(--theme-color);

      .sf-modal__content {
        form {
          display: flex;
          flex-direction: column;

          .sf-input {
            min-width: 20rem;

            .sf-input__label {
              --input-label-color: var(--theme-color);
            }

            .sf-input__password-button {
              --icon-color: var(--theme-color);
            }

            &:nth-of-type(2) {
              border-top: none;
            }
          }

          .sf-button {
            color: var(--theme-color);
            padding: var(--spacer-sm);

            &--pure {
              width: fit-content;
              align-self: center;
            }
          }
        }

        .sf-button--pure {
          margin-top: var(--spacer-2xs);
        }
      }

      .sf-modal__ctas {
        display: flex;
        flex-direction: column;
        padding-bottom: var(--spacer-base);
      }
    }

    .sf-button {
      &--facebook {
        --theme-color: #3b5998;
      }
    }
  }
}
</style>
