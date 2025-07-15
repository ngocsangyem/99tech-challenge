<template>
  <div class="space-y-2">
    <Label :for="inputId" class="text-sm font-medium">
      {{ label }}
    </Label>
    <div class="relative">
      <Input
        :id="inputId"
        :model-value="modelValue"
        :placeholder="placeholder"
        :readonly="readonly"
        :class="cn(
          'pr-16',
          error && 'border-destructive focus-visible:ring-destructive'
        )"
        type="text"
        inputmode="decimal"
        @input="handleInput"
        @blur="handleBlur"
      />
      <div v-if="tokenSymbol" class="absolute right-3 top-1/2 -translate-y-1/2">
        <span class="text-sm font-medium text-muted-foreground">
          {{ tokenSymbol }}
        </span>
      </div>
    </div>
    <div v-if="error" class="text-sm text-destructive">
      {{ error }}
    </div>
    <div v-if="usdValue && !error" class="text-sm text-muted-foreground">
      ≈ ${{ formatNumber(usdValue, 2) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePrices } from '@/composables'
import { formatAmountInput, parseAmount, formatNumber } from '@/utils/calculations'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { TokenSymbol } from '@/types'

interface Props {
  modelValue: string
  label: string
  placeholder?: string
  error?: string
  readonly?: boolean
  tokenSymbol?: TokenSymbol | null
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '0.0',
  error: '',
  readonly: false,
  tokenSymbol: null,
})

const emit = defineEmits<Emits>()

const { getPrice } = usePrices()

const inputId = `amount-input-${Math.random().toString(36).substr(2, 9)}`

const usdValue = computed(() => {
  if (!props.tokenSymbol || !props.modelValue) return null
  
  const amount = parseAmount(props.modelValue)
  const price = getPrice(props.tokenSymbol)
  
  if (amount <= 0 || !price) return null
  
  return amount * price
})

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const formatted = formatAmountInput(target.value)
  emit('update:modelValue', formatted)
}

const handleBlur = (): void => {
  if (!props.modelValue) return
  
  const amount = parseAmount(props.modelValue)
  if (amount > 0) {
    emit('update:modelValue', formatNumber(amount, 8))
  }
}
</script>
