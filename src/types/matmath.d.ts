// =============================================================================
// src/types/jsfeat/matmath.d.ts
// =============================================================================

import { matrix_t } from './core';

export declare function identity(M: matrix_t, value?: number): void;
export declare function identity_3x3(M: matrix_t, value?: number): void;
export declare function invert_3x3(from: matrix_t, to: matrix_t): void;
export declare function multiply(C: matrix_t, A: matrix_t, B: matrix_t): void;
export declare function multiply_3x3(
  C: matrix_t,
  A: matrix_t,
  B: matrix_t
): void;
export declare function multiply_AAt(C: matrix_t, A: matrix_t): void;
export declare function multiply_AtA(C: matrix_t, A: matrix_t): void;
export declare function multiply_ABt(
  C: matrix_t,
  A: matrix_t,
  B: matrix_t
): void;
export declare function multiply_AtB(
  C: matrix_t,
  A: matrix_t,
  B: matrix_t
): void;
export declare function transpose(At: matrix_t, A: matrix_t): void;
export declare function mat3x3_determinant(M: matrix_t): number;
