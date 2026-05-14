const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const backSrc = path.join(repoRoot, "packages", "back", "src");
const originalResolveFilename = Module._resolveFilename;

function resolveTsPath(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? basePath;
}

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  if (request.startsWith("@m/")) {
    return originalResolveFilename.call(
      this,
      resolveTsPath(path.join(backSrc, "modules", request.slice(3))),
      parent,
      isMain,
      options,
    );
  }

  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      resolveTsPath(path.join(backSrc, request.slice(2))),
      parent,
      isMain,
      options,
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
