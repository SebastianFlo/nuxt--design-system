<template>
  <SfDropdown
    :class="classes" :is-open="isOpen"
    :title="blok.title" @click:open="() => isOpen = !isOpen"
    @click:close="() => isOpen = false">
    <SfButton
      slot="opener"
      class="[ sf-button--full-width sf-dropdown__opener ]" @click.stop="() => isOpen = true">
      {{ blok.opener }}
    </SfButton>
    <SfList>
      <SfListItem
        v-for="action in actions"
        :key="action">
        <SfButton
          class="[ sf-button--full-width sf-button--underlined color-primary"
          @click.stop="() => doStuff(action)">
          {{ action }}
        </SfButton>
      </SfListItem>
    </SfList>
  </SfDropdown>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { SfDropdown, SfButton, SfList } from '@storefront-ui/vue';

export default defineComponent({
  components: {
    SfButton,
    SfDropdown,
    SfList,
  },
  props: {
    blok: {
      type: Object,
      required: true,
    },
  },
  setup({ blok }) {
    let actions: string[] = [];

    try {
      actions = JSON.parse(blok.actions);
    } catch (err) { }

    return {
      actions,
      isOpen: blok.isOpen,
    };
  },
  computed: {
    classes(): string {
      return [
        this.blok.direction === 'up' ? 'sf-dropdown--up' : null,
      ]
        .filter(Boolean)
        .join(' ');
    },
  },
  methods: {
    doStuff(action: string) {
      alert('action: ' + action);
      this.isOpen = false;
    },
  },
});
</script>
