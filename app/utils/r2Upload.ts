import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const R2 = {
  BUCKET_NAME: process.env.R2_BUCKET_NAME!,
  ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
  SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
  ACCOUNT_ID: process.env.R2_ACCOUNT_ID!, // Found in R2 dashboard
  ENDPOINT: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
};

export type MediaObject = {
  secure_url: string;
  url: string;
  height: number;
  width: number;
  asset_id: string;
  format: string;
  public_id: string;
  version_id: string;
  name: string;
  bytes: number;
};

export type ImageObject = MediaObject;


const r2Client = new S3Client({
    region: "auto",
    endpoint: R2.ENDPOINT,
    credentials: {
        accessKeyId: R2.ACCESS_KEY_ID,
        secretAccessKey: R2.SECRET_ACCESS_KEY,
    },
});

export const uploadToR2 = async (file: File, type = "image"): Promise<MediaObject> => {
  const buffer = await file.arrayBuffer();
  const filePath = `${type}s/${Date.now()}-${file.name}`; // Save under "images/" or "videos/"

  const uploadParams = {
      Bucket: R2.BUCKET_NAME,
      Key: filePath,
    Body: Buffer.from(buffer),
    ContentType: file.type,
};

try {
    await r2Client.send(new PutObjectCommand(uploadParams));

    return {
        secure_url: `https://${R2.BUCKET_NAME}.${R2.ACCOUNT_ID}.r2.dev/${filePath}`,
        url: `https://${R2.BUCKET_NAME}.${R2.ACCOUNT_ID}.r2.dev/${filePath}`,
        height: 0, // R2 does not provide metadata, you need external processing
        width: 0,
        asset_id: filePath,
        format: file.type.split("/")[1],
        public_id: filePath,
        version_id: "N/A", // R2 does not support versioning like Cloudinary
        name: file.name,
        bytes: file.size,
    };
} catch (error) {
    return Promise.reject(error);
}
};

export type VideoObject =  {
    secure_url: string;
    url: string;
    asset_id: string;
    format: string;
    public_id: string;
    version_id: string;
    name: string;
    bytes: number;
  };

export const uploadVideoToR2 = async (file: File): Promise<VideoObject> => {
    if (!file.type.startsWith("video/")) {
        throw new Error("Invalid file type. Please upload a video.");
    }
  
    const buffer = await file.arrayBuffer();
    const filePath = `videos/${Date.now()}-${file.name}`;
  
    const uploadParams = {
      Bucket: R2.BUCKET_NAME,
      Key: filePath,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    };
  
    try {
      await r2Client.send(new PutObjectCommand(uploadParams));
  
      return {
        secure_url: `https://${R2.BUCKET_NAME}.${R2.ACCOUNT_ID}.r2.dev/${filePath}`,
        url: `https://${R2.BUCKET_NAME}.${R2.ACCOUNT_ID}.r2.dev/${filePath}`,
        asset_id: filePath,
        format: file.type.split("/")[1],
        public_id: filePath,
        version_id: "N/A",
        name: file.name,
        bytes: file.size,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  };


  export type FileObject = {
    secure_url: string;
    url: string;
    asset_id: string;
    format: string;
    public_id: string;
    version_id: string;
    name: string;
    bytes: number;
  };

  export const uploadFileToR2 = async (file: File): Promise<FileObject> => {
    const buffer = await file.arrayBuffer();
    const filePath = `files/${Date.now()}-${file.name}`;
  
    const uploadParams = {
      Bucket: R2.BUCKET_NAME,
      Key: filePath,
      Body: Buffer.from(buffer),
      ContentType: file.type || "application/octet-stream",
    };
  
    try {
      await r2Client.send(new PutObjectCommand(uploadParams));
  
      return {
        secure_url: `https://${R2.BUCKET_NAME}.${R2.ACCOUNT_ID}.r2.dev/${filePath}`,
        url: `https://${R2.BUCKET_NAME}.${R2.ACCOUNT_ID}.r2.dev/${filePath}`,
        asset_id: filePath,
        format: file.name.split(".").pop() || "unknown",
        public_id: filePath,
        version_id: "N/A",
        name: file.name,
        bytes: file.size,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  };