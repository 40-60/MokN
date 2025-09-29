// purge-images.js
const fs = require("fs");
const path = require("path");

// Configuration
const REPO_OWNER = "40-60";
const REPO_NAME = "mokn"; // Change this to 'MokN---Webflow' if needed

// Helper function to make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const https = require("https");
    const http = require("http");

    const client = url.startsWith("https:") ? https : http;

    const req = client.request(url, (res) => {
      resolve({
        status: res.statusCode,
        statusText: res.statusMessage,
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

// Function to get all image files from a specific folder
function getImageFiles(folderPath) {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
  const files = [];

  if (!fs.existsSync(folderPath)) {
    console.error(`❌ Folder not found: ${folderPath}`);
    return files;
  }

  const items = fs.readdirSync(folderPath);

  items.forEach((item) => {
    const fullPath = path.join(folderPath, item);
    const ext = path.extname(item).toLowerCase();

    if (fs.statSync(fullPath).isFile() && imageExtensions.includes(ext)) {
      files.push(item);
    }
  });

  return files.sort(); // Sort files for better organization
}

// Main function to purge image sequences
async function purgeImageSequence(sequencePath) {
  const fullPath = path.join(__dirname, "dist", "img_sequences", sequencePath);
  const files = getImageFiles(fullPath);

  if (files.length === 0) {
    console.log(`⚠️  No image files found in: ${sequencePath}`);
    return;
  }

  const baseUrl = `https://purge.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}/dist/img_sequences/${sequencePath}/`;

  console.log(`🚀 Purging ${files.length} images from: ${sequencePath}`);
  console.log(`📍 Base URL: ${baseUrl}`);
  console.log("");

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const url = baseUrl + file;
    try {
      const res = await makeRequest(url);
      if (res.status === 200) {
        console.log(`✅ ${file}: ${res.status} ${res.statusText}`);
        successCount++;
      } else {
        console.log(`⚠️  ${file}: ${res.status} ${res.statusText}`);
        errorCount++;
      }
    } catch (err) {
      console.error(`❌ ${file}: ERROR`, err.message);
      errorCount++;
    }

    // Small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  console.log("");
  console.log(
    `📊 Summary for ${sequencePath}: ${successCount} successful, ${errorCount} errors`
  );
}

// Example usage and available sequences
const availableSequences = [
  "baits/loop",
  "baits/reveal",
  "carbon-bg",
  "home",
  "lantern/dim",
  "lantern/increase",
  "lantern/strong",
  "slider",
];

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("🎯 Available image sequences:");
  availableSequences.forEach((seq) => console.log(`   - ${seq}`));
  console.log("");
  console.log("Usage examples:");
  console.log("   node purge-images.js lantern/strong");
  console.log("   node purge-images.js carbon-bg");
  console.log("   node purge-images.js baits/loop");
} else {
  // Purge specified sequences
  args.forEach(async (sequence) => {
    await purgeImageSequence(sequence);
  });
}

// Export for use as module
module.exports = { purgeImageSequence, getImageFiles };
