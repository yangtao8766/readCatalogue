#!/usr/bin/env node

import { readCatalogue } from "../dist/esm/chunk-index-C_XoNQG2.esm.js";
import path from "path";

const aegs = process.argv.slice(2);

if (aegs.length === 0) {
  console.log("请提供必填参数");
  process.exit(1);
}

const extArray = [".md", ".js", ".ts", ".json"];
const extObj = {
  md: ".md",
  js: ".js",
  ts: ".ts",
  json: ".json",
};

let ext, extIndex, excl, exclIndex;

function writeFindIndex() {
  return aegs.findIndex((item) => item === "--write" || item === "-w");
}

function extFindIndex() {
  return aegs.findIndex((item) => item === "--ext" || item === "-e");
}

function exclFindIndex() {
  return aegs.findIndex((item) => item === "--excl");
}

if (writeFindIndex() === -1) {
  console.log("请提供写入文件路径");
  process.exit(1);
}

const findPaths = aegs.slice(0, writeFindIndex());
const writePaths = aegs.slice(writeFindIndex() + 1, exclFindIndex());

if (extFindIndex() === -1) {
  extIndex = -1;
} else {
  extIndex = extFindIndex() + 1;
}

if (exclFindIndex() === -1) {
  exclIndex = -1;
} else {
  exclIndex = exclFindIndex() + 1;
}

ext = extObj[aegs[extIndex]] || ".md";
excl = aegs[exclIndex] || null;

if (!writePaths.length) {
  console.log("请提供写入文件路径");
  process.exit(1);
}

if (!extArray.includes(ext)) {
  console.log("请提供支持的文件后缀");
  process.exit(1);
}

if (findPaths.length !== writePaths.length) {
  console.log("查找的文件数量必须和写入的文件数量不一致");
  process.exit(1);
}

if (aegs.includes("--write") || aegs.includes("-w")) {
  console.log("start writing file");
  const findPath = findPaths.map((item) => path.resolve(process.cwd(), item));
  const writePath = writePaths.map((item) => path.resolve(process.cwd(), item));
  readCatalogue(findPath, writePath, {
    ext,
    exclude: new RegExp(excl),
  })
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
}
