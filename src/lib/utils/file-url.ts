export function getFileUrl(fileKey: string): string {
  const cleanKey = fileKey.startsWith("/") ? fileKey.slice(1) : fileKey;

  return `/api/storage/file?key=${encodeURIComponent(cleanKey)}`;
}

export function getPublicUrl(key: string): string {
  const publicUrl = process.env.MINIO_PUBLIC_URL;
  const bucketName = process.env.MINIO_BUCKET_NAME;
  const cleanKey = key.startsWith("/") ? key.slice(1) : key;
  return `${publicUrl}/${bucketName}/${cleanKey}`;
}
