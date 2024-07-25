import type { JestConfigWithTsJest } from "ts-jest"

const config: JestConfigWithTsJest = {
  collectCoverageFrom: ["src/**/*.ts"],
  setupFiles: ["./__mocks__/chrome.ts"],
  testEnvironment: "jsdom",
  transform: {
    "^.+.ts$": ["ts-jest", {}],
  },
}
export default config
