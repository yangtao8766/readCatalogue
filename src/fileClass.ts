import fs from "fs";
import path from "path";
import type { FileFunction } from "./types/index";

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
export async function readFile(file: FileDir[]) {
  const result = file.map(async (file) => {
    return await file.getContent();
  });

  const resultText = await Promise.allSettled(result);

  return resultText;
}
