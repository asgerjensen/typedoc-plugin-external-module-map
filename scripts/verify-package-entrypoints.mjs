import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const targets = [];

for (const field of ['main', 'module', 'types', 'typings']) {
  if (typeof pkg[field] === 'string') {
    targets.push([field, pkg[field]]);
  }
}

const collectExportTargets = (value, label) => {
  if (typeof value === 'string') {
    targets.push([label, value]);
    return;
  }

  if (!value || typeof value !== 'object') {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    collectExportTargets(child, `${label}.${key}`);
  }
};

if (pkg.exports) {
  collectExportTargets(pkg.exports, 'exports');
}

const packed = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json', '.'], {
    cwd: root,
    encoding: 'utf8',
  }),
)[0];
const packedFiles = new Set(packed.files.map((file) => normalize(file.path)));
const missing = [];

for (const [label, target] of targets) {
  const relative = normalize(target.replace(/^\.\//, ''));
  const candidates = [
    relative,
    join(relative, 'index.js'),
    join(relative, 'index.cjs'),
    join(relative, 'index.mjs'),
    join(relative, 'index.d.ts'),
  ];

  if (!candidates.some((candidate) => existsSync(join(root, candidate)))) {
    missing.push(`${label}: ${target} is missing from the build output`);
    continue;
  }

  if (!candidates.some((candidate) => packedFiles.has(candidate))) {
    missing.push(`${label}: ${target} is not included by npm pack`);
  }
}

if (missing.length > 0) {
  throw new Error(`Package entrypoint verification failed:\n${missing.join('\n')}`);
}

console.log(`Verified ${targets.length} package entrypoint targets.`);
