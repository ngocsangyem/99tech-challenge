import { ref, computed, watch, type Ref } from 'vue'
import { usePrices } from './usePrices'
import { validateSwapForm } from '@/utils/validation'
import { parseAmount, formatNumber } from '@/utils/calculations'
import type { SwapFormData, SwapState, SwapTransaction, TokenSymbol } from '@/types'

export const useSwap = () => {
  const { getExchangeRate, convert, canSwap } = usePrices()

  // Form state
  const fromToken: Ref<TokenSymbol | null> = ref(null)
  const toToken: Ref<TokenSymbol | null> = ref(null)
  const fromAmount: Ref<string> = ref('')
  const toAmount: Ref<string> = ref('')

  // Swap state
  const swapState: Ref<SwapState> = ref({
    isLoading: false,
    isSubmitting: false,
    error: null,
    lastSwapTime: null,
  })

  // Computed form data
  const formData = computed((): SwapFormData => ({
    fromToken: fromToken.value,
    toToken: toToken.value,
    fromAmount: fromAmount.value,
    toAmount: toAmount.value,
  }))

  // Validation
  const validation = computed(() => {
    return validateSwapForm(formData.value)
  })

  const isValid = computed(() => validation.value.isValid)
  const errors = computed(() => validation.value.errors)

  // Exchange rate calculation
  const exchangeRate = computed(() => {
    if (!fromToken.value || !toToken.value) return null
    return getExchangeRate(fromToken.value, toToken.value)
  })

  const canPerformSwap = computed(() => {
    if (!fromToken.value || !toToken.value) return false
    return canSwap(fromToken.value, toToken.value)
  })

  // Auto-calculate toAmount when fromAmount or tokens change
  watch(
    [fromAmount, fromToken, toToken],
    () => {
      if (!fromAmount.value || !fromToken.value || !toToken.value) {
        toAmount.value = ''
        return
      }

      const amount = parseAmount(fromAmount.value)
      if (amount <= 0) {
        toAmount.value = ''
        return
      }

      const convertedAmount = convert(amount, fromToken.value, toToken.value)
      if (convertedAmount !== null) {
        toAmount.value = formatNumber(convertedAmount)
      } else {
        toAmount.value = ''
      }
    },
    { immediate: true }
  )

  // Actions
  const setFromToken = (token: TokenSymbol | null): void => {
    fromToken.value = token
  }

  const setToToken = (token: TokenSymbol | null): void => {
    toToken.value = token
  }

  const setFromAmount = (amount: string): void => {
    fromAmount.value = amount
  }

  const swapTokens = (): void => {
    const tempToken = fromToken.value
    fromToken.value = toToken.value
    toToken.value = tempToken

    // Swap amounts as well
    const tempAmount = fromAmount.value
    fromAmount.value = toAmount.value
    setFromAmount(tempAmount)
  }

  const resetForm = (): void => {
    fromToken.value = null
    toToken.value = null
    fromAmount.value = ''
    toAmount.value = ''
    swapState.value.error = null
  }

  const submitSwap = async (): Promise<SwapTransaction | null> => {
    if (!isValid.value || !canPerformSwap.value) {
      return null
    }

    swapState.value.isSubmitting = true
    swapState.value.error = null

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const transaction: SwapTransaction = {
        id: `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromToken: fromToken.value!,
        toToken: toToken.value!,
        fromAmount: parseAmount(fromAmount.value),
        toAmount: parseAmount(toAmount.value),
        exchangeRate: exchangeRate.value?.rate || 0,
        timestamp: new Date(),
        status: 'completed',
      }

      swapState.value.lastSwapTime = new Date()
      return transaction
    } catch (error) {
      swapState.value.error = error instanceof Error ? error.message : 'Swap failed'
      return null
    } finally {
      swapState.value.isSubmitting = false
    }
  }

  return {
    // State
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    swapState: computed(() => swapState.value),

    // Computed
    formData,
    isValid,
    errors,
    exchangeRate,
    canPerformSwap,

    // Actions
    setFromToken,
    setToToken,
    setFromAmount,
    swapTokens,
    resetForm,
    submitSwap,
  }
}
