import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",

  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        isolatedModules: true,
      },
    ],
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testMatch: ["**/*.unit.spec.ts"],
};

export default config;

//NODE_OPTIONS=--experimental-vm-modules npx jest src/application/use-cases/conversas/iniciar/iniciar.conversa.unit.spec.ts

//NODE_OPTIONS=--experimental-vm-modules npx jest

//npm test