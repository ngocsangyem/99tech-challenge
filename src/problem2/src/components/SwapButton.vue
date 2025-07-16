<template>
  <div class="flex items-center gap-2">
    <Button
      type="button"
      variant="outline"
      size="icon"
      class="shrink-0"
      :disabled="disabled"
      @click="$emit('swap')"
    >
      <ArrowUpDown class="h-4 w-4" />
    </Button>
    <Button
      type="submit"
      class="flex-1"
      :disabled="disabled || !canSubmit"
      @click="$emit('submit')"
    >
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      {{ buttonText }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Loader2 } from 'lucide-vue-next';

type Props = {
  isLoading?: boolean
  canSubmit?: boolean
  disabled?: boolean
  fromToken?: string | null
  toToken?: string | null
}

type Emits = {
  swap: []
  submit: []
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  canSubmit: false,
  disabled: false,
  fromToken: null,
  toToken: null,
});

defineEmits<Emits>();

const buttonText = computed(() => {
  if (props.isLoading) {
    return 'Swapping...';
  }

  if (!props.fromToken || !props.toToken) {
    return 'Select tokens';
  }

  if (!props.canSubmit) {
    return 'Enter amount';
  }

  return `Swap ${props.fromToken} to ${props.toToken}`;
});
</script>
