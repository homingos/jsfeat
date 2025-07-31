// =============================================================================
// src/types/jsfeat/imgproc.d.ts
// =============================================================================

import { matrix_t } from './core';

export declare function grayscale(
  src: Uint8Array | Uint8ClampedArray,
  w: number,
  h: number,
  dst: matrix_t,
  code?: number
): void;

export declare function gaussian_blur(
  src: matrix_t,
  dst: matrix_t,
  kernel_size?: number,
  sigma?: number
): void;

export declare function box_blur_gray(
  src: matrix_t,
  dst: matrix_t,
  radius: number,
  options?: number
): void;

export declare function canny(
  src: matrix_t,
  dst: matrix_t,
  low_thresh: number,
  high_thresh: number
): void;

export declare function sobel_derivatives(src: matrix_t, dst: matrix_t): void;
export declare function scharr_derivatives(src: matrix_t, dst: matrix_t): void;
export declare function equalize_histogram(src: matrix_t, dst: matrix_t): void;

export declare function compute_integral_image(
  src: matrix_t,
  dst_sum?: Int32Array,
  dst_sqsum?: Int32Array,
  dst_tilted?: Int32Array
): void;

export declare function resample(
  src: matrix_t,
  dst: matrix_t,
  nw: number,
  nh: number
): void;
export declare function pyrdown(
  src: matrix_t,
  dst: matrix_t,
  sx?: number,
  sy?: number
): void;

export declare function warp_affine(
  src: matrix_t,
  dst: matrix_t,
  transform: matrix_t,
  fill_value?: number
): void;

export declare function warp_perspective(
  src: matrix_t,
  dst: matrix_t,
  transform: matrix_t,
  fill_value?: number
): void;

export declare function skindetector(src: ImageData, dst: Uint8Array): void;
