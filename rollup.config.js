import sourcemaps from "rollup-plugin-sourcemaps";
import commonjs from "@rollup/plugin-commonjs";
import ts from "rollup-plugin-ts";
import paths from "rollup-plugin-ts-paths";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import { keys, mapValues, upperFirst, camelCase, template } from "lodash";
import pkg from "./package.json";

const { main, dependencies, module, since = new Date().getFullYear() } = pkg;
const formatModule = (name) =>
  upperFirst(camelCase(name.indexOf("@") !== -1 ? name.split("/")[1] : name));
const year =
  new Date().getFullYear() === +since
    ? since
    : `${since} - ${new Date().getFullYear()}`;
const external = keys(dependencies || {});
const globals = mapValues(dependencies || {}, (value, key) =>
  formatModule(key)
);
const name = formatModule(pkg.name);
/* eslint-disable */
const banner = template(`
/**
 * <%= p.nameFormatted %> (<%= p.name %>)
 * <%= p.description %>
 * <%= p.homepage %>
 * (c) <%= p.year %> <%= p.author %>
 * @license <%= p.license || "MIT" %>
 */
/* eslint-disable */`, { variable: "p" })({ ...pkg, nameFormatted: name, year }).trim();
/* eslint-enable */

const live = process.env.ROLLUP_WATCH !== undefined;

const cjs = { format: "cjs", file: main };
const esm = { format: "esm", file: module };
const dev = { format: "cjs", file: "public/main.js" };

const outputs = live ? [dev] : [cjs, esm];

const comments = (_, { value }) => /@preserve|@license|@cc_on/i.test(value);

const plugins = [
  sourcemaps(),
  paths(),
  commonjs(),
  nodeResolve(),
  json({ compact: true }),
  ts({ tsconfig: live ? "tsconfig.build.json" : "tsconfig.json" }),
];
if (!live) plugins.push(terser({ output: { comments } }));

export default {
  input: live ? "example/index.ts" : "src/index.ts",
  output: outputs.map(({ format, file }) => ({
    exports: "named",
    sourcemap: true,
    file,
    format,
    globals,
    name,
    banner,
  })),
  external,
  watch: {
    include: ["src/**/*", "example/**/*"],
  },
  plugins,
};
