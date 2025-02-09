import type { FileFunction } from "./types/index";
/**
 * 一个文件对象
 */
export declare class FileDir implements FileFunction {
    filename: string;
    name: string;
    ext: string;
    isFile: boolean;
    size: number;
    createTime: Date;
    updateTime: Date;
    constructor(filename: string, name: string, ext: string, isFile: boolean, size: number, createTime: Date, updateTime: Date);
    getContent(isBuffer?: boolean): Promise<string | Buffer | null>;
    copyImageFiles(files: FileDir, writeIamagePath: string): Promise<void>;
    getChildren(): Promise<any[]>;
    static getFile(filename: string): Promise<FileDir>;
}
/**
 * 创建文件对象
 * @param mdContent
 * @param filename
 * @returns
 */
export declare function createFile(mdContent: string[]): Promise<FileDir[]>;
/**
 * 读取一个一个文件对象信息
 */
export declare function readFile(files: FileDir[]): Promise<PromiseSettledResult<string | Buffer | null>[]>;
