import "server-only";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: process.env.MINIO_REGION,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "",
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

export type UploadFileOutput = {
  key: string;
  publicUrl: string;
};

export async function uploadFile(key: string, buffer: Buffer, contentType?: string): Promise<UploadFileOutput> {
  try {
    let detectedContentType = contentType;
    if (!detectedContentType) {
      const { fileTypeFromBuffer } = await import("file-type");
      const fileType = await fileTypeFromBuffer(buffer);
      detectedContentType = fileType?.mime || "application/octet-stream";
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: detectedContentType,
    });

    await s3Client.send(command);

    return { key, publicUrl: `/${key}` };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to upload file");
  }
}

export async function getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFile(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete file");
  }
}
