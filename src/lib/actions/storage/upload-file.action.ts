"use server";

import { uploadFile, UploadFileOutput } from "../../services/storage/minio-client.service";

export async function uploadFileAction(formData: FormData): Promise<UploadFileOutput> {
  try {
    const file = formData.get("file");
    const pathPrefix = formData.get("pathPrefix");

    if (!file || !(file instanceof File)) {
      throw new Error("File is required");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = pathPrefix ? `${pathPrefix}/${Date.now()}-${file.name}` : `${Date.now()}-${file.name}`;

    const uploadResult = await uploadFile(fileName, buffer, file.type);

    return uploadResult;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to upload file");
  }
}
