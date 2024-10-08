export class ImagePreSignedUrlError extends Error {
  constructor() {
    super("Falha ao gerar URL pré-assinada da imagem");
    this.name = "ImagePreSignedUrlError";
  }
}
