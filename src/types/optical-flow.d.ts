// =============================================================================
// src/types/jsfeat/optical-flow.d.ts
// =============================================================================

declare module 'jsfeat/lib/jsfeat_optical_flow_lk.js' {
  import { pyramid_t } from "jsfeat/lib/jsfeat_core.js";

export function track(
  prev_pyr: pyramid_t,
  curr_pyr: pyramid_t,
  prev_xy: Float32Array,
  curr_xy: Float32Array,
  count: number,
  win_size: number,
  max_iter?: number,
  status?: Uint8Array,
  eps?: number,
  min_eigen_threshold?: number
): void;
}