type TypeFileTypes = {
    MD: '.md';
    JS: '.js';
    TS: '.ts';
    JSON: '.json';
};
type FileTypesExt = TypeFileTypes[keyof TypeFileTypes];
type Options = {
    exclude?: RegExp | null;
    ext?: FileTypesExt;
    sort?: boolean;
    hierarchy?: number;
    overlookFile?: string;
};
export declare function readCatalogue(findPosition: string, writingPosition: string, options?: Options): Promise<void>;
export {};
