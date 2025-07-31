// jsfeat-wrapper.ts
export interface ProcessingOptions {
  radius?: number;
  sigma?: number;
  kernelSize?: number;
  lowThreshold?: number;
  highThreshold?: number;
  fillValue?: number;
  sx?: number;
  sy?: number;
  rhoResolution?: number;
  thetaResolution?: number;
  threshold?: number;
  colorCode?: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Line {
  rho: number;
  theta: number;
}

export interface GradientResult {
  gx: ImageData;
  gy: ImageData;
}

/**
 * TypeScript wrapper for JSFeat computer vision library
 * Provides type-safe access to JSFeat functions with ImageData conversion
 */
export class JSFeatWrapper {
  private jsfeat: JSFeatGlobal;
  private initialized: boolean = false;

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  /**
   * Check if wrapper is properly initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Create a new JSFeat matrix
   */
  createMatrix(width: number, height: number, type: number = 0x0100, channels: number = 1): JSFeatMatrix {
    if (!this.initialized) throw new Error('JSFeat not initialized');
    const actualType = type | channels;
    return new this.jsfeat.matrix_t(width, height, actualType);
  }

  /**
   * Convert ImageData to JSFeat matrix
   */
  imageDataToMatrix(imageData: ImageData, channels: number = 4): JSFeatMatrix {
    const matrix = this.createMatrix(imageData.width, imageData.height, this.jsfeat.U8_t, channels);
    
    if (channels === 4) {
      (matrix.data as Uint8Array).set(imageData.data);
    } else if (channels === 1) {
      // Convert RGBA to grayscale manually if needed
      const data = matrix.data as Uint8Array;
      for (let i = 0; i < imageData.width * imageData.height; i++) {
        const r = imageData.data[i * 4];
        const g = imageData.data[i * 4 + 1];
        const b = imageData.data[i * 4 + 2];
        data[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      }
    }
    
    return matrix;
  }

  /**
   * Convert JSFeat matrix to ImageData
   */
  matrixToImageData(matrix: JSFeatMatrix): ImageData {
    if (matrix.channel === 1) {
      // Grayscale to RGBA
      const rgbaData = new Uint8ClampedArray(matrix.cols * matrix.rows * 4);
      const data = matrix.data as Uint8Array;
      
      for (let i = 0; i < data.length; i++) {
        const value = data[i];
        rgbaData[i * 4] = value;     // R
        rgbaData[i * 4 + 1] = value; // G
        rgbaData[i * 4 + 2] = value; // B
        rgbaData[i * 4 + 3] = 255;   // A
      }
      return new ImageData(rgbaData, matrix.cols, matrix.rows);
    } else {
      return new ImageData(
        new Uint8ClampedArray(matrix.data as Uint8Array),
        matrix.cols,
        matrix.rows
      );
    }
  }

  // ==========================================
  // IMAGE PROCESSING FUNCTIONS
  // ==========================================

  /**
   * Convert color image to grayscale using JSFeat's optimized method
   * This matches the actual jsfeat.imgproc.grayscale signature
   */
  grayscale(imageData: ImageData, options: ProcessingOptions = {}): ImageData {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const { colorCode = this.jsfeat.COLOR_RGBA2GRAY } = options;
    const dstMatrix = this.createMatrix(imageData.width, imageData.height, this.jsfeat.U8_t, 1);
    
    // Call the actual JSFeat grayscale function with correct parameters
    this.jsfeat.imgproc.grayscale(
      imageData.data,           // src: Uint8Array
      imageData.width,          // w: number  
      imageData.height,         // h: number
      dstMatrix,               // dst: JSFeatMatrix
      colorCode                // code: number
    );

    return this.matrixToImageData(dstMatrix);
  }

  /**
   * Apply Gaussian blur
   */
  gaussianBlur(imageData: ImageData, options: ProcessingOptions = {}): ImageData {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const { kernelSize = 5, sigma = 1.0 } = options;
    
    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    const dstMatrix = this.createMatrix(grayImage.width, grayImage.height, this.jsfeat.U8_t, 1);

    // JSFeat expects kernel_size and sigma as separate parameters
    this.jsfeat.imgproc.gaussian_blur(srcMatrix, dstMatrix, kernelSize, sigma);
    return this.matrixToImageData(dstMatrix);
  }

  /**
   * Apply box blur to grayscale image
   */
  boxBlur(imageData: ImageData, options: ProcessingOptions = {}): ImageData {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const { radius = 3, fillValue = 0 } = options;
    
    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    const dstMatrix = this.createMatrix(grayImage.width, grayImage.height, this.jsfeat.U8_t, 1);

    // JSFeat box_blur_gray signature: (src, dst, radius, options)
    this.jsfeat.imgproc.box_blur_gray(srcMatrix, dstMatrix, radius, fillValue);
    return this.matrixToImageData(dstMatrix);
  }

  /**
   * Resample/resize image using JSFeat's optimized algorithm
   * Note: JSFeat only resizes DOWN (when src > dst), not up
   */
  resample(imageData: ImageData, newWidth: number, newHeight: number): ImageData {
    if (!this.initialized) throw new Error('JSFeat not initialized');
    if (newWidth <= 0 || newHeight <= 0) throw new Error('Invalid dimensions');

    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    const dstMatrix = this.createMatrix(newWidth, newHeight, this.jsfeat.U8_t, 1);

    // JSFeat resample only works when downscaling
    if (grayImage.width > newWidth && grayImage.height > newHeight) {
      this.jsfeat.imgproc.resample(srcMatrix, dstMatrix, newWidth, newHeight);
    } else {
      throw new Error('JSFeat resample only supports downscaling (src dimensions must be larger than dst)');
    }
    
    return this.matrixToImageData(dstMatrix);
  }

  /**
   * Pyramid down-sampling (reduces image size by half)
   */
  pyrDown(imageData: ImageData, options: ProcessingOptions = {}): ImageData {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const { sx = 0, sy = 0 } = options;
    
    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    const dstMatrix = this.createMatrix(
      Math.floor(grayImage.width / 2), 
      Math.floor(grayImage.height / 2), 
      this.jsfeat.U8_t, 
      1
    );

    this.jsfeat.imgproc.pyrdown(srcMatrix, dstMatrix, sx, sy);
    return this.matrixToImageData(dstMatrix);
  }

  /**
   * Histogram equalization for improved contrast
   */
  equalizeHistogram(imageData: ImageData): ImageData {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    const dstMatrix = this.createMatrix(grayImage.width, grayImage.height, this.jsfeat.U8_t, 1);

    this.jsfeat.imgproc.equalize_histogram(srcMatrix, dstMatrix);
    return this.matrixToImageData(dstMatrix);
  }

  // ==========================================
  // EDGE DETECTION FUNCTIONS
  // ==========================================

  /**
   * Canny edge detection
   */
  canny(imageData: ImageData, options: ProcessingOptions = {}): ImageData {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const { lowThreshold = 50, highThreshold = 100 } = options;
    
    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    const dstMatrix = this.createMatrix(grayImage.width, grayImage.height, this.jsfeat.U8_t, 1);

    this.jsfeat.imgproc.canny(srcMatrix, dstMatrix, lowThreshold, highThreshold);
    return this.matrixToImageData(dstMatrix);
  }

  /**
   * Compute Sobel derivatives (gradients)
   */
  sobelDerivatives(imageData: ImageData): GradientResult {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    // JSFeat derivatives output is 2-channel S32 format
    const dstMatrix = this.createMatrix(grayImage.width, grayImage.height, this.jsfeat.S32_t, 2);

    this.jsfeat.imgproc.sobel_derivatives(srcMatrix, dstMatrix);

    return this.splitGradientMatrix(dstMatrix);
  }

  /**
   * Compute Scharr derivatives (more accurate gradients)
   */
  scharrDerivatives(imageData: ImageData): GradientResult {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    // JSFeat derivatives output is 2-channel S32 format  
    const dstMatrix = this.createMatrix(grayImage.width, grayImage.height, this.jsfeat.S32_t, 2);

    this.jsfeat.imgproc.scharr_derivatives(srcMatrix, dstMatrix);

    return this.splitGradientMatrix(dstMatrix);
  }

  /**
   * Helper function to split 2-channel gradient matrix into separate X and Y images
   */
  private splitGradientMatrix(gradientMatrix: JSFeatMatrix): GradientResult {
    const data = gradientMatrix.data as Int32Array;
    const gxMatrix = this.createMatrix(gradientMatrix.cols, gradientMatrix.rows, this.jsfeat.U8_t, 1);
    const gyMatrix = this.createMatrix(gradientMatrix.cols, gradientMatrix.rows, this.jsfeat.U8_t, 1);
    
    const gxData = gxMatrix.data as Uint8Array;
    const gyData = gyMatrix.data as Uint8Array;

    for (let i = 0; i < gxData.length; i++) {
      // JSFeat gradients are interleaved: [gx0, gy0, gx1, gy1, ...]
      // Normalize and clamp gradients to 0-255 range
      gxData[i] = Math.min(Math.max(Math.abs(data[i * 2]) >> 2, 0), 255);
      gyData[i] = Math.min(Math.max(Math.abs(data[i * 2 + 1]) >> 2, 0), 255);
    }

    return {
      gx: this.matrixToImageData(gxMatrix),
      gy: this.matrixToImageData(gyMatrix)
    };
  }

  // ==========================================
  // FEATURE DETECTION FUNCTIONS
  // ==========================================

  /**
   * Hough line transform for detecting straight lines
   */
  houghLines(imageData: ImageData, options: ProcessingOptions = {}): Line[] {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const { 
      rhoResolution = 1, 
      thetaResolution = Math.PI / 180, 
      threshold = 100 
    } = options;
    
    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);

    const lines = this.jsfeat.imgproc.hough_transform(
      srcMatrix, 
      rhoResolution, 
      thetaResolution, 
      threshold
    );

    return lines.map(([rho, theta]) => ({ rho, theta }));
  }

