import type { DefaultOption, ImageDefaultOption } from "../types/index";
/**
 * 得到一个目录的所有指定后缀文件
 * @param option
 * @param mdname
 */
export declare function getFileAll(option: DefaultOption, mdname: string): Promise<any[]>;
export declare function getImageFile(option: ImageDefaultOption, path: string): Promise<string[]>;
/**
 * 写入文件内容
 * @param fileArray
 */
export declare function writeFileAll(fileArray: PromiseSettledResult<any>[], writename: string): Promise<void>;
/**
 * 对文件进行排序
 * @param mdContent
 */
export declare function sortFile(mdContent: string[]): string[];
/**
 * 检查文件是否存在
 * @param path 文件路径
 * @returns
 */
export declare function checkFileExists(path: string): Promise<boolean>;
/**
 * 文件存在和不存在的处理函数
 */
export declare function handleFile(check: boolean, path: string): Promise<void>;
