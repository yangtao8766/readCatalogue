import { readFile, createFile } from "./fileClass";
import { getFileAll, sortFile, writeFileAll } from "./util/index";

enum FileTypes {
  MD = ".md",
  JS = ".js",
  TS = ".ts",
  JSON = ".json",
}

type TypeFileTypes = {
  MD: ".md";
  JS: ".js";
  TS: ".ts";
  JSON: ".json";
};

type FileTypesExt = TypeFileTypes[keyof TypeFileTypes];

type Options = {
  exclude?: RegExp | null;
  ext?: FileTypesExt;
  sort?: boolean;
  hierarchy?: number;
  overlookFile?: string;
};

type DefaultOption = {
  regexp: RegExp | null;
  ext: FileTypesExt;
  sort: boolean;
  hierarchy: number;
  overlookFile: string;
};

type ReadCatalogueType = (
  findPosition: string,
  writingPosition: string,
  options?: Options
) => Promise<any>;

let mdContent: string[] = [];

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
  const to = writingPosition.endsWith(options.ext as string)
    ? writingPosition
    : writingPosition + options.ext;
  let mdname = filename + "/**";

  const defaultOption: DefaultOption = {
    regexp: options.exclude || null,
    ext: options.ext || FileTypes.JS,
    sort: options.sort || false,
    hierarchy: options.hierarchy || 5,
    overlookFile: options.overlookFile || "node_modules",
  };

  mdContent = await getFileAll(defaultOption, mdname);

  mdContent = sortFile(mdContent);

  const result = await createFile(mdContent, filename);

  const readFileContent = await readFile(result);

  await writeFileAll(readFileContent, to);
};
