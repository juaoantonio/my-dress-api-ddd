import { IImageStorageService } from "@core/@shared/application/image-storage-service.interface";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { CONFIG_SCHEMA_TYPE } from "@nest/config-module/config.module";
import { Injectable, Logger } from "@nestjs/common";
import { ImageUploadError } from "@core/@shared/infra/errors/image-upload.error";
import { ImageDeletionError } from "@core/@shared/infra/errors/image-deletion.error";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ImagePreSignedUrlError } from "@core/@shared/infra/errors/image-pre-signed-url.error";

@Injectable()
export class S3ImageStorage implements IImageStorageService {
  private readonly s3Client: S3Client;
  private readonly logger: Logger = new Logger(S3ImageStorage.name);

  constructor(
    private readonly configService: ConfigService<CONFIG_SCHEMA_TYPE>,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get("AWS_REGION"),
      credentials: {
        secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
        accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
      },
    });
  }

  async upload(
    fileName: string,
    file: Buffer,
    mimetype: string,
  ): Promise<string> {
    const imageKey = `images/${fileName}-${Date.now()}`;
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.get("AWS_S3_BUCKET_NAME"),
          Key: imageKey,
          Body: file,
          ContentType: mimetype,
        }),
      );
      return imageKey;
    } catch (error) {
      this.logger.error(error);
      throw new ImageUploadError();
    }
  }

  async delete(fileKey: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get("AWS_S3_BUCKET_NAME"),
          Key: fileKey,
        }),
      );
    } catch (error) {
      this.logger.error(error);
      throw new ImageDeletionError();
    }
  }

  async getPreSignedUrl(
    fileKey: string,
    expiresInSeconds: number,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.get("AWS_S3_BUCKET_NAME"),
      Key: fileKey,
    });
    try {
      return await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
    } catch (error) {
      this.logger.error(error);
      throw new ImagePreSignedUrlError();
    }
  }
}
