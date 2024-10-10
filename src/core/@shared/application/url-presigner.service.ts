import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";

export class UrlPresignerService {
  constructor(private readonly imageStorageService: IImageStorageService) {}

  // Assina a URL para um objeto
  async signOne<T extends Record<string, any>>(
    obj: T,
    imageKeyProp: keyof T,
  ): Promise<T> {
    if (typeof obj[imageKeyProp] === "string") {
      const signedUrl = await this.imageStorageService.getPreSignedUrl(
        obj[imageKeyProp],
      );
      return Object.assign(obj, { [imageKeyProp]: signedUrl });
    }
    throw new Error(`${String(imageKeyProp)} is not a string`);
  }

  async signMany<T extends Record<keyof T, any>>(
    objs: T[],
    imageKeyProp: keyof T,
  ): Promise<T[]> {
    return Promise.all(objs.map((obj) => this.signOne(obj, imageKeyProp)));
  }
}
