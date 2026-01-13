#!/usr/bin/env node
/**
 * ================================================
 * NEW YORK IMAGING SPECIALISTS
 * Gallery Build Script - /scripts/build-gallery.js
 * ================================================
 * 
 * This script scans the /img/gallery/ directory and generates
 * a JSON file that the gallery JavaScript can load.
 * 
 * USAGE:
 *   node scripts/build-gallery.js
 * 
 * OPTIONS:
 *   --watch    Watch for changes and rebuild automatically
 * 
 * OUTPUT:
 *   Creates /data/gallery-images.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Source directory for gallery images
  sourceDir: './img/gallery',
  
  // Output JSON file
  outputFile: './data/gallery-images.json',
  
  // Supported image extensions
  extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'],
  
  // Whether to scan subdirectories
  recursive: true,
  
  // Generate categories from subdirectory names
  categoriesFromFolders: true
};

/**
 * Convert filename to readable title
 * "mri-suite-wide-bore.jpg" → "MRI Suite Wide Bore"
 */
function filenameToTitle(filename) {
  return filename
    .replace(/\.[^.]+$/, '')           // Remove extension
    .replace(/[-_]/g, ' ')             // Replace dashes/underscores with spaces
    .replace(/\b\w/g, c => c.toUpperCase()) // Capitalize words
    .replace(/\b(Mri|Ct|Pet|Nyi)\b/gi, match => match.toUpperCase()); // Uppercase acronyms
}

/**
 * Convert folder name to category
 * "waiting-rooms" → "waiting-rooms"
 */
function folderToCategory(folder) {
  return folder.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Scan directory for images
 */
function scanDirectory(dir, baseDir = dir, category = null) {
  const images = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`);
    console.log(`   Create the directory and add images, then run again.`);
    return images;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory() && CONFIG.recursive) {
      // Recurse into subdirectory
      const subCategory = CONFIG.categoriesFromFolders ? folderToCategory(item.name) : category;
      images.push(...scanDirectory(fullPath, baseDir, subCategory));
      
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      
      if (CONFIG.extensions.includes(ext)) {
        // Get relative path from base gallery directory
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        
        images.push({
          src: relativePath,
          alt: filenameToTitle(item.name),
          title: filenameToTitle(item.name),
          caption: "",  // Can be filled in manually in the JSON
          category: category || "general",
          // Metadata
          _file: item.name,
          _modified: fs.statSync(fullPath).mtime.toISOString()
        });
      }
    }
  }

  return images;
}

/**
 * Main build function
 */
function buildGallery() {
  console.log('🖼️  Building gallery index...\n');
  console.log(`   Source: ${CONFIG.sourceDir}`);
  console.log(`   Output: ${CONFIG.outputFile}\n`);

  // Scan for images
  const images = scanDirectory(CONFIG.sourceDir);

  if (images.length === 0) {
    console.log('⚠️  No images found!\n');
    console.log('   Add images to /img/gallery/ and run again.');
    console.log('   Supported formats:', CONFIG.extensions.join(', '));
    return;
  }

  // Sort images by category, then by filename
  images.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.src.localeCompare(b.src);
  });

  // Get unique categories
  const categories = [...new Set(images.map(img => img.category))];

  // Build output object
  const output = {
    _generated: new Date().toISOString(),
    _count: images.length,
    _categories: categories,
    basePath: "/img/gallery/",
    images: images
  };

  // Ensure output directory exists
  const outputDir = path.dirname(CONFIG.outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write JSON file
  fs.writeFileSync(
    CONFIG.outputFile,
    JSON.stringify(output, null, 2),
    'utf8'
  );

  console.log(`✅ Generated gallery index:`);
  console.log(`   • ${images.length} images found`);
  console.log(`   • ${categories.length} categories: ${categories.join(', ')}`);
  console.log(`   • Output: ${CONFIG.outputFile}\n`);
}

/**
 * Watch mode
 */
function watchMode() {
  console.log('👀 Watching for changes...\n');
  console.log('   Press Ctrl+C to stop.\n');

  // Initial build
  buildGallery();

  // Watch for changes
  fs.watch(CONFIG.sourceDir, { recursive: true }, (eventType, filename) => {
    if (filename) {
      const ext = path.extname(filename).toLowerCase();
      if (CONFIG.extensions.includes(ext) || eventType === 'rename') {
        console.log(`\n🔄 Change detected: ${filename}`);
        buildGallery();
      }
    }
  });
}

// Run
const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
  watchMode();
} else {
  buildGallery();
}