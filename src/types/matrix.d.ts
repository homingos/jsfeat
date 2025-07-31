declare namespace jsfeat {
  class matrix_t {
    constructor(rows: number, cols: number, data_type: number);
    data: Float32Array;
    rows: number;
    cols: number;
  }
}
export = jsfeat;
