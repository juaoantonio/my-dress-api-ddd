import "vitest";
import { FieldsErrors } from "@domain/validators/validator-fields.interface";

interface CustomMatchers<R = unknown> {
  containsErrorMessages: (expected: FieldsErrors) => R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
}
