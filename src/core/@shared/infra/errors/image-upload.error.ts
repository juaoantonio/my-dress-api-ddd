export class ImageUploadError extends Error {
  constructor() {
    super("Falha ao fazer upload da imagem");
    this.name = "ImageUploadError";
  }
}
