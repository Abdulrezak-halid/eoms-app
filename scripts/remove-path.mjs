import fs from "node:fs/promises";
import path from "node:path";

const targets = process.argv.slice(2);

if (targets.length === 0) {
  console.error("Usage: node scripts/remove-path.mjs path [...]");
  process.exit(1);
}

for (const target of targets) {
  await fs.rm(path.resolve(target), {
    force: true,
    recursive: true,
  });
}
