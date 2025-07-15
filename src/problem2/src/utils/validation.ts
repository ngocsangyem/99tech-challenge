import type { SwapFormData, SwapValidationResult, SwapValidationError } from '@/types'

export const validateAmount = (amount: string): SwapValidationError | null => {
  if (!amount || amount.trim() === '') {
    return {
      field: 'fromAmount',
      message: 'Amount is required',
    }
  }
  
  const numericAmount = parseFloat(amount)
  
  if (isNaN(numericAmount)) {
    return {
      field: 'fromAmount',
      message: 'Amount must be a valid number',
    }
  }
  
  if (numericAmount <= 0) {
    return {
      field: 'fromAmount',
      message: 'Amount must be greater than 0',
    }
  }
  
  if (numericAmount > 1000000000) {
    return {
      field: 'fromAmount',
      message: 'Amount is too large',
    }
  }
  
  return null
}

export const validateTokenSelection = (
  fromToken: string | null,
  toToken: string | null
): SwapValidationError[] => {
  const errors: SwapValidationError[] = []
  
  if (!fromToken) {
    errors.push({
      field: 'fromToken',
      message: 'Please select a token to swap from',
    })
  }
  
  if (!toToken) {
    errors.push({
      field: 'toToken',
      message: 'Please select a token to swap to',
    })
  }
  
  if (fromToken && toToken && fromToken === toToken) {
    errors.push({
      field: 'toToken',
      message: 'From and To tokens must be different',
    })
  }
  
  return errors
}

export const validateSwapForm = (formData: SwapFormData): SwapValidationResult => {
  const errors: SwapValidationError[] = []
  
  // Validate amount
  const amountError = validateAmount(formData.fromAmount)
  if (amountError) {
    errors.push(amountError)
  }
  
  // Validate token selection
  const tokenErrors = validateTokenSelection(formData.fromToken, formData.toToken)
  errors.push(...tokenErrors)
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const isValidNumber = (value: string): boolean => {
  const num = parseFloat(value)
  return !isNaN(num) && isFinite(num) && num >= 0
}
