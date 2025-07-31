// =============================================================================
// src/types/jsfeat/bbf.d.ts
// =============================================================================

import { pyramid_t, matrix_t } from './core';

export declare function detect(pyramid: pyramid_t, cascade: any): any[];
export declare function build_pyramid(
  src: matrix_t,
  min_width: number,
  min_height: number,
  interval?: number
): pyramid_t;
export declare function prepare_cascade(cascade: any): void;
export declare function group_rectangles(
  rects: any[],
  min_neighbors?: number
): any[];

export declare let interval: number;
export declare let scale: number;
export declare let next: number;
export declare let scale_to: number;
