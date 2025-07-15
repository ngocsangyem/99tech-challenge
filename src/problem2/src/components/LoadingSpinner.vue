<template>
  <div class="flex items-center justify-center p-8">
    <div class="flex flex-col items-center space-y-4">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
      <p class="text-sm text-muted-foreground">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...',
})
</script>
