import { RollupOptions } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
// @ts-ignore
import clear from "rollup-plugin-clear";

const config: RollupOptions[] = [
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
        entryFileNames: "common/chunk-[name]-[hash].cjs",
        globals: {
          fs: "fs",
          path: "path",
          glob: "glob",
        },
      },
    ],
    plugins: [
      typescript({
        compilerOptions: {
          target: "ES2015",
          module: "ESNext",
          moduleResolution: "Bundler",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          baseUrl: "/",
          declaration: true,
          declarationDir: "./dist/common/",
        },
        exclude: ["node_modules/**", "rollup.config.ts"],
      }),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        include: "src/**",
        exclude: "node_modules/**",
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      replace({
        // 需要将字符串做一下替换，不然会报错：process is not defined
        preventAssignment: true,
        "process.env.OUT_DIR": JSON.stringify("dist"),
        "process.env.NODE_ENV": JSON.stringify("production"), // 添加这一行以确保 NODE_ENV 被定义
      }),
      clear({
        targets: ["dist"],
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      entryFileNames: "es/chunk-[name]-[hash].esm.js",
      format: "esm",
      sourcemap: true,
      globals: {
        fs: "fs",
        path: "path",
        glob: "glob",
      },
    },
    plugins: [
      typescript({
        compilerOptions: {
          target: "ES2015",
          module: "ESNext",
          moduleResolution: "Bundler",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          baseUrl: "/",
          declaration: true,
          declarationDir: "./dist/es/",
        },
        exclude: ["node_modules/**", "rollup.config.ts"],
      }),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        include: "src/**",
        exclude: "node_modules/**",
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      replace({
        // 需要将字符串做一下替换，不然会报错：process is not defined
        preventAssignment: true,
        "process.env.OUT_DIR": JSON.stringify("dist"),
        "process.env.NODE_ENV": JSON.stringify("production"), // 添加这一行以确保 NODE_ENV 被定义
      }),
      clear({
        targets: ["dist"],
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      entryFileNames: "umd/chunk-[name]-[hash].umd.js",
      format: "umd",
      name: "readCatalogue",
      sourcemap: true,
      globals: {
        fs: "fs",
        path: "path",
        glob: "glob",
      },
    },
    plugins: [
      typescript({
        compilerOptions: {
          target: "ES2015",
          module: "ESNext",
          moduleResolution: "Bundler",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          forceConsistentCasingInFileNames: true,
          strict: true,
          baseUrl: "/",
          declaration: true,
          declarationDir: "./dist/umd/",
        },
        exclude: ["node_modules/**", "rollup.config.ts"],
      }),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        include: "src/**",
        exclude: "node_modules/**",
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      replace({
        // 需要将字符串做一下替换，不然会报错：process is not defined
        preventAssignment: true,
        "process.env.OUT_DIR": JSON.stringify("dist"),
        "process.env.NODE_ENV": JSON.stringify("production"), // 添加这一行以确保 NODE_ENV 被定义
      }),
      clear({
        targets: ["dist"],
      }),
    ],
  },
];

export default config;
