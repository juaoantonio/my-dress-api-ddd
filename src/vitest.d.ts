import "vitest";

interface CustomMatchers<R = unknown> {
  notificationContainsErrorMessages: (
    expected: Array<string | { [key: string]: string[] }>,
  ) => R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
}
