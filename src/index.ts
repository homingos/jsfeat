// Import JSFeat library first
import './lib/jsfeat.js';
import './lib/jsfeat_imgproc.js';

import { JSFeatWrapper } from './jsfeat-wrapper';
// Create wrapper instance
const cv = new JSFeatWrapper();


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// Basic processing - all aligned with JSFeat API
const gray = cv.grayscale(imageData);
const blurred = cv.gaussianBlur(gray, { kernelSize: 5, sigma: 1.0 });
const edges = cv.canny(blurred, { lowThreshold: 50, highThreshold: 150 });

// Resizing (only downscaling supported)
const downscaled = cv.resample(gray, 160, 120); // Only if original > 160x120

// Feature detection
const lines = cv.houghLines(edges, { threshold: 100 });
const { gx, gy } = cv.sobelDerivatives(gray);

// Skin detection (works directly with color ImageData)
const skinMask = cv.skinDetection(imageData);