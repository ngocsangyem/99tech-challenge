<template>
  <div v-if="hasError" class="flex items-center justify-center p-8">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-destructive">
          <AlertCircle class="h-5 w-5" />
          Something went wrong
        </CardTitle>
        <CardDescription>
          {{ errorMessage }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button @click="retry" class="w-full">
          <RefreshCw class="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import { AlertCircle, RefreshCw } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((error) => {
  hasError.value = true;
  errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred';
  return false;
});

const retry = (): void => {
  hasError.value = false;
  errorMessage.value = '';
  // Force a re-render by reloading the page
  window.location.reload();
};
</script>
