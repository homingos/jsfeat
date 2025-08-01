// =============================================================================
// src/types/jsfeat/multiview.d.ts
// =============================================================================

import { matrix_t, keypoint_t, ransac_params_t } from './core';

export declare class affine2d {
  constructor();

  run(
    from: keypoint_t[],
    to: keypoint_t[],
    model: matrix_t,
    count: number
  ): number;
  error(
    from: keypoint_t[],
    to: keypoint_t[],
    model: matrix_t,
    err: Float32Array,
    count: number
  ): void;
  check_subset(from: keypoint_t[], to: keypoint_t[], count: number): boolean;
}

export declare class homography2d {
  constructor();

  run(
    from: keypoint_t[],
    to: keypoint_t[],
    model: matrix_t,
    count: number
  ): number;
  error(
    from: keypoint_t[],
    to: keypoint_t[],
    model: matrix_t,
    err: Float32Array,
    count: number
  ): void;
  check_subset(from: keypoint_t[], to: keypoint_t[], count: number): boolean;
}

export declare function ransac(
  params: ransac_params_t,
  kernel: affine2d | homography2d,
  from: keypoint_t[],
  to: keypoint_t[],
  count: number,
  model: matrix_t,
  mask?: matrix_t,
  max_iters?: number
): boolean;

export declare function lmeds(
  params: ransac_params_t,
  kernel: affine2d | homography2d,
  from: keypoint_t[],
  to: keypoint_t[],
  count: number,
  model: matrix_t,
  mask?: matrix_t,
  max_iters?: number
): boolean;
