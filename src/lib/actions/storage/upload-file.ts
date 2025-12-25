"use server";

import { uploadFile } from "../../services/storage/minio-client";

export async function uploadFileAction(
  formData: FormData
): Promise<{ success: true; key: string; publicUrl: string } | { success: false; error: string }> {
  try {
    const file = formData.get("file");
    const pathPrefix = formData.get("pathPrefix");

    if (!file || !(file instanceof File)) {
      return { success: false, error: "File is required" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = pathPrefix ? `${pathPrefix}/${Date.now()}-${file.name}` : `${Date.now()}-${file.name}`;

    const uploadResult = await uploadFile(fileName, buffer, file.type);

    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }

    const publicUrl = `/${uploadResult.key}`;

    return { success: true, key: uploadResult.key, publicUrl };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
}
