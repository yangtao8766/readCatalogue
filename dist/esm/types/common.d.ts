type TypeFileTypes = {
    MD: ".md";
    JS: ".js";
    TS: ".ts";
    JSON: ".json";
};
type TypeImage = {
    PNG: ".png";
    JPG: ".jpg";
    JPEG: ".jpeg";
    GIF: ".gif";
    SVG: ".svg";
    WEBP: ".webp";
};
type FileTypesExt = TypeFileTypes[keyof TypeFileTypes];
export type FileImageExt = TypeImage[keyof TypeImage];
type Options = {
    exclude?: RegExp | null;
    ext?: FileTypesExt;
    sort?: boolean;
    hierarchy?: number;
    overlookFile?: string;
};
export type ImageOptions = {
    exclude?: RegExp | null;
    ext?: FileImageExt[];
};
export type ImageDefaultOption = {
    regexp?: RegExp | null;
    ext: FileImageExt[];
};
export type DefaultOption = {
    regexp: RegExp | null;
    ext: FileTypesExt;
    sort: boolean;
    hierarchy: number;
    overlookFile: string;
};
export type ReadCatalogueType = (findPosition: string | string[], writingPosition: string | string[], options?: Options) => Promise<any>;
export interface FileFunction {
    getContent: (isBuffer: boolean) => Promise<any>;
    getChildren: () => Promise<any[]>;
}
export {};
