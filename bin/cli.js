#!/usr/bin/env node

const { readCatalogue } = require("../dist/common/chunk-index-DgiliWLY.cjs");
const path = require("path");

const aegs = process.argv.slice(2);

if (aegs.length === 0) {
  console.log("请提供必填参数");
  process.exit(1);
}

console.log(aegs, "aegs");
const writeIndex =
  aegs.findIndex((item) => item === "--write" || item === "-w") + 1;

const extIndex =
  aegs.findIndex((item) => item === "--ext" || item === "-e") + 1;

const findPath = path.resolve(process.cwd(), aegs[0]);
const writePath = path.resolve(process.cwd(), aegs[writeIndex]);
console.log(findPath, "findPath");
console.log(writePath, "writePath");

if (aegs.includes("--write") || aegs.includes("-w")) {
  console.log("正在写入文件");
  readCatalogue(findPath, writePath, {
    ext: aegs[extIndex] || ".md",
  });
  console.log("写入完成");
}
