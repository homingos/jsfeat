// =============================================================================
// src/types/jsfeat/optical-flow.d.ts
// =============================================================================

import { pyramid_t } from './core';

export declare function track(
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
