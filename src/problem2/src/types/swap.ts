import type { TokenSymbol } from './token';

export type SwapFormData = {
  fromToken: TokenSymbol | null
  toToken: TokenSymbol | null
  fromAmount: string
  toAmount: string
}

export type SwapValidationError = {
  field: keyof SwapFormData
  message: string
}

export type SwapValidationResult = {
  isValid: boolean
  errors: SwapValidationError[]
}

export type SwapState = {
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  lastSwapTime: Date | null
}

export type SwapTransaction = {
  id: string
  fromToken: TokenSymbol
  toToken: TokenSymbol
  fromAmount: number
  toAmount: number
  exchangeRate: number
  timestamp: Date
  status: 'pending' | 'completed' | 'failed'
}
