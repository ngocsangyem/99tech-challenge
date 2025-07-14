/**
 * Represents a safe integer that can be used in mathematical operations
 * without precision loss. This is bounded by Number.MAX_SAFE_INTEGER.
 */
export type SafeInteger = number;

/**
 * Represents a non-negative integer (0 or positive)
 * Used for input validation in sum functions.
 */
export type NonNegativeInteger = number;

/**
 * Function signature for all sum-to-n implementations
 * 
 * @param n - The upper bound for summation (1 + 2 + ... + n)
 * @returns The sum of integers from 1 to n
 */
export interface SumFunction {
  (n: SafeInteger): SafeInteger;
}

/**
 * Configuration options for sum function behavior
 */
export interface SumFunctionOptions {
  /** Whether to validate input types strictly */
  strictValidation?: boolean;
  /** Whether to allow negative inputs (returns 0) or throw error */
  allowNegative?: boolean;
  /** Maximum allowed input value for safety checks */
  maxInput?: SafeInteger;
}

/**
 * Result object for sum operations with metadata
 */
export interface SumResult {
  /** The calculated sum value */
  value: SafeInteger;
  /** The input value that was used */
  input: SafeInteger;
  /** Execution time in milliseconds (for performance tracking) */
  executionTime?: number;
  /** Whether input validation was performed */
  validated: boolean;
}

/**
 * Performance benchmark result for comparing different implementations
 */
export interface PerformanceBenchmark {
  /** Input value used for the benchmark */
  input: SafeInteger;
  /** Average execution time over multiple runs (ms) */
  averageTime: number;
  /** Number of iterations performed */
  iterations: number;
  /** Memory usage if available */
  memoryUsage?: number;
}

/**
 * Validation result for input checking
 */
export interface ValidationResult {
  /** Whether the input is valid */
  isValid: boolean;
  /** Error message if validation failed */
  errorMessage?: string;
  /** The sanitized/normalized input value */
  normalizedValue?: SafeInteger;
}

/**
 * Error types that can occur during sum calculations
 */
export enum SumErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  OVERFLOW_RISK = 'OVERFLOW_RISK',
  STACK_OVERFLOW = 'STACK_OVERFLOW',
  NEGATIVE_INPUT = 'NEGATIVE_INPUT',
  NON_INTEGER = 'NON_INTEGER',
}

/**
 * Custom error class for sum calculation errors
 */
export class SumCalculationError extends Error {
  public readonly errorType: SumErrorType;
  public readonly input: unknown;

  constructor(errorType: SumErrorType, input: unknown, message?: string) {
    super(message || `Sum calculation error: ${errorType}`);
    this.name = 'SumCalculationError';
    this.errorType = errorType;
    this.input = input;
  }
}

/**
 * Type guard to check if a value is a safe integer
 */
export const isSafeInteger = (value: unknown): value is SafeInteger => {
  return typeof value === 'number' && 
         Number.isInteger(value) && 
         Number.isSafeInteger(value);
};

/**
 * Type guard to check if a value is a non-negative integer
 */
export const isNonNegativeInteger = (value: unknown): value is NonNegativeInteger => {
  return isSafeInteger(value) && value >= 0;
};

/**
 * Constants for mathematical limits and validation
 */
export const CONSTANTS = {
  /** Maximum safe input to prevent overflow in sum calculation */
  MAX_SAFE_SUM_INPUT: Math.floor(Math.sqrt(2 * Number.MAX_SAFE_INTEGER)),
  /** Maximum recursion depth to prevent stack overflow */
  MAX_RECURSION_DEPTH: 5000, // Reduced to be more conservative
  /** Default number of iterations for performance benchmarks */
  DEFAULT_BENCHMARK_ITERATIONS: 1000,
} as const;

/**
 * Type for the constants object to ensure immutability
 */
export type Constants = typeof CONSTANTS;
