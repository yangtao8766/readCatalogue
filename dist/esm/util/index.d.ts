type TypeFileTypes = {
    MD: ".md";
    JS: ".js";
    TS: ".ts";
    JSON: ".json";
};
type FileTypesExt = TypeFileTypes[keyof TypeFileTypes];
type DefaultOption = {
    regexp: RegExp | null;
    ext: FileTypesExt;
    sort: boolean;
    hierarchy: number;
    overlookFile: string;
};
/**
 * 得到一个目录的所有指定后缀文件
 * @param option
 * @param mdname
 */
export declare function getFileAll(option: DefaultOption, mdname: string): Promise<string[]>;
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
export {};
