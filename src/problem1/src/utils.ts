import {
  SafeInteger,
  ValidationResult,
  SumErrorType,
  SumCalculationError,
  SumFunctionOptions,
  CONSTANTS,
} from './types';

/**
 * Default options for sum function behavior
 */
const DEFAULT_OPTIONS: Required<SumFunctionOptions> = {
  strictValidation: true,
  allowNegative: false,
  maxInput: CONSTANTS.MAX_SAFE_SUM_INPUT,
};

/**
 * Validates input for sum-to-n functions with comprehensive error checking
 * 
 * @param input - The input value to validate
 * @param options - Validation options
 * @returns Validation result with error details if invalid
 * 
 * @example
 * ```typescript
 * const result = validateSumInput(5);
 * if (result.isValid) {
 *   console.log('Valid input:', result.normalizedValue);
 * } else {
 *   console.error('Invalid input:', result.errorMessage);
 * }
 * ```
 */
export const validateSumInput = (
  input: unknown,
  options: SumFunctionOptions = {}
): ValidationResult => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check for null/undefined
  if (input === null || input === undefined) {
    return {
      isValid: false,
      errorMessage: 'Input cannot be null or undefined',
    };
  }

  // Check if input is a number
  if (typeof input !== 'number') {
    return {
      isValid: false,
      errorMessage: `Input must be a number, received ${typeof input}`,
    };
  }

  // Check for NaN
  if (Number.isNaN(input)) {
    return {
      isValid: false,
      errorMessage: 'Input cannot be NaN',
    };
  }

  // Check for infinity
  if (!Number.isFinite(input)) {
    return {
      isValid: false,
      errorMessage: 'Input must be a finite number',
    };
  }

  // Check if it's an integer
  if (!Number.isInteger(input)) {
    if (opts.strictValidation) {
      return {
        isValid: false,
        errorMessage: 'Input must be an integer',
      };
    }
    // In non-strict mode, round to nearest integer
    input = Math.round(input);
  }

  // Check if it's a safe integer
  if (!Number.isSafeInteger(input)) {
    return {
      isValid: false,
      errorMessage: 'Input exceeds safe integer range',
    };
  }

  // At this point, we know input is a number
  const numInput = input as number;

  // Check for negative numbers
  if (numInput < 0) {
    if (!opts.allowNegative) {
      return {
        isValid: false,
        errorMessage: 'Input cannot be negative',
      };
    }
  }

  // Check maximum input limit to prevent overflow
  if (numInput > opts.maxInput) {
    return {
      isValid: false,
      errorMessage: `Input ${numInput} exceeds maximum allowed value ${opts.maxInput}`,
    };
  }

  return {
    isValid: true,
    normalizedValue: numInput as SafeInteger,
  };
};

/**
 * Determines the appropriate error type based on input and error message
 * 
 * @param input - The invalid input
 * @param errorMessage - The validation error message
 * @returns Appropriate SumErrorType
 */
const determineErrorType = (input: unknown, errorMessage?: string): SumErrorType => {
  if (typeof input !== 'number') {
    return SumErrorType.INVALID_INPUT;
  }
  
  if (Number.isNaN(input) || !Number.isFinite(input)) {
    return SumErrorType.INVALID_INPUT;
  }
  
  if (!Number.isInteger(input)) {
    return SumErrorType.NON_INTEGER;
  }
  
  if (input < 0) {
    return SumErrorType.NEGATIVE_INPUT;
  }
  
  if (!Number.isSafeInteger(input) || (errorMessage?.includes('exceeds'))) {
    return SumErrorType.OVERFLOW_RISK;
  }
  
  return SumErrorType.INVALID_INPUT;
};

/**
 * Safely validates and normalizes input for sum functions
 * Throws SumCalculationError for invalid inputs
 * 
 * @param input - The input to validate and normalize
 * @param options - Validation options
 * @returns Normalized safe integer
 * @throws SumCalculationError for invalid inputs
 */
export const safeValidateInput = (
  input: unknown,
  options: SumFunctionOptions = {}
): SafeInteger => {
  const validation = validateSumInput(input, options);
  
  if (!validation.isValid) {
    const errorType = determineErrorType(input, validation.errorMessage);
    throw new SumCalculationError(errorType, input, validation.errorMessage);
  }

  return validation.normalizedValue!;
};

/**
 * Checks if the sum calculation would result in overflow
 *
 * @param n - The input value for sum calculation
 * @returns True if overflow risk exists
 */
export const hasOverflowRisk = (n: SafeInteger): boolean => {
  // Using the formula n*(n+1)/2, check if result would exceed MAX_SAFE_INTEGER
  // We need to solve: n*(n+1)/2 <= MAX_SAFE_INTEGER
  // This gives us: n^2 + n <= 2*MAX_SAFE_INTEGER
  // Using quadratic formula: n <= (-1 + sqrt(1 + 8*MAX_SAFE_INTEGER))/2
  const maxSafeN = Math.floor((-1 + Math.sqrt(1 + 8 * Number.MAX_SAFE_INTEGER)) / 2);
  return n > maxSafeN;
};

/**
 * Checks if recursive calculation would cause stack overflow
 * 
 * @param n - The input value for recursive calculation
 * @returns True if stack overflow risk exists
 */
export const hasStackOverflowRisk = (n: SafeInteger): boolean => {
  return n > CONSTANTS.MAX_RECURSION_DEPTH;
};

/**
 * Generates a range of test values for comprehensive testing
 * 
 * @param includeEdgeCases - Whether to include edge cases
 * @returns Array of test values
 */
export const generateTestValues = (includeEdgeCases: boolean = true): SafeInteger[] => {
  const values: SafeInteger[] = [1, 2, 3, 5, 10, 100, 1000];
  
  if (includeEdgeCases) {
    values.unshift(0);
    values.push(10000, 50000);
  }
  
  return values;
};

/**
 * Calculates expected sum using the mathematical formula for verification
 * This is used as a reference implementation for testing
 * 
 * @param n - The input value
 * @returns Expected sum value
 */
export const calculateExpectedSum = (n: SafeInteger): SafeInteger => {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
};
