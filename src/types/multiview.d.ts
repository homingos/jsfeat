// =============================================================================
// src/types/jsfeat/multiview.d.ts
// =============================================================================

declare module 'jsfeat/lib/jsfeat_motion_estomator.js' {
  import { matrix_t, keypoint_t } from "jsfeat/lib/jsfeat_core.js";

export  class ransac_params_t {
  constructor(size?: number, thresh?: number, eps?: number, prob?: number);
  size: number;
  thresh: number;
  eps: number;
  prob: number;

  update_iters(eps: number, max_iters: number): number;
}

export  class affine2d {
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

export  class homography2d {
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

export  function ransac(
  params: ransac_params_t,
  kernel: affine2d | homography2d,
  from: keypoint_t[],
  to: keypoint_t[],
  count: number,
  model: matrix_t,
  mask?: matrix_t,
  max_iters?: number
): boolean;

export  function lmeds(
  params: ransac_params_t,
  kernel: affine2d | homography2d,
  from: keypoint_t[],
  to: keypoint_t[],
  count: number,
  model: matrix_t,
  mask?: matrix_t,
  max_iters?: number
): boolean;
}