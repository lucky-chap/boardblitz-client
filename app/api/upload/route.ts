import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";

const S3_BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION as string;

export async function POST(request: NextRequest) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const s3 = new S3({
    params: { Bucket: S3_BUCKET_NAME },
    region: REGION,
  });

  const formData = await request.formData();
  const file = formData.get("file") as File;

  // Convert the file to a Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: file?.name as string,
    Body: buffer,
    ContentType: file?.type,
  };

  try {
    // Convert to Promise-based call for better error handling
    const uploadResult = await new Promise((resolve, reject) => {
      s3.upload(params, (err: any, data: any) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    return NextResponse.json({
      url: (uploadResult as AWS.S3.ManagedUpload.SendData).Location,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
