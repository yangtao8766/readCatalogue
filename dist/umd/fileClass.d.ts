interface FileFunction {
    getContent: (isBuffer: boolean) => Promise<any>;
    getChildren: () => Promise<any[]>;
}
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
    getChildren(): Promise<any[]>;
    static getFile(filename: string): Promise<FileDir>;
}
/**
 * 创建文件对象
 * @param mdContent
 * @param filename
 * @returns
 */
export declare function createFile(mdContent: string[], filename: string): Promise<FileDir[]>;
/**
 * 读取一个一个文件对象信息
 */
export declare function readFile(file: FileDir[]): Promise<PromiseSettledResult<string | Buffer | null>[]>;
export {};
