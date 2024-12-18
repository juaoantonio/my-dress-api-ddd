import { expect } from "vitest";
import { NotificationImplementation } from "@core/@shared/domain/validators/notification-implementation";
import { FieldsErrors } from "@core/@shared/domain/validators/validator-fields.interface";

expect.extend({
  notificationContainsErrorMessages(
    expected: NotificationImplementation,
    received: FieldsErrors[],
  ) {
    const every = received.every((error) => {
      if (typeof error === "string") {
        return expected.errors.has(error);
      } else {
        return Object.entries(error).every(([field, messages]) => {
          const fieldMessages = expected.errors.get(field) as string[];
          return (
            fieldMessages &&
            fieldMessages.length &&
            fieldMessages.every((message) => messages.includes(message))
          );
        });
      }
    });
    return every
      ? { pass: true, message: () => "" }
      : {
          pass: false,
          message: () =>
            `The validation errors not contains ${JSON.stringify(
              received,
            )}. Current: ${JSON.stringify(expected.toJSON())}`,
        };
  },
});

expect.extend({
  toContainWithCondition(received: any[], condition: (item: any) => boolean) {
    const every = received.some(condition);
    return every
      ? { pass: true, message: () => "" }
      : {
          pass: false,
          message: () =>
            `expected ${JSON.stringify(received)} to contain an item that satisfies the condition`,
        };
  },
});
