import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^react$": "<rootDir>/node_modules/react",
    "^react-dom$": "<rootDir>/node_modules/react-dom",
    "^react/jsx-runtime$": "<rootDir>/node_modules/react/jsx-runtime.js",
    "^react/jsx-dev-runtime$":
      "<rootDir>/node_modules/react/jsx-dev-runtime.js",
  },
  roots: ["<rootDir>"],
  moduleDirectories: ["node_modules", "<rootDir>/node_modules"],
};

export default createJestConfig(customJestConfig);
