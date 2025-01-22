import { glob } from "glob";
import fs from "fs";

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

enum PromiseStatus {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}
let isSort: boolean = false;
/**
 * 得到一个目录的所有指定后缀文件
 * @param option
 * @param mdname
 */
export async function getFileAll(
  option: DefaultOption,
  mdname: string
): Promise<string[]> {
  let md = [];
  let result: string[] = [];
  for (let i = 0; i < option.hierarchy; i++) {
    md = await glob(`${mdname}${option.ext}`, {
      ignore: {
        ignored: (p: any) => Boolean(option.regexp?.test(p.name)),
        childrenIgnored: (p: any) => p.isNamed(option.overlookFile),
      },
      stat: option.sort,
    });
    mdname += "/**";
    result.push(...([...new Set(md)] as any));
  }
  result = [...new Set(result)];
  result = result.sort();

  return result;
}

/**
 * 写入文件内容
 * @param fileArray
 */
export async function writeFileAll(
  fileArray: PromiseSettledResult<any>[],
  writename: string
) {
  if (fileArray.length) {
    let text = "";
    fileArray.forEach((item) => {
      if (item.status === PromiseStatus.FULFILLED) {
        text += item.value + "\r\n";
      }
    });
    await fs.promises.writeFile(writename, text);
    console.log("write in  finish");
  } else {
    console.log("File not found");
  }
}

/**
 * 对文件进行排序
 * @param mdContent
 */
export function sortFile(mdContent: string[]) {
  const result: string[] = [];
  const numberRes: string[] = [];
  let resultAll: string[] = [];
  mdContent.forEach((item: string) => {
    const number = item.match(/\d+/g)?.[0];

    if (number) {
      if (~~number >= 10) {
        isSort = true;
        numberRes.push(item);
      } else {
        isSort = false;
        result.push(item);
      }
    } else {
      numberRes.push(item);
    }
  });
  return (resultAll = isSort ? [...result, ...numberRes] : [...result]);
}
