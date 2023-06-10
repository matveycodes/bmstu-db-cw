module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["./src/**/*.ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  coverageDirectory: "<rootDir>/test/coverage",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
  preset: "ts-jest",
  runner: "groups",
};
