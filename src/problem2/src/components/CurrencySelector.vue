<template>
  <div class="space-y-2">
    <Label :for="inputId" class="text-sm font-medium">
      {{ label }}
    </Label>
    <Select v-model="model" @update:model-value="searchQuery = ''">
      <SelectTrigger :id="inputId" class="w-full">
        <SelectValue :placeholder="placeholder">
          <div v-if="selectedToken" class="flex items-center gap-2">
            <img
              :src="selectedToken.iconUrl"
              :alt="selectedToken.symbol"
              class="w-5 h-5 rounded-full"
              @error="handleImageError"
            />
            <span class="text-muted-foreground text-sm">{{ selectedToken.name }}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div class="p-2">
          <Input
            v-model="searchQuery"
            placeholder="Search tokens..."
            class="mb-2"
            @click.stop
          />
        </div>
        <SelectItem
          v-for="token in filteredTokens"
          :key="token.symbol"
          :value="token.symbol"
          class="cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <img
              :src="token.iconUrl"
              :alt="token.symbol"
              class="w-5 h-5 rounded-full"
              @error="handleImageError"
            />
            <span class="font-medium">{{ token.symbol }}</span>
            <span class="text-muted-foreground text-sm">{{ token.name }}</span>
          </div>
        </SelectItem>
        <div v-if="filteredTokens.length === 0" class="p-4 text-center text-muted-foreground">
          No tokens found
        </div>
      </SelectContent>
    </Select>
    <div v-if="error" class="text-sm text-destructive">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTokens, usePrices } from '@/composables';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TokenSymbol } from '@/types';

type Props = {
  label: string
  placeholder?: string
  error?: string
  excludeToken?: TokenSymbol | null
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select a token',
  error: '',
  excludeToken: null,
});

const model = defineModel<string | null>({ default: null });

const { tokens, getToken } = useTokens();
const { availableTokens } = usePrices();

const searchQuery = ref('');
const inputId = `currency-selector-${Math.random().toString(36).substring(2, 11)}`;

const selectedToken = computed(() => {
  return model.value ? getToken(model.value) : null;
});

const filteredTokens = computed(() => {
  const query = searchQuery.value?.toLowerCase().trim() || '';

  return tokens.value
    .filter((token) => {
      // Ensure token has required properties
      if (!token || !token.symbol || !token.name) return false;

      // Only show tokens that have prices
      if (!availableTokens.value.includes(token.symbol)) return false;

      // Exclude the specified token
      if (props.excludeToken && token.symbol === props.excludeToken) return false;

      // Filter by search query
      if (query) {
        return (
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => (a.symbol || '').localeCompare(b.symbol || ''));
});

const handleImageError = (event: Event): void => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
};
</script>
