import { getFileUrl } from "@/src/lib/services/storage/minio-client.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Key parameter is required" }, { status: 400 });
  }

  try {
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    const signedUrl = await getFileUrl(cleanKey, 3600);
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Failed to generate signed URL:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get file URL" },
      { status: 500 }
    );
  }
}
