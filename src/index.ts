import { readFile, createFile, FileDir } from "./fileClass";
import {
  getFileAll,
  writeFileAll,
  getImageFile,
  checkFileExists,
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
const enumImageArr: FileImageExt[] = [
  EnumFileImageExt.PNG,
  EnumFileImageExt.JPG,
  EnumFileImageExt.JPEG,
  EnumFileImageExt.GIF,
  EnumFileImageExt.SVG,
  EnumFileImageExt.WEBP,
];
// 获取当前目录下的所有文件和文件夹
export const readCatalogue: ReadCatalogueType = async (
  findPosition,
  writingPosition,
  options = {}
) => {
  if (typeof findPosition !== "string" || typeof writingPosition !== "string") {
    console.error(new TypeError("type in not sting"));
    return;
  }
  const filename = findPosition;
  const to = writingPosition;

  const defaultOption: DefaultOption = {
    regexp: options.exclude || null,
    ext: options.ext || EnumFileTypes.JS,
    sort: options.sort || false,
    hierarchy: options.hierarchy || 5,
    overlookFile: options.overlookFile || "node_modules",
  };
  mdContent = await getFileAll(
    defaultOption,
    path.join(filename, "/**").replace(/\\/g, "/")
  );
  const result = await createFile(mdContent);
  const readFileContent = await readFile(result);
  const check = await checkFileExists(to);

  if (!check) {
    await fs.promises.mkdir(to, { recursive: true });
  } else {
    await fs.promises.rm(to, { recursive: true, force: true });
    await fs.promises.mkdir(to, { recursive: true });
  }
  const file = await FileDir.getFile(filename);

  await writeFileAll(
    readFileContent,
    path.join(to, file.name + defaultOption.ext)
  );
  copyImageFilesAll(filename, to);
};
async function copyImageFilesAll(
  fileImagePath: string,
  writeIamagePath: string,
  options: ImageOptions = {}
) {
  const defaultOption: ImageDefaultOption = {
    regexp: options.exclude || null,
    ext: enumImageArr,
  };
  const writePath = path.resolve(writeIamagePath, "assets");

  let imageArray = await getImageFile(
    defaultOption,
    path.join(fileImagePath, "/**").replace(/\\/g, "/")
  );
  const result = imageArray.map((item) => {
    const fileImageNamePath = path.resolve(fileImagePath, item);

    return FileDir.getFile(fileImageNamePath);
  });
  const resultFile = await Promise.all(result);

  const check = await checkFileExists(writePath);

  if (!check) {
    await fs.promises.mkdir(writePath, { recursive: true });
  }

  resultFile.forEach((item) => {
    item.copyImageFiles(item, writePath);
  });

  console.log("copyImageFilesAll success");
}
