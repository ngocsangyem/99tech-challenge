<script setup lang="ts">
import CurrencySwapForm from './components/CurrencySwapForm.vue';
import ErrorBoundary from './components/ErrorBoundary.vue';
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
    <div class="container mx-auto py-8 max-w-2xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Currency Swap
        </h1>
        <p class="text-muted-foreground text-sm md:text-base">
          Swap your tokens at the best exchange rates
        </p>
      </div>

      <ErrorBoundary>
        <div class="animate-in fade-in-50 duration-500">
          <CurrencySwapForm />
        </div>
      </ErrorBoundary>
    </div>
  </div>
</template>
