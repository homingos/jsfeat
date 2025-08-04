// =============================================================================
// packages/core/cv/scripts/concat-jsfeat.js
// =============================================================================
const fs = require('fs');
const path = require('path');

// File order from your Ant build script
const files = [
  'jsfeat.js',
  'jsfeat_struct.js',
  'jsfeat_cache.js',
  'jsfeat_math.js',
  'jsfeat_mat_math.js',
  'jsfeat_linalg.js',
  'jsfeat_motion_estimator.js',
  'jsfeat_imgproc.js',
  'jsfeat_fast_corners.js',
  'jsfeat_yape06.js',
  'jsfeat_yape.js',
  'jsfeat_orb.js',
  'jsfeat_optical_flow_lk.js',
  'jsfeat_haar.js',
  'jsfeat_bbf.js',
  'jsfeat_export.js'
];

const srcDir = path.join(__dirname, '../src/lib');
const buildDir = path.join(__dirname, '../build');
const outputFile = path.join(buildDir, 'jsfeat.js');

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

console.log('Concatenating JSFeat files...');

let concatenated = '';

files.forEach((file) => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`Adding: ${file}`);
    const content = fs.readFileSync(filePath, 'utf8');
    concatenated += content + '\n';
  } else {
    console.warn(`File not found: ${file}`);
  }
});

// Write standard concat file
fs.writeFileSync(outputFile, concatenated, 'utf8');
console.log(`JSFeat concatenated to: ${outputFile}`);

// Also create a clean ESM module version
const esmModuleVersion = `
// JSFeat Library - ESM Export Version
${concatenated}

// Attach to window (optional for browser)
if (typeof window !== 'undefined') {
  window.jsfeat = jsfeat;
}

// ESM export
export default jsfeat;
`;

fs.writeFileSync(
  path.join(buildDir, 'jsfeat-module.js'),
  esmModuleVersion,
  'utf8'
);
console.log('ESM module version created at: build/jsfeat-module.js');
