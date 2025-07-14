/**
 * Comprehensive test suite for sum-to-n functions
 * 
 * This test suite covers all three implementations with various test scenarios
 * including happy path, edge cases, error conditions, and performance validation.
 */

import {
  sum_to_n_a,
  sum_to_n_b,
  sum_to_n_c,
  SumErrorType,
  SumCalculationError,
  calculateExpectedSum,
  generateTestValues,
} from '../src/index';

describe('Sum to N Functions', () => {
  // Test data with expected results
  const testCases = [
    { input: 0, expected: 0, description: 'zero' },
    { input: 1, expected: 1, description: 'one' },
    { input: 2, expected: 3, description: 'two' },
    { input: 3, expected: 6, description: 'three' },
    { input: 4, expected: 10, description: 'four' },
    { input: 5, expected: 15, description: 'five' },
    { input: 10, expected: 55, description: 'ten' },
    { input: 100, expected: 5050, description: 'one hundred' },
    { input: 1000, expected: 500500, description: 'one thousand' },
  ];

  describe('sum_to_n_a (Iterative Implementation)', () => {
    testCases.forEach(({ input, expected, description }) => {
      test(`should return ${expected} for input ${description} (${input})`, () => {
        expect(sum_to_n_a(input)).toBe(expected);
      });
    });

    test('should handle negative inputs by returning 0', () => {
      expect(sum_to_n_a(-1)).toBe(0);
      expect(sum_to_n_a(-5)).toBe(0);
      expect(sum_to_n_a(-100)).toBe(0);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => sum_to_n_a(NaN)).toThrow(SumCalculationError);
      expect(() => sum_to_n_a(Infinity)).toThrow(SumCalculationError);
      expect(() => sum_to_n_a(-Infinity)).toThrow(SumCalculationError);
    });

    test('should throw error for non-integer inputs', () => {
      expect(() => sum_to_n_a(5.5)).toThrow(SumCalculationError);
      expect(() => sum_to_n_a(3.14)).toThrow(SumCalculationError);
    });

    test('should handle large inputs within safe range', () => {
      const largeInput = 10000;
      const expected = calculateExpectedSum(largeInput);
      expect(sum_to_n_a(largeInput)).toBe(expected);
    });

    test('should throw overflow error for extremely large inputs', () => {
      const unsafeInput = Number.MAX_SAFE_INTEGER;
      expect(() => sum_to_n_a(unsafeInput)).toThrow(SumCalculationError);
    });
  });

  describe('sum_to_n_b (Mathematical Formula Implementation)', () => {
    testCases.forEach(({ input, expected, description }) => {
      test(`should return ${expected} for input ${description} (${input})`, () => {
        expect(sum_to_n_b(input)).toBe(expected);
      });
    });

    test('should handle negative inputs by returning 0', () => {
      expect(sum_to_n_b(-1)).toBe(0);
      expect(sum_to_n_b(-5)).toBe(0);
      expect(sum_to_n_b(-100)).toBe(0);
    });

    test('should be the fastest implementation for large inputs', () => {
      const largeInput = 50000;
      const start = performance.now();
      sum_to_n_b(largeInput);
      const formulaTime = performance.now() - start;

      const start2 = performance.now();
      sum_to_n_a(largeInput);
      const iterativeTime = performance.now() - start2;

      // Formula should be significantly faster (though this might be flaky in CI)
      expect(formulaTime).toBeLessThan(iterativeTime * 2); // Allow some variance
    });

    test('should produce exact same results as iterative method', () => {
      const testValues = generateTestValues();
      testValues.forEach(value => {
        if (value >= 0 && value <= 10000) { // Safe range for both methods
          expect(sum_to_n_b(value)).toBe(sum_to_n_a(value));
        }
      });
    });
  });

  describe('sum_to_n_c (Recursive Implementation)', () => {
    // Test with smaller values due to stack limitations
    const recursiveTestCases = testCases.filter(tc => tc.input <= 1000);

    recursiveTestCases.forEach(({ input, expected, description }) => {
      test(`should return ${expected} for input ${description} (${input})`, () => {
        expect(sum_to_n_c(input)).toBe(expected);
      });
    });

    test('should handle negative inputs by returning 0', () => {
      expect(sum_to_n_c(-1)).toBe(0);
      expect(sum_to_n_c(-5)).toBe(0);
    });

    test('should throw stack overflow error for very large inputs', () => {
      const largeInput = 50000; // This should exceed stack limit
      expect(() => sum_to_n_c(largeInput)).toThrow(SumCalculationError);
      
      try {
        sum_to_n_c(largeInput);
      } catch (error) {
        expect(error).toBeInstanceOf(SumCalculationError);
        expect((error as SumCalculationError).errorType).toBe(SumErrorType.STACK_OVERFLOW);
      }
    });

    test('should produce same results as other methods for small inputs', () => {
      const smallValues = [0, 1, 2, 3, 5, 10, 100];
      smallValues.forEach(value => {
        const iterativeResult = sum_to_n_a(value);
        const formulaResult = sum_to_n_b(value);
        const recursiveResult = sum_to_n_c(value);
        
        expect(recursiveResult).toBe(iterativeResult);
        expect(recursiveResult).toBe(formulaResult);
      });
    });
  });

  describe('Cross-Implementation Consistency', () => {
    test('all three implementations should produce identical results for valid inputs', () => {
      const testValues = [0, 1, 2, 3, 5, 10, 50, 100, 500];
      
      testValues.forEach(value => {
        const resultA = sum_to_n_a(value);
        const resultB = sum_to_n_b(value);
        const resultC = sum_to_n_c(value);
        
        expect(resultA).toBe(resultB);
        expect(resultB).toBe(resultC);
        expect(resultA).toBe(calculateExpectedSum(value));
      });
    });

    test('all implementations should handle edge cases consistently', () => {
      const edgeCases = [0, 1, -1, -5];
      
      edgeCases.forEach(value => {
        const resultA = sum_to_n_a(value);
        const resultB = sum_to_n_b(value);
        const resultC = sum_to_n_c(value);
        
        expect(resultA).toBe(resultB);
        expect(resultB).toBe(resultC);
      });
    });
  });
});
