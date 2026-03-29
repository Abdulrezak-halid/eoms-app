import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { UtilDate } from "common";
import { Readable } from "node:stream";

import { IFileContent, IStorageAdaptor } from "../interfaces/IStorageAdaptor";

export class StorageAdaptorS3 implements IStorageAdaptor {
  public readonly name = "s3";

  private s3Client: S3Client;
  constructor(
    private config: {
      endPoint: string;
      region: string;
      bucket: string;
      accessKeyId: string;
      secretAccessKey: string;
    },
  ) {
    this.s3Client = new S3Client({
      endpoint: this.config.endPoint,
      region: this.config.region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  // We are creating bucket
  async init() {
    try {
      // Bucket is exists, do nothing
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.config.bucket }),
      );
    } catch {
      // Bucket does not exist, create it
      await this.s3Client.send(
        new CreateBucketCommand({ Bucket: this.config.bucket }),
      );
    }
  }

  shutdown() {
    this.s3Client.destroy();
  }

  // Send file
  async put(path: string, content: Buffer | string, contentType?: string) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: path,
        Body: content,
        ContentType: contentType,
      }),
    );
  }

  // Get file and return as a buffer
  async get(path: string): Promise<IFileContent | null> {
    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({ Bucket: this.config.bucket, Key: path }),
      );

      if (!response.Body || !(response.Body instanceof Readable)) {
        return null;
      }

      const stream = response.Body as Readable;
      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const buffer = Buffer.concat(chunks);
      const etag = response.ETag?.replace(/"/g, "");
      const contentType = response.ContentType;
      const lastModified = response.LastModified
        ? UtilDate.objToIsoDatetime(response.LastModified)
        : undefined;

      return { buffer, etag, contentType, lastModified };
    } catch (e) {
      if (e instanceof Error && e.name === "NoSuchKey") {
        return null;
      }

      throw e;
    }
  }
  // Remove file from path
  async remove(path: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({ Key: path, Bucket: this.config.bucket }),
    );
  }

  // Remove path and all files like /file/*
  async removeDir(path: string) {
    const objectList = await this.s3Client.send(
      new ListObjectsV2Command({
        Bucket: this.config.bucket,
        Prefix: path,
      }),
    );

    const objects = objectList.Contents || [];

    const deleteParams = {
      Bucket: this.config.bucket,
      Delete: {
        Objects: objects.map((obj) => ({ Key: obj.Key! })),
        Quiet: true,
      },
    };

    await this.s3Client.send(new DeleteObjectsCommand(deleteParams));
  }

  // In s3 remove method is already not throwing error if file not found
  async removeIfExists(path: string) {
    await this.remove(path);
  }

  async resetStorage() {
    // Delete the bucket itself
    await this.s3Client.send(
      new DeleteBucketCommand({ Bucket: this.config.bucket }),
    );

    // Re-create the bucket
    await this.s3Client.send(
      new CreateBucketCommand({ Bucket: this.config.bucket }),
    );
  }

  async list(path: string) {
    const base = path.endsWith("/") ? path : path + "/";
    const objectList = await this.s3Client.send(
      new ListObjectsV2Command({
        Bucket: this.config.bucket,
        Prefix: base,
      }),
    );

    const objects = objectList.Contents || [];

    return objects
      .filter((obj) => obj.Key)
      .map((obj) => ({
        name: obj.Key!.slice(base.length),
        lastModified: obj.LastModified
          ? UtilDate.objToIsoDatetime(obj.LastModified)
          : undefined,
      }))
      .filter((item) => Boolean(item.name));
  }

  async exist(path: string) {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.config.bucket,
          Key: path,
        }),
      );
      return true;
    } catch (e) {
      void e;
      return false;
    }
  }

  // private async deleteAllObjects() {
  //   // List all objects inside the bucket
  //   const { Contents = [] } = await this.s3Client.send(
  //     new ListObjectsV2Command({ Bucket: this.config.bucket }),
  //   );

  //   // If there are any objects, delete them
  //   if (Contents.length > 0) {
  //     await this.s3Client.send(
  //       new DeleteObjectsCommand({
  //         Bucket: this.config.bucket,
  //         Delete: {
  //           Objects: Contents.map(({ Key }) => ({ Key: Key! })),
  //           Quiet: true,
  //         },
  //       }),
  //     );
  //   }
  // }
}
