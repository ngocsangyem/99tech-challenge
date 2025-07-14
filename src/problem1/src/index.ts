

import {
  sum_to_n_a,
  sum_to_n_b,
  sum_to_n_c,
} from './sum-functions';

export {
  sum_to_n_a,
  sum_to_n_b,
  sum_to_n_c,
} from './sum-functions';

export type {
  SafeInteger,
  NonNegativeInteger,
  SumFunction,
  SumFunctionOptions,
  SumResult,
  PerformanceBenchmark,
  ValidationResult,
  Constants,
} from './types';

export {
  SumErrorType,
  SumCalculationError,
  isSafeInteger,
  isNonNegativeInteger,
  CONSTANTS,
} from './types';

export {
  validateSumInput,
  safeValidateInput,
  hasOverflowRisk,
  hasStackOverflowRisk,
  generateTestValues,
  calculateExpectedSum,
} from './utils';

/**
 * Quick demonstration of all three implementations
 *
 * @param n - The input value to test
 * @returns Object containing results from all three methods
 */
export const demonstrateAllMethods = (n: number): Record<string, number> => {
  return {
    iterative: sum_to_n_a(n),
    formula: sum_to_n_b(n),
    recursive: sum_to_n_c(n),
  };
};
