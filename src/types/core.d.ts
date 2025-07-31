// =============================================================================
// src/types/jsfeat/core.d.ts
// =============================================================================

export declare class data_t {
  constructor(size_in_bytes: number, buffer?: ArrayBuffer);
  size: number;
  buffer: ArrayBuffer;
  u8: Uint8Array;
  i32: Int32Array;
  f32: Float32Array;
  f64: Float64Array;
}

export declare class matrix_t {
  constructor(
    cols: number,
    rows: number,
    data_type: number,
    data_buffer?: data_t
  );
  type: number;
  channel: number;
  cols: number;
  rows: number;
  buffer: data_t;
  data: Uint8Array | Int32Array | Float32Array | Float64Array;

  allocate(): void;
  resize(cols: number, rows: number, channels?: number): void;
  copy_to(other: matrix_t): void;
}

export declare class keypoint_t {
  constructor(
    x?: number,
    y?: number,
    score?: number,
    level?: number,
    angle?: number
  );
  x: number;
  y: number;
  score: number;
  level: number;
  angle: number;
}

export declare class pyramid_t {
  constructor(levels: number);
  levels: number;
  data: matrix_t[];
  pyrdown: (src: matrix_t, dst: matrix_t, sx?: number, sy?: number) => void;

  allocate(start_w: number, start_h: number, data_type: number): void;
  build(input: matrix_t, skip_first_level?: boolean): void;
}

export declare function get_channel(type: number): number;
export declare function get_data_type(type: number): number;
export declare function get_data_type_size(type: number): number;
