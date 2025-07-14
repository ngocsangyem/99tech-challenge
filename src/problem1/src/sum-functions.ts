import {
  SafeInteger,
  SumFunction,
  SumCalculationError,
  SumErrorType,
} from './types';
import {
  safeValidateInput,
  hasOverflowRisk,
} from './utils';
import { CONSTANTS } from './types';

/**
 * Implementation A: Iterative approach using a for loop
 * 
 * This is the most straightforward implementation that uses a simple loop
 * to accumulate the sum. It's easy to understand and has predictable performance.
 * 
 * @param n - The upper bound for summation (1 + 2 + ... + n)
 * @returns The sum of integers from 1 to n
 * 
 * @example
 * ```typescript
 * console.log(sum_to_n_a(5)); // Output: 15 (1+2+3+4+5)
 * console.log(sum_to_n_a(0)); // Output: 0
 * console.log(sum_to_n_a(1)); // Output: 1
 * ```
 */
export const sum_to_n_a: SumFunction = (n: SafeInteger): SafeInteger => {
  // Validate input and handle edge cases
  const validatedN = safeValidateInput(n, { allowNegative: true });
  
  // Handle negative numbers and zero
  if (validatedN <= 0) {
    return 0;
  }
  
  // Check for potential overflow
  if (hasOverflowRisk(validatedN)) {
    throw new SumCalculationError(
      SumErrorType.OVERFLOW_RISK,
      validatedN,
      `Input ${validatedN} would cause integer overflow`
    );
  }
  
  // Iterative accumulation
  let sum: SafeInteger = 0;
  
  // Loop from 1 to n, adding each number to the sum
  for (let i = 1; i <= validatedN; i++) {
    sum += i;
  }
  
  return sum;
};

/**
 * Implementation B: Mathematical formula approach
 * 
 * This implementation uses the well-known mathematical formula for the sum
 * of an arithmetic sequence: sum = n * (n + 1) / 2
 * 
 * @param n - The upper bound for summation (1 + 2 + ... + n)
 * @returns The sum of integers from 1 to n
 * 
 * @example
 * ```typescript
 * console.log(sum_to_n_b(5)); // Output: 15 (calculated as 5*6/2)
 * console.log(sum_to_n_b(100)); // Output: 5050 (calculated instantly)
 * ```
 */
export const sum_to_n_b: SumFunction = (n: SafeInteger): SafeInteger => {
  // Validate input and handle edge cases
  const validatedN = safeValidateInput(n, { allowNegative: true });
  
  // Handle negative numbers and zero
  if (validatedN <= 0) {
    return 0;
  }
  
  // Check for potential overflow before calculation
  if (hasOverflowRisk(validatedN)) {
    throw new SumCalculationError(
      SumErrorType.OVERFLOW_RISK,
      validatedN,
      `Input ${validatedN} would cause integer overflow`
    );
  }
  
  // Apply the mathematical formula: n * (n + 1) / 2
  // This formula derives from the fact that the sum of an arithmetic sequence
  // is (first_term + last_term) * count / 2 = (1 + n) * n / 2
  return (validatedN * (validatedN + 1)) / 2;
};

/**
 * Implementation C: Recursive approach
 * 
 * This implementation uses recursion to break down the problem into smaller
 * subproblems. It demonstrates functional programming concepts and the
 * mathematical definition of summation.
 * 
 * Note: This approach has limitations due to call stack size
 * 
 * @param n - The upper bound for summation (1 + 2 + ... + n)
 * @returns The sum of integers from 1 to n
 * 
 * @example
 * ```typescript
 * console.log(sum_to_n_c(5)); // Output: 15 (5 + sum_to_n_c(4))
 * console.log(sum_to_n_c(3)); // Output: 6 (3 + 2 + 1)
 * ```
 */
export const sum_to_n_c: SumFunction = (n: SafeInteger): SafeInteger => {
  // Check for stack overflow risk FIRST, before any validation that might recurse
  if (typeof n === 'number' && n > CONSTANTS.MAX_RECURSION_DEPTH) {
    throw new SumCalculationError(
      SumErrorType.STACK_OVERFLOW,
      n,
      `Input ${n} would cause stack overflow in recursive implementation`
    );
  }

  // Validate input and handle edge cases
  const validatedN = safeValidateInput(n, { allowNegative: true });

  // Handle negative numbers and zero (base case)
  if (validatedN <= 0) {
    return 0;
  }

  // Base case: sum of 1 is 1
  if (validatedN === 1) {
    return 1;
  }

  // Recursive case: n + sum(n-1)
  // This breaks down sum(n) = n + sum(n-1) + sum(n-2) + ... + sum(1)
  return validatedN + sum_to_n_c(validatedN - 1);
};
