const fs = require('fs');
const path = require('path');

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`✅ ${description}: ${path.basename(filePath)} (${sizeKB} KB)`);
    return true;
  } else {
    console.log(`❌ ${description}: ${path.basename(filePath)} not found`);
    return false;
  }
}

function verifyBuild() {
  console.log('🔍 Verifying CV package build...\n');

  let allGood = true;

  console.log('📦 Concatenated files:');
  allGood &= checkFile('./build/jsfeat.js', 'Concatenated JSFeat');
  allGood &= checkFile('./build/jsfeat-module.js', 'Module version');

  console.log('\n🏗️  Built files (tsup output):');
  allGood &= checkFile('./dist/index.js', 'CommonJS build');
  allGood &= checkFile('./dist/index.mjs', 'ES Modules build'); // tsup uses .mjs
  allGood &= checkFile('./dist/index.d.ts', 'Type definitions');

  console.log('\n🗺️  Source maps:');
  checkFile('./dist/index.js.map', 'CommonJS source map');
  checkFile('./dist/index.mjs.map', 'ES Modules source map');

  // Check if the built files actually contain content
  if (fs.existsSync('./dist/index.js')) {
    const content = fs.readFileSync('./dist/index.js', 'utf8');
    if (content.includes('jsfeat')) {
      console.log('✅ Built files contain JSFeat content');
    } else {
      console.log('⚠️  Built files may not contain JSFeat content');
    }
  }

  console.log(
    '\n' +
      (allGood
        ? '✅ Build verification passed!'
        : '❌ Build verification failed!')
  );

  return allGood;
}

if (require.main === module) {
  const success = verifyBuild();
  process.exit(success ? 0 : 1);
}

module.exports = { verifyBuild };
