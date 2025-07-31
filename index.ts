// =============================================================================
// packages/core/cv/index.ts (Fixed - Conditional imports based on what exists)
// =============================================================================

// Import the concatenated JSFeat library
let jsfeatLib: any;

try {
  jsfeatLib = require('./build/jsfeat-module.js');
} catch (error) {
  console.error('Failed to load JSFeat module:', error);
  throw new Error('JSFeat module not found. Run "npm run prebuild" first.');
}

// =============================================================================
// OPTION 1: If your files have .d.ts extensions, use this approach
// =============================================================================

// Only import types that actually exist - check your src/types/ directory first!
// Comment out any imports for files that don't exist

// Core types (these should definitely exist)
import type {
  data_t,
  matrix_t,
  keypoint_t,
  pyramid_t,
  get_channel,
  get_data_type,
  get_data_type_size
} from './src/types/core';

// Re-export core types
export type {
  data_t,
  matrix_t,
  keypoint_t,
  pyramid_t,
  get_channel,
  get_data_type,
  get_data_type_size
} from './src/types/core';

// Conditionally export other types - only uncomment if the files exist!

export type * from './src/types/constants';
export type * from './src/types/imgproc';
export type * from './src/types/math';
export type * from './src/types/linalg';
export type * from './src/types/matmath';
export type * from './src/types/cache';
export type * from './src/types/multiview';
export type * from './src/types/features';
export type * from './src/types/optical-flow';

// Handle conflicting exports only if files exist
/*
export {
  detect_single_scale as haar_detect_single_scale,
  detect_multi_scale as haar_detect_multi_scale,
  group_rectangles as haar_group_rectangles,
  prepare_cascade as haar_prepare_cascade,
  edges_density as haar_edges_density,
  type Rect as HaarRect,
  type Classifier as HaarClassifier
} from './src/types/haar';

export {
  detect as bbf_detect,
  build_pyramid as bbf_build_pyramid,
  prepare_cascade as bbf_prepare_cascade,
  group_rectangles as bbf_group_rectangles,
  interval as bbf_interval,
  scale as bbf_scale,
  next as bbf_next,
  scale_to as bbf_scale_to
} from './src/types/bbf';
*/

// =============================================================================
// OPTION 2: Simpler approach - Create a single types file
// =============================================================================

// Create src/types/index.ts with all your types in one file, then just do:
// export * from './src/types/index';

// =============================================================================
// Main JSFeat object with basic typing
// =============================================================================

const jsfeat = jsfeatLib as {
  // Core constructors
  matrix_t: new (
    cols: number,
    rows: number,
    data_type: number,
    data_buffer?: any
  ) => matrix_t;
  data_t: new (size_in_bytes: number, buffer?: ArrayBuffer) => data_t;
  keypoint_t: new (
    x?: number,
    y?: number,
    score?: number,
    level?: number,
    angle?: number
  ) => keypoint_t;
  pyramid_t: new (levels: number) => pyramid_t;

  // Constants - basic typing as numbers
  U8_t: number;
  S32_t: number;
  F32_t: number;
  F64_t: number;
  C1_t: number;
  C2_t: number;
  C3_t: number;
  C4_t: number;
  U8C1_t: number;
  U8C2_t: number;
  U8C3_t: number;
  U8C4_t: number;
  S32C1_t: number;
  S32C2_t: number;
  S32C3_t: number;
  S32C4_t: number;
  F32C1_t: number;
  F32C2_t: number;
  F32C3_t: number;
  F32C4_t: number;
  F64C1_t: number;
  F64C2_t: number;
  F64C3_t: number;
  F64C4_t: number;
  COLOR_RGBA2GRAY: number;
  COLOR_RGB2GRAY: number;
  COLOR_BGRA2GRAY: number;
  COLOR_BGR2GRAY: number;
  EPSILON: number;
  BOX_BLUR_NOSCALE: number;
  SVD_U_T: number;
  SVD_V_T: number;

  // Utility functions
  get_channel: (type: number) => number;
  get_data_type: (type: number) => number;
  get_data_type_size: (type: number) => number;

  // Modules - using any for maximum compatibility
  imgproc: any;
  math: any;
  linalg: any;
  matmath: any;
  cache: any;
  multiview: any;
  fast_corners: any;
  yape: any;
  yape06: any;
  orb: any;
  optical_flow_lk: any;
  haar: any;
  bbf: any;
};

// Default export
export default jsfeat;

// Named constructor exports
export const JSFeatMatrix = jsfeat.matrix_t;
export const JSFeatData = jsfeat.data_t;
export const JSFeatKeypoint = jsfeat.keypoint_t;
export const JSFeatPyramid = jsfeat.pyramid_t;

// Constants export
export const {
  U8_t,
  S32_t,
  F32_t,
  F64_t,
  C1_t,
  C2_t,
  C3_t,
  C4_t,
  U8C1_t,
  U8C2_t,
  U8C3_t,
  U8C4_t,
  S32C1_t,
  S32C2_t,
  S32C3_t,
  S32C4_t,
  F32C1_t,
  F32C2_t,
  F32C3_t,
  F32C4_t,
  F64C1_t,
  F64C2_t,
  F64C3_t,
  F64C4_t,
  COLOR_RGBA2GRAY,
  COLOR_RGB2GRAY,
  COLOR_BGRA2GRAY,
  COLOR_BGR2GRAY,
  EPSILON,
  BOX_BLUR_NOSCALE,
  SVD_U_T,
  SVD_V_T
} = jsfeat;

// Utility functions export
export const {
  get_channel: jsfeat_get_channel,
  get_data_type: jsfeat_get_data_type,
  get_data_type_size: jsfeat_get_data_type_size
} = jsfeat;

// Module exports
export const {
  imgproc,
  math,
  linalg,
  matmath,
  cache,
  multiview,
  fast_corners,
  yape,
  yape06,
  orb,
  optical_flow_lk,
  haar,
  bbf
} = jsfeat;
