// =============================================================================
// src/types/jsfeat/linalg.d.ts
// =============================================================================

import { matrix_t } from './core';

export declare function lu_solve(A: matrix_t, B: matrix_t): number;
export declare function cholesky_solve(A: matrix_t, B: matrix_t): number;
export declare function svd_decompose(
  A: matrix_t,
  W?: matrix_t,
  U?: matrix_t,
  V?: matrix_t,
  options?: number
): void;
export declare function svd_solve(A: matrix_t, X: matrix_t, B: matrix_t): void;
export declare function svd_invert(Ai: matrix_t, A: matrix_t): void;
export declare function eigenVV(
  A: matrix_t,
  vects?: matrix_t,
  vals?: matrix_t
): void;
