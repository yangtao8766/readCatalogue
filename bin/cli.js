#!/usr/bin/env node

const { readCatalogue } = require("../dist/common/chunk-index-C-AAJZ2K.cjs");
const path = require("path");

const aegs = process.argv.slice(2);

if (aegs.length === 0) {
  console.log("请提供必填参数");
  process.exit(1);
}

const extArray = [".md", ".js", ".ts", ".json"];
let ext, extIndex, excl, exclIndex;
console.log(aegs);

if (aegs.findIndex((item) => item === "--write" || item === "-w") === -1) {
  console.log("请提供写入文件参数");
  process.exit(1);
}

if (aegs.findIndex((item) => item === "--ext" || item === "-e") === -1) {
  extIndex = -1;
} else {
  extIndex = aegs.findIndex((item) => item === "--ext" || item === "-e") + 1;
}

const writeIndex =
  aegs.findIndex((item) => item === "--write" || item === "-w") + 1;

if (aegs.findIndex((item) => item === "--excl") === -1) {
  exclIndex = -1;
} else {
  exclIndex = aegs.findIndex((item) => item === "--excl") + 1;
}

ext = aegs[extIndex] || ".md";
excl = aegs[exclIndex] || null;

if (!aegs[writeIndex]) {
  console.log("请提供写入文件路径");
  process.exit(1);
}
if (!extArray.includes(ext)) {
  console.log("请提供支持的文件后缀");
  process.exit(1);
}

const findPath = path.resolve(process.cwd(), aegs[0]);
const writePath = path.resolve(process.cwd(), aegs[writeIndex]);

if (aegs.includes("--write") || aegs.includes("-w")) {
  console.log("writing to file");
  readCatalogue(findPath, writePath, {
    ext,
    exclude: new RegExp(excl),
  });
}
