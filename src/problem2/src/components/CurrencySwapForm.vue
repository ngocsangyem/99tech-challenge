<template>
  <Card class="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle class="text-center">Currency Swap</CardTitle>
      <CardDescription class="text-center">
        Swap your tokens at the best rates
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Loading State -->
      <LoadingSpinner
        v-if="isLoading"
        message="Loading tokens and prices..."
      />

      <!-- Main Form -->
      <div v-else class="space-y-6">
      <!-- From Token Section -->
      <CurrencySelector
        v-model="fromToken"
        label="From"
        placeholder="Select token to swap from"
        :error="getFieldError('fromToken')"
        :exclude-token="toToken"
      />

      <!-- From Amount Input -->
      <AmountInput
        v-model="fromAmount"
        label="Amount"
        placeholder="0.0"
        :error="getFieldError('fromAmount')"
        :token-symbol="fromToken"
      />

      <!-- Swap Button and Exchange Rate -->
      <div class="space-y-3">
        <div v-if="exchangeRate && fromToken && toToken" class="text-center">
          <div class="text-sm text-muted-foreground">
            1 {{ fromToken }} = {{ formatNumber(exchangeRate.rate) }} {{ toToken }}
          </div>
        </div>

        <SwapButton
          :is-loading="swapState.isSubmitting"
          :can-submit="isValid && canPerformSwap"
          :disabled="isLoading"
          :from-token="fromToken"
          :to-token="toToken"
          @swap="handleSwapTokens"
          @submit="handleSubmit"
        />
      </div>

      <!-- To Token Section -->
      <CurrencySelector
        v-model="toToken"
        label="To"
        placeholder="Select token to swap to"
        :error="getFieldError('toToken')"
        :exclude-token="fromToken"
      />

      <!-- To Amount Input (Read-only) -->
      <AmountInput
        v-model="toAmount"
        label="You will receive"
        placeholder="0.0"
        :readonly="true"
        :token-symbol="toToken"
      />

      <!-- Error Display -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform scale-95"
        enter-to-class="opacity-100 transform scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 transform scale-100"
        leave-to-class="opacity-0 transform scale-95"
      >
        <div v-if="swapState.error" class="p-3 bg-destructive/10 border border-destructive rounded-md">
          <p class="text-sm text-destructive">{{ swapState.error }}</p>
        </div>
      </Transition>

      <!-- Success Message -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform scale-95"
        enter-to-class="opacity-100 transform scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 transform scale-100"
        leave-to-class="opacity-0 transform scale-95"
      >
        <div v-if="lastTransaction" class="p-3 bg-green-50 border border-green-200 rounded-md">
          <p class="text-sm text-green-800">
            Successfully swapped {{ formatNumber(lastTransaction.fromAmount) }} {{ lastTransaction.fromToken }}
            for {{ formatNumber(lastTransaction.toAmount) }} {{ lastTransaction.toToken }}
          </p>
        </div>
      </Transition>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import { useTokens, usePrices, useSwap } from '@/composables';
import { formatNumber } from '@/utils/calculations';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CurrencySelector from './CurrencySelector.vue';
import AmountInput from './AmountInput.vue';
import SwapButton from './SwapButton.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import type { SwapTransaction } from '@/types';

const { isLoading: tokensLoading } = useTokens();
const { isLoading: pricesLoading } = usePrices();

const {
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  swapState,
  isValid,
  errors,
  exchangeRate,
  canPerformSwap,
  swapTokens,
  submitSwap,
} = useSwap();

const lastTransaction: Ref<SwapTransaction | null> = ref(null);

const isLoading = computed(() => tokensLoading.value || pricesLoading.value);

const getFieldError = (fieldName: string): string => {
  const error = errors.value.find((err) => err.field === fieldName);
  return error?.message || '';
};

const handleSwapTokens = (): void => {
  swapTokens();
};

const handleSubmit = async (): Promise<void> => {
  const transaction = await submitSwap();
  if (transaction) {
    lastTransaction.value = transaction;
    // Clear the form after successful swap
    setTimeout(() => {
      lastTransaction.value = null;
    }, 5000);
  }
};
</script>
