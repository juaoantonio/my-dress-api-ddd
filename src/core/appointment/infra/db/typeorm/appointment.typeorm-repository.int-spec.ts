import { AppointmentTypeormRepository } from "@core/appointment/infra/db/typeorm/appointment.typeorm-repository";
import { setupTypeOrmForIntegrationTests } from "@core/@shared/infra/testing/helpers";
import { AppointmentModel } from "@core/appointment/infra/db/typeorm/appointment.model";
import {
  Appointment,
  AppointmentId,
  AppointmentType,
} from "@core/appointment/domain/appointment.aggregate";
import { DateVo } from "@core/@shared/domain/value-objects/date.vo";
import { AppointmentHistoryModel } from "@core/appointment/infra/db/typeorm/appointment-history.model";

describe("AppointmentTypeormRepository Integration Test", () => {
  let repository: AppointmentTypeormRepository;
  const setup = setupTypeOrmForIntegrationTests({
    entities: [AppointmentModel, AppointmentHistoryModel],
  });

  beforeEach(() => {
    const modelRepository = setup.dataSource.getRepository(AppointmentModel);
    repository = new AppointmentTypeormRepository(modelRepository);
  });

  describe("save", () => {
    it("should save a single appointment successfully", async () => {
      const appointment = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "John Doe",
      });

      await repository.save(appointment);

      const savedAppointment = await repository.findById(appointment.getId());
      expect(savedAppointment).toEqual(appointment);
    });

    it("should save a single appointment with history successfully", async () => {
      const appointment = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "John Doe",
      });
      appointment.reschedule(DateVo.create(new Date()));
      await repository.save(appointment);
      const savedAppointment = await repository.findById(appointment.getId());
      expect(savedAppointment).toEqual(appointment);
    });

    it("should save multiple appointments successfully", async () => {
      const appointment1 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer One",
      });
      const appointment2 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer Two",
      });
      await repository.saveMany([appointment1, appointment2]);
      const foundAppointment1 = await repository.findById(appointment1.getId());
      const foundAppointment2 = await repository.findById(appointment2.getId());
      expect(foundAppointment1).toEqual(appointment1);
      expect(foundAppointment2).toEqual(appointment2);
    });

    it("should save multiple appointments with history successfully", async () => {
      const appointment1 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer One",
      });
      appointment1.reschedule(DateVo.create(new Date()));
      const appointment2 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer Two",
      });
      appointment2.reschedule(DateVo.create(new Date()));
      await repository.saveMany([appointment1, appointment2]);
      const foundAppointment1 = await repository.findById(appointment1.getId());
      const foundAppointment2 = await repository.findById(appointment2.getId());
      expect(foundAppointment1).toEqual(appointment1);
      expect(foundAppointment2).toEqual(appointment2);
    });
  });

  describe("update", () => {
    it("should update an existing appointment successfully", async () => {
      const appointment = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Jane Doe",
      });
      await repository.save(appointment);
      appointment.changeCustomerName("Jane Smith");
      appointment.reschedule(DateVo.create(new Date()));
      await repository.update(appointment);
      const updatedAppointment = await repository.findById(appointment.getId());
      expect(updatedAppointment?.getCustomerName()).toBe("Jane Smith");
    });

    it("should throw EntityNotFoundError when trying to update a non-existent appointment", async () => {
      const nonExistentId = AppointmentId.random();

      const appointment = new Appointment({
        id: nonExistentId,
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Non-Existent Customer",
      });

      await expect(repository.update(appointment)).rejects.toThrow(
        `Appointment with id(s) ${nonExistentId} not found`,
      );
    });
  });

  describe("findById", () => {
    it("should find an appointment by id successfully", async () => {
      const appointment = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Alice Johnson",
      });

      await repository.save(appointment);

      const foundAppointment = await repository.findById(appointment.getId());
      expect(foundAppointment).toEqual(appointment);
    });

    it("should return null when appointment is not found by id", async () => {
      const nonExistentId = AppointmentId.random();
      const foundAppointment = await repository.findById(nonExistentId);
      expect(foundAppointment).toBeNull();
    });
  });

  describe("findMany", () => {
    it("should retrieve all appointments successfully", async () => {
      const appointment1 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer One",
      });

      const appointment2 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer Two",
      });

      await repository.saveMany([appointment1, appointment2]);

      const appointments = await repository.findMany();
      expect(appointments).toHaveLength(2);
      expect(appointments).toEqual(
        expect.arrayContaining([appointment1, appointment2]),
      );
    });

    it("should return an empty array when there are no appointments", async () => {
      const appointments = await repository.findMany();
      expect(appointments).toHaveLength(0);
    });
  });

  describe("findManyByIds", () => {
    it("should find multiple appointments by their ids successfully", async () => {
      const appointment1 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer A",
      });

      const appointment2 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer B",
      });

      await repository.saveMany([appointment1, appointment2]);

      const foundAppointments = await repository.findManyByIds([
        appointment1.getId(),
        appointment2.getId(),
      ]);

      expect(foundAppointments).toHaveLength(2);
      expect(foundAppointments).toEqual(
        expect.arrayContaining([appointment1, appointment2]),
      );
    });

    it("should return only existing appointments when some ids do not exist", async () => {
      const appointment1 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer X",
      });

      await repository.save(appointment1);

      const nonExistentId = AppointmentId.random();

      const foundAppointments = await repository.findManyByIds([
        appointment1.getId(),
        nonExistentId,
      ]);

      expect(foundAppointments).toHaveLength(1);
      expect(foundAppointments).toEqual(expect.arrayContaining([appointment1]));
    });

    it("should return an empty array when none of the ids exist", async () => {
      const nonExistentIds = [AppointmentId.random(), AppointmentId.random()];

      const foundAppointments = await repository.findManyByIds(nonExistentIds);
      expect(foundAppointments).toHaveLength(0);
    });
  });

  describe("delete", () => {
    it("should delete an existing appointment successfully", async () => {
      const appointment = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "To Be Deleted",
      });

      await repository.save(appointment);

      await repository.delete(appointment.getId());

      const deletedAppointment = await repository.findById(appointment.getId());
      expect(deletedAppointment).toBeNull();
    });

    it("should throw EntityNotFoundError when trying to delete a non-existent appointment", async () => {
      const nonExistentId = AppointmentId.create(
        "830e6080-95a3-40e3-9012-88036866dcd7",
      );

      await expect(repository.delete(nonExistentId)).rejects.toThrow(
        "Appointment with id(s) 830e6080-95a3-40e3-9012-88036866dcd7 not found",
      );
    });
  });

  describe("deleteManyByIds", () => {
    it("should delete multiple existing appointments successfully", async () => {
      const appointment1 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer 1",
      });

      const appointment2 = Appointment.create({
        type: AppointmentType.RETURN_FOR_ADJUSTMENT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer 2",
      });

      await repository.saveMany([appointment1, appointment2]);

      await repository.deleteManyByIds([
        appointment1.getId(),
        appointment2.getId(),
      ]);

      const deletedAppointment1 = await repository.findById(
        appointment1.getId(),
      );
      const deletedAppointment2 = await repository.findById(
        appointment2.getId(),
      );

      expect(deletedAppointment1).toBeNull();
      expect(deletedAppointment2).toBeNull();
    });

    it("should throw EntityNotFoundError when trying to delete some non-existent appointments", async () => {
      const appointment = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Existing Customer",
      });

      await repository.save(appointment);

      const nonExistentId = AppointmentId.create(
        "830e6080-95a3-40e3-9012-88036866dcd7",
      );

      await expect(
        repository.deleteManyByIds([appointment.getId(), nonExistentId]),
      ).rejects.toThrow(
        "Appointment with id(s) 830e6080-95a3-40e3-9012-88036866dcd7 not found",
      );
    });
  });

  describe("existsById", () => {
    it("should correctly identify existing and non-existing appointment ids", async () => {
      const appointment1 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer A",
      });

      const appointment2 = Appointment.create({
        type: AppointmentType.INITIAL_VISIT,
        appointmentDate: DateVo.create(new Date()),
        eventDate: DateVo.create(new Date()),
        customerName: "Customer B",
      });

      await repository.saveMany([appointment1, appointment2]);

      const nonExistentId = AppointmentId.random();

      const result = await repository.existsById([
        appointment1.getId(),
        nonExistentId,
      ]);

      expect(result.exists).toContainEqual(appointment1.getId());
      expect(result.notExists).toContainEqual(nonExistentId);
    });
  });
});
