"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCatalogue = void 0;
const fs = require('node:fs');
const path = require('node:path');
const { glob } = require('glob');
// 书写传入的文件后缀的类型
var FileTypes;
(function (FileTypes) {
    FileTypes["MD"] = ".md";
    FileTypes["JS"] = ".js";
    FileTypes["TS"] = ".ts";
    FileTypes["JSON"] = ".json";
})(FileTypes || (FileTypes = {}));
var PromiseStatus;
(function (PromiseStatus) {
    PromiseStatus["PENDING"] = "pending";
    PromiseStatus["FULFILLED"] = "fulfilled";
    PromiseStatus["REJECTED"] = "rejected";
})(PromiseStatus || (PromiseStatus = {}));
let mdContent = [];
let isSort = false;
/**
 * 一个文件对象
 */
class FileDir {
    constructor(filename, name, ext, isFile, size, createTime, updateTime) {
        this.filename = filename;
        this.name = name;
        this.ext = ext;
        this.isFile = isFile;
        this.size = size;
        this.createTime = createTime;
        this.updateTime = updateTime;
        this.filename = filename;
        this.name = name;
        this.ext = ext;
        this.isFile = isFile;
        this.size = size;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }
    getContent() {
        return __awaiter(this, arguments, void 0, function* (isBuffer = false) {
            if (this.isFile) {
                if (isBuffer) {
                    return yield fs.promises.readFile(this.filename);
                }
                else {
                    return yield fs.promises.readFile(this.filename, 'utf-8');
                }
            }
            return null;
        });
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isFile) {
                //文件不可能有子文件
                return [];
            }
            let children = yield fs.promises.readdir(this.filename);
            children = children.map((name) => {
                const result = path.resolve(this.filename, name);
                return FileDir.getFile(result);
            });
            return Promise.all(children);
        });
    }
    static getFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const stat = yield fs.promises.stat(filename);
            const name = path.basename(filename);
            const ext = path.extname(filename);
            const isFile = stat.isFile();
            const size = stat.size;
            const createTime = new Date(stat.birthtime);
            const updateTime = new Date(stat.mtime);
            return new FileDir(filename, name, ext, isFile, size, createTime, updateTime);
        });
    }
}
/**
 * 得到一个目录的所有指定后缀文件
 * @param option
 * @param mdname
 */
function getFileAll(option, mdname) {
    return __awaiter(this, void 0, void 0, function* () {
        let md = [];
        let result = [];
        for (let i = 0; i < option.hierarchy; i++) {
            md = yield glob(`${mdname}${option.ext}`, { ignore: { ignored: (p) => (option.regexp ? option.regexp.test(p.name) : null), childrenIgnored: (p) => p.isNamed(option.overlookFile) }, stat: option.sort });
            mdname += '/**';
            result.push(...[...new Set(md)]);
        }
        result = [...new Set(result)];
        result = result.sort();
        return result;
    });
}
/**
 * 对文件进行排序
 * @param mdContent
 */
function sortFile(mdContent) {
    const result = [];
    const numberRes = [];
    let resultAll = [];
    mdContent.forEach((item) => {
        var _a;
        const number = (_a = item.match(/\d+/g)) === null || _a === void 0 ? void 0 : _a[0];
        if (number) {
            isSort = true;
            if (+number >= 10) {
                numberRes.push(item);
            }
            else {
                result.push(item);
            }
        }
        else {
            isSort = false;
            result.push(item);
        }
    });
    return (resultAll = isSort ? [...result, ...numberRes] : [...result]);
}
/**
 * 创建文件对象
 * @param mdContent
 * @param filename
 * @returns
 */
function createFile(mdContent, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = mdContent.map((item) => __awaiter(this, void 0, void 0, function* () {
            const filenameReadFileName = path.resolve(filename, path.relative(filename, item));
            return yield FileDir.getFile(filenameReadFileName);
        }));
        const resultFile = yield Promise.all(result);
        return resultFile;
    });
}
/**
 * 读取一个一个文件对象信息
 */
function readFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = file.map((file) => __awaiter(this, void 0, void 0, function* () {
            return yield file.getContent();
        }));
        const resultText = yield Promise.allSettled(result);
        return resultText;
    });
}
/**
 * 写入文件内容
 * @param fileArray
 */
function writeFileAll(fileArray, writename) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fileArray.length) {
            let text = '';
            fileArray.forEach((item) => {
                if (item.status === PromiseStatus.FULFILLED) {
                    text += item.value + '\r\n';
                }
            });
            yield fs.promises.writeFile(writename, text);
            console.log('write in  finish');
        }
        else {
            console.log('File not found');
        }
    });
}
// 获取当前目录下的所有文件和文件夹
function readCatalogue(findPosition_1, writingPosition_1) {
    return __awaiter(this, arguments, void 0, function* (findPosition, writingPosition, options = {}) {
        if (typeof findPosition !== 'string' || typeof writingPosition !== 'string') {
            console.log(new TypeError('type in not sting'));
            return;
        }
        const filename = findPosition;
        const to = writingPosition;
        let mdname = filename + '/**';
        const defaultOption = {
            regexp: options.exclude || null,
            ext: options.ext || FileTypes.JS,
            sort: options.sort || false,
            hierarchy: options.hierarchy || 5,
            overlookFile: options.overlookFile || 'node_modules'
        };
        mdContent = yield getFileAll(defaultOption, mdname);
        mdContent = sortFile(mdContent);
        const result = yield createFile(mdContent, filename);
        const readFileContent = yield readFile(result);
        yield writeFileAll(readFileContent, to);
    });
}
exports.readCatalogue = readCatalogue;
