const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assetsPath = path.join(__dirname, 'assets');
const firmwarePath = path.join(assetsPath, 'firmware');
const manifestPath = path.join(assetsPath, 'manifests');

function loadFirmware() {
  if (!fs.existsSync(firmwarePath)) return [];
  const items = fs.readdirSync(firmwarePath);
  return items.filter(item => item.endsWith('.zip') || fs.statSync(path.join(firmwarePath, item)).isDirectory());
}

function getManifest() {
  if (!fs.existsSync(manifestPath)) return null;
  const files = fs.readdirSync(manifestPath).filter(f => f.includes('manifest') && f.endsWith('.json'));
  if (files.length === 0) return null;
  const content = fs.readFileSync(path.join(manifestPath, files[0]), 'utf-8');
  return JSON.parse(content);
}

function detectDeviceModel() {
  try {
    const output = execSync('adb shell getprop ro.product.model').toString().trim();
    return output || null;
  } catch {
    return null;
  }
}

function runUnlockSequence(mode, firmwareFile) {
  const fullPath = path.join(firmwarePath, firmwareFile);
  console.log(`🔓 [${mode}] Unlocking with ${firmwareFile}`);
  try {
    execSync(`adb push "${fullPath}" /sdcard/`);
    console.log(`✅ Firmware pushed`);
  } catch (err) {
    console.error(`❌ Unlock failed: ${err.message}`);
  }
}

module.exports = {
  loadFirmware,
  getManifest,
  detectDeviceModel,
  runUnlockSequence
};
