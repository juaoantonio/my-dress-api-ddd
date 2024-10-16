import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { AppointmentSearchParams } from "@core/appointment/domain/appointment.repository";

describe("AppointmentSearchParams", () => {
  describe("create", () => {
    it("should create a new instance with default values", () => {
      const searchParams = AppointmentSearchParams.create();

      expect(searchParams).toBeInstanceOf(AppointmentSearchParams);
      expect(searchParams.filter).toBeNull();
    });

    it("should create a new instance with provided values", () => {
      const searchParams = AppointmentSearchParams.create({
        filter: {
          customerName: "John Doe",
          appointmentDate: "2024-10-01",
          includeAll: true,
        },
      });

      expect(searchParams).toBeInstanceOf(AppointmentSearchParams);
      expect(searchParams.filter).toStrictEqual({
        customerName: "John Doe",
        appointmentDate: DateVo.create("2024-10-01"),
        includeAll: true,
      });
    });

    it("should correctly handle the filter with only customerName", () => {
      const searchParams = AppointmentSearchParams.create({
        filter: {
          customerName: "Jane Smith",
        },
      });

      expect(searchParams.filter).toStrictEqual({
        customerName: "Jane Smith",
      });
      expect(searchParams.filter?.appointmentDate).toBeUndefined();
      expect(searchParams.filter?.includeAll).toBeUndefined();
    });

    it("should correctly handle the filter with only appointmentDate", () => {
      const searchParams = AppointmentSearchParams.create({
        filter: {
          appointmentDate: "2024-11-01",
        },
      });

      expect(searchParams.filter?.appointmentDate).toBeInstanceOf(DateVo);
      expect(
        searchParams.filter?.appointmentDate?.getDateFormatted(),
      ).toStrictEqual("2024-11-01");
    });

    it("should correctly handle the filter with includeAll set to true", () => {
      const searchParams = AppointmentSearchParams.create({
        filter: {
          includeAll: true,
        },
      });

      expect(searchParams.filter).toStrictEqual({
        includeAll: true,
      });
    });
  });
});
