import fs from "fs";
import path from "path";
import SparkMD5 from "spark-md5";
import type { FileFunction } from "./types/index";
import { compareNumbers } from "./util/index";

/**
 * 一个文件对象
 */
export class FileDir implements FileFunction {
  constructor(
    public filename: string,
    public name: string,
    public ext: string,
    public isFile: boolean,
    public size: number,
    public createTime: Date,
    public updateTime: Date
  ) {
    this.filename = filename;
    this.name = name;
    this.ext = ext;
    this.isFile = isFile;
    this.size = size;
    this.createTime = createTime;
    this.updateTime = updateTime;
  }

  async getContent(isBuffer = false) {
    if (this.isFile) {
      if (isBuffer) {
        return await fs.promises.readFile(this.filename);
      } else {
        return await fs.promises.readFile(this.filename, "utf-8");
      }
    }
    return null;
  }

  async copyImageFiles(files: FileDir, writeIamagePath: string) {
    await fs.promises.copyFile(
      files.filename,
      writeIamagePath + "/" + files.name
    );
  }

  async getChildren() {
    if (this.isFile) {
      //文件不可能有子文件
      return [];
    }
    let children: any = await fs.promises.readdir(this.filename);
    children = children.map((name: string) => {
      const result = path.resolve(this.filename, name);
      return FileDir.getFile(result);
    });
    return Promise.all(children);
  }

  static async getFile(filename: string): Promise<FileDir> {
    const stat = await fs.promises.stat(filename);
    const name = path.basename(filename);
    const ext = path.extname(filename);
    const isFile = stat.isFile();
    const size = stat.size;
    const createTime = new Date(stat.birthtime);
    const updateTime = new Date(stat.mtime);
    return new FileDir(
      filename,
      name,
      ext,
      isFile,
      size,
      createTime,
      updateTime
    );
  }
}

/**
 * 创建文件对象
 * @param mdContent
 * @param filename
 * @returns
 */
export async function createFile(mdContent: string[]) {
  const result = mdContent.map(async (item: string) => {
    return await FileDir.getFile(item);
  });
  const resultFile = await Promise.all(result);
  return resultFile;
}

/**
 * 读取一个一个文件对象信息
 */
export async function readFile(files: FileDir[]) {
  const spark = new SparkMD5.ArrayBuffer();
  let hash: any[] = [];
  const result = files.map(async (file) => {
    const source = await file.getContent(true);
    spark.append(source as ArrayBuffer);
    const md5 = spark.end();
    hash.push({ ...file, md5 });
    return hash;
  });
  const hashArray = await Promise.all(result);
  const sourceArray = removeDuplicatesByMD5(hashArray.flat());
  const source = sourceArray
    .sort((a, b) => compareNumbers(a.filename, b.filename))
    .map(async (file) => {
      const sourceFile = new FileDir(
        file.filename,
        file.name,
        file.ext,
        file.isFile,
        file.size,
        file.createTime,
        file.updateTime
      );
      const source = await sourceFile.getContent();
      return source;
    });
  const resultText = await Promise.allSettled(source);
  return resultText;
}

function removeDuplicatesByMD5(hashs: any[]) {
  const fileNames = new Set();
  return hashs.filter(
    (item) => !fileNames.has(item.md5) && fileNames.add(item.md5)
  );
}
