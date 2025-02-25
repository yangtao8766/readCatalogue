import { glob } from "glob";
import fs from "fs";
import path from "path";
import { PromiseStatus } from "../enum/index";
import type { DefaultOption, ImageDefaultOption } from "../types/index";

let isSort: boolean = false;

// 提取路径中的所有数字
const extractNumbers = (str: string) => {
  const matches = str.match(/\d+/g);
  return matches ? matches.map(Number) : [];
};

// 比较两个数组的数字
export const compareNumbers = (a: string, b: string): number => {
  const numbersA = extractNumbers(a);
  const numbersB = extractNumbers(b);

  for (let i = 0; i < Math.max(numbersA.length, numbersB.length); i++) {
    if (numbersA[i] !== numbersB[i]) {
      return (numbersA[i] || 0) - (numbersB[i] || 0);
    }
  }
  return 0;
};

/**
 * 得到一个目录的所有指定后缀文件
 * @param option
 * @param mdname
 */
export async function getFileAll(
  option: DefaultOption,
  mdname: string
): Promise<any[]> {
  let result = [];
  for (let i = 0; i < option.hierarchy; i++) {
    result.push(
      await glob(`${mdname}${option.ext}`, {
        ignore: {
          ignored: (p: any) => Boolean(option.regexp?.test(p.name)),
          childrenIgnored: (p: any) => p.isNamed(option.overlookFile),
        },
        stat: option.sort,
      })
    );
    mdname += "/**";
  }
  result = result.flat();
  result = [...new Set(result)];
  result = result.sort((a, b) => compareNumbers(a, b));
  return result;
}

export async function getImageFile(option: ImageDefaultOption, path: string) {
  let result = [];
  for (let i = 0; i < option.ext?.length; i++) {
    result.push(await glob(path + `/*${option.ext[i]}`));
    path += "/**";
  }
  result = result.flat();
  result = [...new Set(result)];
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
  if (!fileArray.length) return console.error("File not found");
  let text = "";
  fileArray.forEach((item) => {
    if (item.status === PromiseStatus.FULFILLED) {
      text += item.value + "\r\n";
    }
  });
  await fs.promises.writeFile(writename, text);

  console.log("write file success");
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
/**
 * 检查文件是否存在
 * @param path 文件路径
 * @returns
 */
export async function checkFileExists(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 文件存在和不存在的处理函数
 */
export async function handleFile(check: boolean, path: string) {
  if (!check) {
    await fs.promises.mkdir(path, { recursive: true });
  } else {
    await fs.promises.rm(path, { recursive: true, force: true });
    await fs.promises.mkdir(path, { recursive: true });
  }
}
