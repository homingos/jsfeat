// =============================================================================
// src/types/jsfeat/haar.d.ts
// =============================================================================

declare module "jsfeat/lib/jsfeat_haar.js" {
  export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  neighbors?: number;
  confidence?: number;
}

export interface Classifier {
  size: [number, number];
  complexClassifiers: any[];
}

export function detect_single_scale(
  int_sum: Int32Array,
  int_sqsum: Int32Array,
  int_tilted: Int32Array,
  int_canny_sum: Int32Array,
  width: number,
  height: number,
  scale: number,
  classifier: Classifier
): Rect[];

export function detect_multi_scale(
  int_sum: Int32Array,
  int_sqsum: Int32Array,
  int_tilted: Int32Array,
  int_canny_sum: Int32Array,
  width: number,
  height: number,
  classifier: Classifier,
  scale_factor?: number,
  scale_min?: number
): Rect[];

export function group_rectangles(
  rects: Rect[],
  min_neighbors?: number
): Rect[];
export function prepare_cascade(cascade: Classifier): void;

export let edges_density: number;
}