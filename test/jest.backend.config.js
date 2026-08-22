const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  rootDir: "../",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^.+\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$": "<rootDir>/test/__mocks__/fileMock.js",
  },
  testMatch: ["<rootDir>/test/m2-empirical-verification.test.js"],
};

module.exports = async () => {
  const nextConfig = await createJestConfig(customJestConfig)();
  return {
    ...nextConfig,
    transformIgnorePatterns: [
      "/node_modules/(?!(bson|mongodb|next-auth)/)",
    ],
  };
};
