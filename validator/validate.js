const fs = require('fs');
const path = require('path');

// Load ruleset
const rulesetPath = path.join(__dirname, '../ghost_ruleset.json');
const ruleset = JSON.parse(fs.readFileSync(rulesetPath, 'utf8'));

// Extract bypass list
const bypassList = ruleset.bypass_list || [];

// Define current user identity (can be dynamic later)
const currentUser = 'daniel_sielaff';

// Check for bypass
const isBypassed = bypassList.some(entry => entry.value === currentUser);

// Audit log path
const auditLogPath = path.join(__dirname, 'ghost_audit.log');

// Log function
function logBypass() {
  const timestamp = new Date().toISOString();
  const logEntry = `[GhostTools] Bypass triggered by ${currentUser} at ${timestamp}\n`;
  fs.appendFileSync(auditLogPath, logEntry);
}

// Enforcement
if (isBypassed) {
  console.log(`[GhostTools] Developer bypass active for ${currentUser}`);
  logBypass();
  process.exit(0);
} else {
  console.log('[GhostTools] No bypass detected. Proceeding with enforcement.');
  // Insert enforcement logic here (e.g., version check, license validation)
}
