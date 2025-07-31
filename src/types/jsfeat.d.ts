// types/jsfeat.d.ts
declare global {
  interface Window {
    jsfeat: JSFeatGlobal;
  }
  
  interface JSFeatGlobal {
    REVISION: string;
    
    // Data types
    U8_t: number;
    S32_t: number;
    F32_t: number;
    S32C2_t: number;
    
    // Color conversion constants
    COLOR_RGBA2GRAY: number;
    COLOR_BGRA2GRAY: number;
    COLOR_RGB2GRAY: number;
    COLOR_BGR2GRAY: number;
    
    // Options
    BOX_BLUR_NOSCALE: number;
    
    // Matrix constructor
    matrix_t: {
      new(cols: number, rows: number, type: number, data_buffer?: ArrayBuffer): JSFeatMatrix;
    };
    
    // Modules
    cache: JSFeatCache;
    math: JSFeatMath;
    imgproc: JSFeatImgProc;
  }
  
  interface JSFeatMatrix {
    data: Uint8Array | Float32Array | Int32Array;
    type: number;
    channel: number;
    cols: number;
    rows: number;
    resize(cols: number, rows: number, channels: number): void;
  }
  
  interface JSFeatCache {
    get_buffer(size: number): any;
    put_buffer(buffer: any): void;
  }
  
  interface JSFeatMath {
    get_gaussian_kernel(size: number, sigma: number, kernel: any, type: number): void;
  }
  
  interface JSFeatImgProc {
    // Core functions from the actual source
    grayscale(src: Uint8Array | Uint8ClampedArray, w: number, h: number, dst: JSFeatMatrix, code?: number): void;
    resample(src: JSFeatMatrix, dst: JSFeatMatrix, nw: number, nh: number): void;
    box_blur_gray(src: JSFeatMatrix, dst: JSFeatMatrix, radius: number, options?: number): void;
    gaussian_blur(src: JSFeatMatrix, dst: JSFeatMatrix, kernel_size?: number, sigma?: number): void;
    pyrdown(src: JSFeatMatrix, dst: JSFeatMatrix, sx?: number, sy?: number): void;
    scharr_derivatives(src: JSFeatMatrix, dst: JSFeatMatrix): void;
    sobel_derivatives(src: JSFeatMatrix, dst: JSFeatMatrix): void;
    compute_integral_image(src: JSFeatMatrix, dst_sum?: Int32Array, dst_sqsum?: Int32Array, dst_tilted?: Int32Array): void;
    equalize_histogram(src: JSFeatMatrix, dst: JSFeatMatrix): void;
    canny(src: JSFeatMatrix, dst: JSFeatMatrix, low_thresh: number, high_thresh: number): void;
    hough_transform(img: JSFeatMatrix, rho_res: number, theta_res: number, threshold: number): Array<[number, number]>;
    warp_perspective(src: JSFeatMatrix, dst: JSFeatMatrix, transform: JSFeatMatrix, fill_value?: number): void;
    warp_affine(src: JSFeatMatrix, dst: JSFeatMatrix, transform: JSFeatMatrix, fill_value?: number): void;
    skindetector(src: ImageData, dst: Uint8Array): void;
  }
}

export {};