  /**
   * Basic skin detection filter
   * Note: JSFeat skindetector expects ImageData directly, not matrix
   */
  skinDetection(imageData: ImageData): ImageData {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const result = new Uint8Array(imageData.width * imageData.height);
    
    // JSFeat skindetector works directly with ImageData
    this.jsfeat.imgproc.skindetector(imageData, result);

    const resultMatrix = this.createMatrix(imageData.width, imageData.height, this.jsfeat.U8_t, 1);
    (resultMatrix.data as Uint8Array).set(result);
    
    return this.matrixToImageData(resultMatrix);
  }

  // ==========================================
  // GEOMETRIC TRANSFORMATION FUNCTIONS
  // ==========================================

  /**
   * Apply perspective transformation
   */
  warpPerspective(imageData: ImageData, transform: number[], options: ProcessingOptions = {}): ImageData {
    if (!this.initialized) throw new Error('JSFeat not initialized');
    if (transform.length !== 9) throw new Error('Transform matrix must have 9 elements (3x3)');

    const { fillValue = 0 } = options;
    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    const dstMatrix = this.createMatrix(grayImage.width, grayImage.height, this.jsfeat.U8_t, 1);
    
    // Create transform matrix (3x3)
    const transformMatrix = this.createMatrix(3, 3, this.jsfeat.F32_t, 1);
    (transformMatrix.data as Float32Array).set(transform);

    this.jsfeat.imgproc.warp_perspective(srcMatrix, dstMatrix, transformMatrix, fillValue);
    return this.matrixToImageData(dstMatrix);
  }

