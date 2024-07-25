// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- disable ESLint check for the next line
// @ts-nocheck -- this TS comment turns off TypeScript type checking for this file because we do not
// mock the entire Chrome API, but only the parts we need
global.chrome = {
  runtime: {
    onInstalled: {
      addListener: jest.fn(),
    },
    onMessage: {
      addListener: jest.fn(),
    },
    onStartup: {
      addListener: jest.fn(),
    },
    sendMessage: jest.fn(),
  },
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
}
