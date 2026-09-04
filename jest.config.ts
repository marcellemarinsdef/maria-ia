import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",

  // Diz ao Jest para tratar arquivos .ts como ESM nativo
  extensionsToTreatAsEsm: [".ts"],

  transform: {
    // Substitui o ts-jest pelo @swc/jest
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: false,
          },
          // Mantém compatibilidade com decorators se você os utiliza (ex: TypeORM, NestJS)
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
        module: {
          // OBRIGATÓRIO PARA ESM: Garante que o SWC mantenha os imports como ESM
          type: "es6", 
        },
      },
    ],
  },

  // Mantém o mapeamento de extensões .js para arquivos .ts
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testMatch: ["**/*.spec.ts", "**/*.unit.spec.ts"],
};

export default config;
