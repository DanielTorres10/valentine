// deploy-windows.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Windows Deployment to GitHub Pages...\n');

// 1. Clean and build
console.log('📦 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit', shell: true });
} catch (error) {
  console.error('❌ Build failed');
  console.error(error.message);
  process.exit(1);
}

// 2. Check what was built
console.log('\n📁 Checking dist folder...');
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  const files = fs.readdirSync(distPath);
  console.log(`Found ${files.length} files/folders:`);
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    const size = stats.isDirectory() ? '[DIR]' : `${(stats.size / 1024).toFixed(1)}KB`;
    console.log(`  ${file.padEnd(20)} ${size}`);
  });
} else {
  console.error('❌ dist folder not found!');
  process.exit(1);
}

// 3. Check index.html paths
console.log('\n🔍 Checking index.html paths...');
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, 'utf8');
  
  // Check for correct paths
  const hasAssetsPath = html.includes('/r3f-audio-visualizer/assets/');
  const hasSrcPath = html.includes('/src/main.tsx');
  
  console.log(`✅ Has correct asset paths: ${hasAssetsPath}`);
  console.log(`❌ Has dev path (/src/main.tsx): ${hasSrcPath}`);
  
  if (hasSrcPath) {
    console.error('\n⚠️  ERROR: index.html still has dev path!');
    console.error('This means Vite did not build correctly.');
    console.error('Try: rm -rf dist && npm run build');
    process.exit(1);
  }
}

// 4. Add .nojekyll file
console.log('\n📝 Creating .nojekyll file...');
fs.writeFileSync(path.join(distPath, '.nojekyll'), '');

// 5. Copy public folder if exists
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  console.log('📄 Copying public files...');
  const copyRecursive = (src, dest) => {
    if (fs.statSync(src).isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach(item => {
        copyRecursive(path.join(src, item), path.join(dest, item));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  const publicFiles = fs.readdirSync(publicPath);
  publicFiles.forEach(file => {
    copyRecursive(
      path.join(publicPath, file),
      path.join(distPath, file)
    );
    console.log(`  Copied: ${file}`);
  });
}

// 6. Deploy
console.log('\n🚀 Deploying to GitHub Pages...');
try {
  execSync('npx gh-pages -d dist --dotfiles', { stdio: 'inherit', shell: true });
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

console.log('\n✅ DEPLOYMENT SUCCESSFUL!');
console.log('🌐 Your site: https://danieltorres10.github.io/r3f-audio-visualizer/');
console.log('\n📋 Next steps:');
console.log('1. Wait 1-2 minutes for GitHub Pages to update');
console.log('2. Visit the URL above');
console.log('3. Press Ctrl+Shift+I to open DevTools');
console.log('4. Check Console tab for errors');