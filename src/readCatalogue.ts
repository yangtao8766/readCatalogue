import { readFile, createFile, FileDir } from "./fileClass";
import {
  getFileAll,
  writeFileAll,
  getImageFile,
  checkFileExists,
  handleFile,
} from "./util/index";
import { EnumFileTypes, EnumFileImageExt } from "./enum/index";
import type {
  ReadCatalogueType,
  DefaultOption,
  ImageOptions,
  ImageDefaultOption,
  FileImageExt,
} from "./types/index";
import path from "path";
import fs from "fs";

let mdContent: string[] = [];
const ASSETS = "assets";
const enumImageArr: FileImageExt[] = [
  EnumFileImageExt.PNG,
  EnumFileImageExt.JPG,
  EnumFileImageExt.JPEG,
  EnumFileImageExt.GIF,
  EnumFileImageExt.SVG,
  EnumFileImageExt.WEBP,
];

const copyImageFilesAll = async (
  fileImagePath: string,
  writeIamagePath: string,
  options: ImageOptions = {}
) => {
  const defaultOption: ImageDefaultOption = {
    regexp: options.exclude || null,
    ext: enumImageArr,
  };
  const writePath = path.resolve(writeIamagePath, ASSETS);
  const check = await checkFileExists(writePath);

  let imageArray = await getImageFile(
    defaultOption,
    path.join(fileImagePath, "/**").replace(/\\/g, "/")
  );
  if (!imageArray.length) return console.log("no image");
  if (!check) {
    await fs.promises.mkdir(writePath);
  }

  const result = imageArray.map((item) => {
    const fileImageNamePath = path.resolve(fileImagePath, item);

    return FileDir.getFile(fileImageNamePath);
  });
  const resultFile = await Promise.all(result);

  resultFile.forEach((item) => {
    item.copyImageFiles(item, writePath);
  });

  console.log("copyImageFilesAll success");
};

const findFileAndWrite = async (
  filename: string,
  to: string,
  options: DefaultOption
) => {
  const check = await checkFileExists(to);

  mdContent = await getFileAll(
    options,
    path.join(filename, "/**").replace(/\\/g, "/")
  );
  if (!mdContent.length) {
    return console.log("no file");
  }

  await handleFile(check, to);
  await copyImageFilesAll(filename, to);

  const result = await createFile(mdContent);
  const readFileContent = await readFile(result);
  const file = await FileDir.getFile(to);
  await writeFileAll(readFileContent, path.join(to, file.name + options.ext));
};

// 获取当前目录下的所有文件和文件夹
export const readCatalogue: ReadCatalogueType = async (
  findPosition,
  writingPosition,
  options = {}
) => {
  findPosition = Array.isArray(findPosition) ? findPosition : [findPosition];
  writingPosition = Array.isArray(writingPosition)
    ? writingPosition
    : [writingPosition];

  const defaultOption: DefaultOption = {
    regexp: options.exclude || null,
    ext: options.ext || EnumFileTypes.JS,
    sort: options.sort || false,
    hierarchy: options.hierarchy || 5,
    overlookFile: options.overlookFile || "node_modules",
  };
  for (let i = 0; i < findPosition.length; i++) {
    await findFileAndWrite(findPosition[i], writingPosition[i], defaultOption);
  }
};
