// =============================================================================
// src/types/jsfeat/matmath.d.ts
// =============================================================================

declare module "jsfeat/lib/jsfeat_mat_math.js" {
  import { matrix_t } from "jsfeat/lib/jsfeat_core.js";

export function identity(M: matrix_t, value?: number): void;
export function identity_3x3(M: matrix_t, value?: number): void;
export function invert_3x3(from: matrix_t, to: matrix_t): void;
export function multiply(C: matrix_t, A: matrix_t, B: matrix_t): void;
export function multiply_3x3(
  C: matrix_t,
  A: matrix_t,
  B: matrix_t
): void;
export function multiply_AAt(C: matrix_t, A: matrix_t): void;
export function multiply_AtA(C: matrix_t, A: matrix_t): void;
export function multiply_ABt(
  C: matrix_t,
  A: matrix_t,
  B: matrix_t
): void;
export function multiply_AtB(
  C: matrix_t,
  A: matrix_t,
  B: matrix_t
): void;
export function transpose(At: matrix_t, A: matrix_t): void;
export function mat3x3_determinant(M: matrix_t): number;
}