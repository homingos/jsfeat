// =============================================================================
// src/types/jsfeat/features.d.ts
// =============================================================================

declare module "jsfeat/lib/jsfeat_features.js" {
  import { matrix_t, keypoint_t } from "jsfeat/lib/jsfeat_core.js";

  export namespace fast_corners {
    function detect(
      src: matrix_t,
      corners: keypoint_t[],
      border?: number
    ): number;
    function set_threshold(threshold: number): number;
  }

  export namespace yape06 {
    function detect(src: matrix_t, points: keypoint_t[], border?: number): number;
    function init(
      width: number,
      height: number,
      radius: number,
      pyramid_levels?: number
    ): void;
    let laplacian_threshold: number;
    let min_eigen_value_threshold: number;
  }

  export namespace yape {
    function detect(src: matrix_t, points: keypoint_t[], border?: number): number;
    function init(
      width: number,
      height: number,
      radius: number,
      pyramid_levels?: number
    ): void;
    let tau: number;
  }

  export namespace orb {
    function describe(
      src: matrix_t,
      corners: keypoint_t[],
      count: number,
      descriptors: matrix_t
    ): void;
  }
}