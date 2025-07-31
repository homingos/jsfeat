// =============================================================================
// src/types/index.d.ts
// =============================================================================

// Re-export all modular types
export * from './constants';
export * from './core';
export * from './imgproc';
export * from './math';
export * from './linalg';
export * from './matmath';
export * from './cache';
export * from './multiview';
export * from './features';
export * from './optical-flow';
export * from './haar';
export * from './bbf';

// Import types for the main namespace
import type {
  data_t,
  matrix_t,
  keypoint_t,
  pyramid_t,
  get_channel,
  get_data_type,
  get_data_type_size
} from './core';

import type {
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
} from './constants';

import type * as ImgProcNamespace from './imgproc';
import type * as MathNamespace from './math';
import type * as LinAlgNamespace from './linalg';
import type * as MatMathNamespace from './matmath';
import type * as CacheNamespace from './cache';
import type * as MultiViewNamespace from './multiview';
import type * as FeaturesNamespace from './features';
import type * as OpticalFlowNamespace from './optical-flow';
import type * as HaarNamespace from './haar';
import type * as BBFNamespace from './bbf';

interface JSFeatInterface {
  // Core classes (as constructors)
  matrix_t: typeof matrix_t;
  data_t: typeof data_t;
  keypoint_t: typeof keypoint_t;
  pyramid_t: typeof pyramid_t;

  // Constants
  U8_t: typeof U8_t;
  S32_t: typeof S32_t;
  F32_t: typeof F32_t;
  F64_t: typeof F64_t;
  C1_t: typeof C1_t;
  C2_t: typeof C2_t;
  C3_t: typeof C3_t;
  C4_t: typeof C4_t;
  U8C1_t: typeof U8C1_t;
  U8C2_t: typeof U8C2_t;
  U8C3_t: typeof U8C3_t;
  U8C4_t: typeof U8C4_t;
  S32C1_t: typeof S32C1_t;
  S32C2_t: typeof S32C2_t;
  S32C3_t: typeof S32C3_t;
  S32C4_t: typeof S32C4_t;
  F32C1_t: typeof F32C1_t;
  F32C2_t: typeof F32C2_t;
  F32C3_t: typeof F32C3_t;
  F32C4_t: typeof F32C4_t;
  F64C1_t: typeof F64C1_t;
  F64C2_t: typeof F64C2_t;
  F64C3_t: typeof F64C3_t;
  F64C4_t: typeof F64C4_t;
  COLOR_RGBA2GRAY: typeof COLOR_RGBA2GRAY;
  COLOR_RGB2GRAY: typeof COLOR_RGB2GRAY;
  COLOR_BGRA2GRAY: typeof COLOR_BGRA2GRAY;
  COLOR_BGR2GRAY: typeof COLOR_BGR2GRAY;
  EPSILON: typeof EPSILON;
  BOX_BLUR_NOSCALE: typeof BOX_BLUR_NOSCALE;
  SVD_U_T: typeof SVD_U_T;
  SVD_V_T: typeof SVD_V_T;

  // Utility functions
  get_channel: typeof get_channel;
  get_data_type: typeof get_data_type;
  get_data_type_size: typeof get_data_type_size;

  // Modules (fully typed)
  imgproc: typeof ImgProcNamespace;
  math: typeof MathNamespace;
  linalg: typeof LinAlgNamespace;
  matmath: typeof MatMathNamespace;
  cache: typeof CacheNamespace;
  multiview: typeof MultiViewNamespace;
  fast_corners: typeof FeaturesNamespace.fast_corners;
  yape: typeof FeaturesNamespace.yape;
  yape06: typeof FeaturesNamespace.yape06;
  orb: typeof FeaturesNamespace.orb;
  optical_flow_lk: typeof OpticalFlowNamespace;
  haar: typeof HaarNamespace;
  bbf: typeof BBFNamespace;
}

declare const jsfeat: JSFeatInterface;

export default jsfeat;
