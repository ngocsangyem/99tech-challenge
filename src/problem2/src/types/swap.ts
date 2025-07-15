import type { TokenSymbol } from './token'

export type SwapFormData = {
  readonly fromToken: TokenSymbol | null
  readonly toToken: TokenSymbol | null
  readonly fromAmount: string
  readonly toAmount: string
}

export type SwapValidationError = {
  readonly field: keyof SwapFormData
  readonly message: string
}

export type SwapValidationResult = {
  readonly isValid: boolean
  readonly errors: readonly SwapValidationError[]
}

export type SwapState = {
  readonly isLoading: boolean
  readonly isSubmitting: boolean
  readonly error: string | null
  readonly lastSwapTime: Date | null
}

export type SwapTransaction = {
  readonly id: string
  readonly fromToken: TokenSymbol
  readonly toToken: TokenSymbol
  readonly fromAmount: number
  readonly toAmount: number
  readonly exchangeRate: number
  readonly timestamp: Date
  readonly status: 'pending' | 'completed' | 'failed'
}
