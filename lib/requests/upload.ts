import { API_URL } from "@/lib/config";

interface UploadResponse {
  url: string;
  key: string;
}

export async function uploadToS3(
  file: File,
  type: "userimage" | "banner"
): Promise<UploadResponse> {
  try {
    // First get the presigned URL from our API
    const response = await fetch(`${API_URL}/upload?type=${type}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get upload URL");
    }

    const { url, key } = await response.json();

    // Upload the file directly to S3 using the presigned URL
    const uploadResponse = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    }

    return {
      url: `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${key}`,
      key,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
