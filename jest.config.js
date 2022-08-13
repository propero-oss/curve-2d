/* eslint-disable @typescript-eslint/no-var-requires */
const tsconfig = require("./tsconfig.json");
const { pathsToModuleNameMapper } = require("ts-jest");

module.exports = {
  preset: "jest-preset-typescript",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!**/node_modules/**"],
  coverageReporters: ["lcovonly"],
  testRegex: ["/test/.*\\.test\\.ts$"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
