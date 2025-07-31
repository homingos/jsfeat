// =============================================================================
// src/types/jsfeat/math.d.ts
// =============================================================================

declare module "jsfeat/lib/jsfeat_math.js" {
  import { matrix_t } from "jsfeat/lib/jsfeat_core.js";

  export function get_gaussian_kernel(
    size: number,
    sigma: number,
    kernel: number[] | Float32Array | Int32Array,
    data_type: number
  ): void;

  export function perspective_4point_transform(
    model: matrix_t,
    src_x0: number,
    src_y0: number,
    dst_x0: number,
    dst_y0: number,
    src_x1: number,
    src_y1: number,
    dst_x1: number,
    dst_y1: number,
    src_x2: number,
    src_y2: number,
    dst_x2: number,
    dst_y2: number,
    src_x3: number,
    src_y3: number,
    dst_x3: number,
    dst_y3: number
  ): void;

  export function qsort(
    array: any[],
    low: number,
    high: number,
    cmp: (a: any, b: any) => boolean
  ): void;
  export function median(
    array: number[],
    low: number,
    high: number
  ): number;
  export function determinant_3x3(
    M11: number,
    M12: number,
    M13: number,
    M21: number,
    M22: number,
    M23: number,
    M31: number,
    M32: number,
    M33: number
  ): number;
}