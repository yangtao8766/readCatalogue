const fs = require('fs')
const path = require('path')
const { glob } = require('glob')
// import {FileTypes} from "../types"
// import type {TypeFileTypes} from "../types"

// 书写传入的文件后缀的类型
enum FileTypes {
  MD = '.md',
  JS = '.js',
  TS = '.ts',
  JSON = '.json'
}
enum PromiseStatus {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
}

type TypeFileTypes = {
  MD: '.md'
  JS: '.js'
  TS: '.ts'
  JSON: '.json'
}
type FileTypesExt = TypeFileTypes[keyof TypeFileTypes]

type Options = {
  exclude?: RegExp | null
  ext?: FileTypesExt
  sort?: boolean
  hierarchy?: number
  overlookFile?: string
}
type DefaultOption = {
  regexp: RegExp | null
  ext: FileTypesExt
  sort: boolean
  hierarchy: number
  overlookFile: string
}
interface FileFunction {
  getContent: (isBuffer: boolean) => Promise<string | Buffer>
  getChildren: () => Promise<File[]>
}

let mdContent: string[] = []
let isSort: boolean = false
/**
 * 一个文件对象
 */
class FileDir implements FileFunction {
  constructor(public filename: string, public name: string, public ext: string, public isFile: string, public size: number, public createTime: Date, public updateTime: Date) {
    this.filename = filename
    this.name = name
    this.ext = ext
    this.isFile = isFile
    this.size = size
    this.createTime = createTime
    this.updateTime = updateTime
  }

  async getContent(isBuffer = false) {
    if (this.isFile) {
      if (isBuffer) {
        return await fs.promises.readFile(this.filename)
      } else {
        return await fs.promises.readFile(this.filename, 'utf-8')
      }
    }
    return null
  }

  async getChildren() {
    if (this.isFile) {
      //文件不可能有子文件
      return []
    }
    let children = await fs.promises.readdir(this.filename)
    children = children.map((name: FileDir) => {
      const result = path.resolve(this.filename, name)
      return FileDir.getFile(result)
    })
    return Promise.all(children)
  }

  static async getFile(filename: string): Promise<FileDir> {
    const stat = await fs.promises.stat(filename)
    const name = path.basename(filename)
    const ext = path.extname(filename)
    const isFile = stat.isFile()
    const size = stat.size
    const createTime = new Date(stat.birthtime)
    const updateTime = new Date(stat.mtime)
    return new FileDir(filename, name, ext, isFile, size, createTime, updateTime)
  }
}
/**
 * 得到一个目录的所有指定后缀文件
 * @param option
 * @param mdname
 */
async function getFileAll(option: DefaultOption, mdname: string): Promise<string[]> {
  let md = []
  let result: string[] = []
  for (let i = 0; i < option.hierarchy; i++) {
    md = await glob(`${mdname}${option.ext}`, { ignore: { ignored: (p: any) => (option.regexp ? option.regexp.test(p.name) : null), childrenIgnored: (p: any) => p.isNamed(option.overlookFile) }, stat: option.sort })
    mdname += '/**'
    result.push(...([...new Set(md)] as string[]))
  }
  result = [...new Set(result)]
  result = result.sort()

  return result
}
/**
 * 对文件进行排序
 * @param mdContent
 */
function sortFile(mdContent: string[]) {
  const result: string[] = []
  const numberRes: string[] = []
  let resultAll: string[] = []
  mdContent.forEach((item: string) => {
    const number = item.match(/\d+/g)?.[0]

    if (number) {
      if (~~number >= 10) {
        isSort = true
        numberRes.push(item)
      } else {
        isSort = false
        result.push(item)
      }
    } else {
      numberRes.push(item)
    }
  })
  return (resultAll = isSort ? [...result, ...numberRes] : [...result])
}

/**
 * 创建文件对象
 * @param mdContent
 * @param filename
 * @returns
 */
async function createFile(mdContent: string[], filename: string) {
  const result = mdContent.map(async (item: string) => {
    const filenameReadFileName = path.resolve(filename, path.relative(filename, item))
    return await FileDir.getFile(filenameReadFileName)
  })
  const resultFile = await Promise.all(result)
  return resultFile
}
/**
 * 读取一个一个文件对象信息
 */
async function readFile(file: FileDir[]) {
  const result = file.map(async (file) => {
    return await file.getContent()
  })
  const resultText = await Promise.allSettled(result)

  return resultText
}
/**
 * 写入文件内容
 * @param fileArray
 */
async function writeFileAll(fileArray: PromiseSettledResult<any>[], writename: string) {
  if (fileArray.length) {
    let text = ''
    fileArray.forEach((item) => {
      if (item.status === PromiseStatus.FULFILLED) {
        text += item.value + '\r\n'
      }
    })
    await fs.promises.writeFile(writename, text)
    console.log('write in  finish')
  } else {
    console.log('File not found')
  }
}

// 获取当前目录下的所有文件和文件夹
export async function readCatalogue(findPosition: string, writingPosition: string, options: Options = {}) {
  if (typeof findPosition !== 'string' || typeof writingPosition !== 'string') {
    console.log(new TypeError('type in not sting'))
    return
  }
  const filename = findPosition
  const to = writingPosition
  let mdname = filename + '/**'

  const defaultOption: DefaultOption = {
    regexp: options.exclude || null,
    ext: options.ext || FileTypes.JS,
    sort: options.sort || false,
    hierarchy: options.hierarchy || 5,
    overlookFile: options.overlookFile || 'node_modules'
  }

  mdContent = await getFileAll(defaultOption, mdname)

  mdContent = sortFile(mdContent)

  const result = await createFile(mdContent, filename)

  const readFileContent = await readFile(result)

  await writeFileAll(readFileContent, to)
}
