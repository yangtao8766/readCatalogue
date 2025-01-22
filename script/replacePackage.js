const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

const replaceArray = ["main", "module", "browser", "exports"];
const mainReagex = /^.*[\\/]chunk-index-[a-zA-Z0-9\-\.]+(?:\.cjs)/;
const moduleReagex = /^.*[\\/]chunk-index-[a-zA-Z0-9\-\.]+(?:\.esm\.js)/;
const browserReagex = /^.*[\\/]chunk-index-[a-zA-Z0-9\-\.]+(?:\.umd\.js)/;
function exportsReplace(exports, files) {
  for (const key in exports) {
    switch (key) {
      case "import": {
        exports[key].default = "./" + findFile(files, moduleReagex);
        break;
      }
      case "require": {
        exports[key].default = "./" + findFile(files, mainReagex);
        break;
      }
      case "default": {
        exports[key].default = "./" + findFile(files, browserReagex);
        break;
      }
    }
  }
  return exports;
}

function findFile(files, reg) {
  return files
    .map((item) => {
      if (reg.test(item)) {
        return item;
      }
    })
    .filter((item) => item !== undefined)[0];
}

function stringReplace(str, sourece, files) {
  switch (str) {
    case "main": {
      sourece.main = sourece.main.replace(
        mainReagex,
        findFile(files, mainReagex)
      );
      break;
    }
    case "module": {
      sourece.module = sourece.module.replace(
        moduleReagex,
        findFile(files, moduleReagex)
      );
      break;
    }
    case "browser": {
      sourece.browser = sourece.browser.replace(
        browserReagex,
        findFile(files, browserReagex)
      );
      break;
    }
    case "exports": {
      sourece.exports["."] = exportsReplace(sourece.exports["."], files);
      break;
    }
  }
}

async function writePackage(path, sourece) {
  const soureceMap = JSON.stringify(sourece, null, 2);
  const newline = soureceMap.includes("\r\n") ? "\r\n" : "\n";
  await fs.promises.writeFile(
    path,
    soureceMap.replace(/\r?\n/g, newline),
    "utf-8"
  );
  console.log("package.json replace success");
}

async function replacePackage(files) {
  const packagePath = path.resolve(__dirname, "../package.json");
  const sourece = await fs.promises.readFile(packagePath, "utf-8");
  const soureceObj = JSON.parse(sourece);
  for (const item of replaceArray) {
    stringReplace(item, soureceObj, files);
  }
  writePackage(packagePath, soureceObj);
}

async function serachScript() {
  let files = await glob("dist/**/*.{js,cjs}");
  files = files.map((item) => item.replace(/\\/g, "/"));
  try {
    replacePackage(files);
  } catch (error) {
    console.log(error);
  }
}

serachScript();
