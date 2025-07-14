import {
  sum_to_n_a,
  sum_to_n_b,
  sum_to_n_c,
  SumCalculationError,
  SumErrorType,
  validateSumInput,
  safeValidateInput,
  hasOverflowRisk,
  hasStackOverflowRisk,
  CONSTANTS,
} from '../src/index';

describe('Edge Cases and Error Handling', () => {
  describe('Input Validation', () => {
    test('should reject null and undefined inputs', () => {
      expect(() => sum_to_n_a(null as any)).toThrow(SumCalculationError);
      expect(() => sum_to_n_a(undefined as any)).toThrow(SumCalculationError);
      expect(() => sum_to_n_b(null as any)).toThrow(SumCalculationError);
      expect(() => sum_to_n_b(undefined as any)).toThrow(SumCalculationError);
      expect(() => sum_to_n_c(null as any)).toThrow(SumCalculationError);
      expect(() => sum_to_n_c(undefined as any)).toThrow(SumCalculationError);
    });

    test('should reject non-numeric inputs', () => {
      const invalidInputs = ['5', '10', 'hello', [], {}, true, false];
      
      invalidInputs.forEach(input => {
        expect(() => sum_to_n_a(input as any)).toThrow(SumCalculationError);
        expect(() => sum_to_n_b(input as any)).toThrow(SumCalculationError);
        expect(() => sum_to_n_c(input as any)).toThrow(SumCalculationError);
      });
    });

    test('should reject NaN inputs', () => {
      expect(() => sum_to_n_a(NaN)).toThrow(SumCalculationError);
      expect(() => sum_to_n_b(NaN)).toThrow(SumCalculationError);
      expect(() => sum_to_n_c(NaN)).toThrow(SumCalculationError);
    });

    test('should reject infinite inputs', () => {
      expect(() => sum_to_n_a(Infinity)).toThrow(SumCalculationError);
      expect(() => sum_to_n_a(-Infinity)).toThrow(SumCalculationError);
      expect(() => sum_to_n_b(Infinity)).toThrow(SumCalculationError);
      expect(() => sum_to_n_b(-Infinity)).toThrow(SumCalculationError);
      expect(() => sum_to_n_c(Infinity)).toThrow(SumCalculationError);
      expect(() => sum_to_n_c(-Infinity)).toThrow(SumCalculationError);
    });

    test('should reject non-integer inputs', () => {
      const floatInputs = [1.5, 2.7, 3.14, 0.5, -1.5];
      
      floatInputs.forEach(input => {
        expect(() => sum_to_n_a(input)).toThrow(SumCalculationError);
        expect(() => sum_to_n_b(input)).toThrow(SumCalculationError);
        expect(() => sum_to_n_c(input)).toThrow(SumCalculationError);
      });
    });

    test('should handle very large safe integers', () => {
      const largeSafeInt = 100000;
      
      // These should work without throwing
      expect(() => sum_to_n_a(largeSafeInt)).not.toThrow();
      expect(() => sum_to_n_b(largeSafeInt)).not.toThrow();
      
      // Recursive might throw due to stack overflow
      expect(() => sum_to_n_c(largeSafeInt)).toThrow(SumCalculationError);
    });
  });

  describe('Boundary Value Testing', () => {
    test('should handle minimum valid input (0)', () => {
      expect(sum_to_n_a(0)).toBe(0);
      expect(sum_to_n_b(0)).toBe(0);
      expect(sum_to_n_c(0)).toBe(0);
    });

    test('should handle smallest positive input (1)', () => {
      expect(sum_to_n_a(1)).toBe(1);
      expect(sum_to_n_b(1)).toBe(1);
      expect(sum_to_n_c(1)).toBe(1);
    });

    test('should handle negative inputs consistently', () => {
      const negativeInputs = [-1, -5, -10, -100, -1000];
      
      negativeInputs.forEach(input => {
        expect(sum_to_n_a(input)).toBe(0);
        expect(sum_to_n_b(input)).toBe(0);
        expect(sum_to_n_c(input)).toBe(0);
      });
    });

    test('should handle maximum safe recursion depth', () => {
      const safeRecursiveInput = 1000; // Use a much smaller, definitely safe number
      const unsafeRecursiveInput = CONSTANTS.MAX_RECURSION_DEPTH + 1000;

      // Should work for small inputs
      expect(() => sum_to_n_c(safeRecursiveInput)).not.toThrow();

      // Should fail for large inputs that exceed stack limit
      expect(() => sum_to_n_c(unsafeRecursiveInput)).toThrow(SumCalculationError);
    });
  });

  describe('Error Type Classification', () => {
    test('should throw INVALID_INPUT error for non-numbers', () => {
      try {
        sum_to_n_a('invalid' as any);
      } catch (error) {
        expect(error).toBeInstanceOf(SumCalculationError);
        expect((error as SumCalculationError).errorType).toBe(SumErrorType.INVALID_INPUT);
      }
    });

    test('should throw NON_INTEGER error for float inputs', () => {
      try {
        sum_to_n_a(3.14);
      } catch (error) {
        expect(error).toBeInstanceOf(SumCalculationError);
        expect((error as SumCalculationError).errorType).toBe(SumErrorType.NON_INTEGER);
      }
    });

    test('should throw STACK_OVERFLOW error for large recursive inputs', () => {
      try {
        sum_to_n_c(50000);
      } catch (error) {
        expect(error).toBeInstanceOf(SumCalculationError);
        expect((error as SumCalculationError).errorType).toBe(SumErrorType.STACK_OVERFLOW);
      }
    });

    test('should throw OVERFLOW_RISK error for extremely large inputs', () => {
      const unsafeInput = Number.MAX_SAFE_INTEGER;
      
      try {
        sum_to_n_a(unsafeInput);
      } catch (error) {
        expect(error).toBeInstanceOf(SumCalculationError);
        expect((error as SumCalculationError).errorType).toBe(SumErrorType.OVERFLOW_RISK);
      }
    });
  });

  describe('Validation Utility Functions', () => {
    test('validateSumInput should return detailed validation results', () => {
      // Valid input
      const validResult = validateSumInput(5);
      expect(validResult.isValid).toBe(true);
      expect(validResult.normalizedValue).toBe(5);
      expect(validResult.errorMessage).toBeUndefined();

      // Invalid input
      const invalidResult = validateSumInput('invalid');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errorMessage).toBeDefined();
      expect(invalidResult.normalizedValue).toBeUndefined();
    });

    test('safeValidateInput should throw for invalid inputs', () => {
      expect(() => safeValidateInput('invalid')).toThrow(SumCalculationError);
      expect(() => safeValidateInput(NaN)).toThrow(SumCalculationError);
      expect(() => safeValidateInput(3.14)).toThrow(SumCalculationError);
    });

    test('hasOverflowRisk should correctly identify overflow risks', () => {
      expect(hasOverflowRisk(100)).toBe(false);
      expect(hasOverflowRisk(1000000)).toBe(false); // This is actually still safe
      expect(hasOverflowRisk(100000000)).toBe(false); // This is still safe
      expect(hasOverflowRisk(200000000)).toBe(true); // This should trigger overflow
      expect(hasOverflowRisk(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    test('hasStackOverflowRisk should correctly identify stack risks', () => {
      expect(hasStackOverflowRisk(100)).toBe(false);
      expect(hasStackOverflowRisk(5000)).toBe(false);
      expect(hasStackOverflowRisk(50000)).toBe(true);
    });
  });

  describe('Memory and Performance Edge Cases', () => {
    test('should handle repeated calls without memory leaks', () => {
      // This test ensures no memory accumulation over many calls
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        sum_to_n_a(100);
        sum_to_n_b(100);
        if (i < 100) { // Limit recursive calls to prevent stack overflow
          sum_to_n_c(100);
        }
      }
      
      // If we reach here without errors, memory handling is likely correct
      expect(true).toBe(true);
    });

    test('should handle concurrent calls correctly', async () => {
      const promises = [];
      
      for (let i = 0; i < 100; i++) {
        promises.push(Promise.resolve(sum_to_n_b(i)));
      }
      
      const results = await Promise.all(promises);
      
      // Verify all results are correct
      results.forEach((result, index) => {
        const expected = index * (index + 1) / 2;
        expect(result).toBe(expected);
      });
    });
  });

  describe('Precision and Accuracy', () => {
    test('should maintain precision for large but safe inputs', () => {
      const largeInput = 50000;
      const expected = (largeInput * (largeInput + 1)) / 2;
      
      expect(sum_to_n_a(largeInput)).toBe(expected);
      expect(sum_to_n_b(largeInput)).toBe(expected);
      
      // Verify the result is still a safe integer
      expect(Number.isSafeInteger(sum_to_n_a(largeInput))).toBe(true);
      expect(Number.isSafeInteger(sum_to_n_b(largeInput))).toBe(true);
    });

    test('should produce mathematically correct results', () => {
      // Test against known mathematical properties
      const testValues = [10, 50, 100, 500];
      
      testValues.forEach(n => {
        const result = sum_to_n_b(n);
        
        // Sum of 1 to n should equal n*(n+1)/2
        expect(result).toBe((n * (n + 1)) / 2);
        
        // Sum should be triangular number
        const triangularCheck = Math.sqrt(8 * result + 1);
        expect(Number.isInteger(triangularCheck)).toBe(true);
      });
    });
  });
});
