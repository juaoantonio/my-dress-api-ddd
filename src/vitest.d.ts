import "vitest";
import { FieldsErrors } from "@core/@shared/domain/validators/validator-fields.interface";

interface CustomMatchers<R = unknown> {
  notificationContainsErrorMessages: (expected: FieldsErrors[]) => R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
}

declare global {
  namespace Vitest {
    interface Expect {
      notificationContainsErrorMessages(expected: FieldsErrors[]): this;
    }
  }
}
