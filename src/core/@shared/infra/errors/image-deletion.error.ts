export class ImageDeletionError extends Error {
  constructor() {
    super("Falha ao deletar a imagem");
    this.name = "ImageDeletionError";
  }
}
