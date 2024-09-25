export class InvalidDressDescriptionError extends Error {
  constructor(message: string = "Descrição do vestido inválida") {
    super(message);
    this.name = "InvalidDressDescriptionError";
  }
}
