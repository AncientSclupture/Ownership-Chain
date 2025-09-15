import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"],
  globals: {
    "ts-jest": {
      tsconfig: {
        target: "ES2020",        // supaya BigInt (1n, 100n) jalan
        esModuleInterop: true,   // hilangin warning TS151001
      },
    },
  },
};
