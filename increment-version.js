import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get version type from command line argument (default: patch)
const args = process.argv.slice(2);
let versionType = 'patch'; // default

if (args.includes('--major')) {
  versionType = 'major';
} else if (args.includes('--minor')) {
  versionType = 'minor';
} else if (args.includes('--patch')) {
  versionType = 'patch';
}

// Read package.json
const packageJsonPath = join(__dirname, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// Read manifest.json
const manifestJsonPath = join(__dirname, 'manifest.json');
const manifestJson = JSON.parse(readFileSync(manifestJsonPath, 'utf8'));

// Parse current version
const [major, minor, patch] = packageJson.version.split('.').map(Number);
const oldVersion = packageJson.version;

// Calculate new version based on type
let newVersion;
switch (versionType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// Update package.json
packageJson.version = newVersion;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

// Update manifest.json
manifestJson.version = newVersion;
writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2) + '\n', 'utf8');

console.log(`✅ Version updated (${versionType}): ${oldVersion} → ${newVersion}`);
console.log(`   - package.json: ${newVersion}`);
console.log(`   - manifest.json: ${newVersion}`);