  /**
   * Apply affine transformation
   */
  warpAffine(imageData: ImageData, transform: number[], options: ProcessingOptions = {}): ImageData {
    if (!this.initialized) throw new Error('JSFeat not initialized');
    if (transform.length !== 6 && transform.length !== 9) {
      throw new Error('Transform matrix must have 6 elements (2x3) or 9 elements (3x3)');
    }

    const { fillValue = 0 } = options;
    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    const dstMatrix = this.createMatrix(grayImage.width, grayImage.height, this.jsfeat.U8_t, 1);
    
    // Create transform matrix (2x3 or 3x3, but JSFeat only uses first 6 elements)
    const transformMatrix = this.createMatrix(2, 3, this.jsfeat.F32_t, 1);
    (transformMatrix.data as Float32Array).set(transform.slice(0, 6));

    this.jsfeat.imgproc.warp_affine(srcMatrix, dstMatrix, transformMatrix, fillValue);
    return this.matrixToImageData(dstMatrix);
  }

  // ==========================================
  // ADVANCED FUNCTIONS
  // ==========================================

  /**
   * Compute integral image for fast region sum calculations
   * JSFeat signature: compute_integral_image(src, dst_sum?, dst_sqsum?, dst_tilted?)
   */
  computeIntegralImage(imageData: ImageData, options: { 
    computeSum?: boolean; 
    computeSqSum?: boolean; 
    computeTilted?: boolean; 
  } = {}): {
    sum?: Int32Array;
    sqsum?: Int32Array;
    tilted?: Int32Array;
  } {
    if (!this.initialized) throw new Error('JSFeat not initialized');

    const { computeSum = true, computeSqSum = false, computeTilted = false } = options;
    
    const grayImage = this.grayscale(imageData);
    const srcMatrix = this.imageDataToMatrix(grayImage, 1);
    
    // Integral image size is (w+1) x (h+1)
    const size = (grayImage.width + 1) * (grayImage.height + 1);
    
    const sum = computeSum ? new Int32Array(size) : undefined;
    const sqsum = computeSqSum ? new Int32Array(size) : undefined;
    const tilted = computeTilted ? new Int32Array(size) : undefined;

    this.jsfeat.imgproc.compute_integral_image(srcMatrix, sum, sqsum, tilted);

    return { sum, sqsum, tilted };
  }
}

// Export a default instance for convenience
export const cv = new JSFeatWrapper();