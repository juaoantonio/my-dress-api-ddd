import { Express } from "express";

export class ImageMockBuilder {
  private file: Express.Multer.File;

  constructor(props: Partial<Express.Multer.File> = {}) {
    this.file = {
      fieldname: props.fieldname ?? "image",
      originalname: props.originalname ?? "test",
      encoding: props.encoding ?? "7bit",
      mimetype: props.mimetype ?? "image/png",
      destination: props.destination ?? "test",
      filename: props.filename ?? "test",
      size: props.size ?? 100,
      stream: null,
      path: props.path ?? "test",
      buffer: props.buffer ?? Buffer.from("test"),
    };
  }

  public withFieldname(fieldname: string): this {
    this.file.fieldname = fieldname;
    return this;
  }

  public withOriginalname(originalname: string): this {
    this.file.originalname = originalname;
    return this;
  }

  public withEncoding(encoding: string): this {
    this.file.encoding = encoding;
    return this;
  }

  public withMimetype(mimetype: string): this {
    this.file.mimetype = mimetype;
    return this;
  }

  public withDestination(destination: string): this {
    this.file.destination = destination;
    return this;
  }

  public withFilename(filename: string): this {
    this.file.filename = filename;
    return this;
  }

  public withSize(size: number): this {
    this.file.size = size;
    return this;
  }

  public withStream(stream: any): this {
    this.file.stream = stream;
    return this;
  }

  public withPath(path: string): this {
    this.file.path = path;
    return this;
  }

  public withBuffer(buffer: Buffer): this {
    this.file.buffer = buffer;
    return this;
  }

  public build(): Express.Multer.File {
    return this.file;
  }
}
