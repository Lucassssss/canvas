import "dotenv/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const S3_ENDPOINT = process.env.BITIFUL_ENDPOINT || "https://s3.bitiful.net";
const REGION = process.env.BITIFUL_REGION || "cn-east-1";

const s3Client = new S3Client({
  region: REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.BITIFUL_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.BITIFUL_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: false,
});

const BUCKET_NAME = process.env.BITIFUL_S3_BUCKET || "";
const CDN_URL = process.env.BITIFUL_CDN_URL || "";

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface UploadOptions {
  folder?: string;
  contentType?: string;
  maxSizeMB?: number;
}

class S3UploadService {
  private bucketName: string;
  private cdnUrl: string;

  constructor() {
    this.bucketName = BUCKET_NAME;
    this.cdnUrl = CDN_URL;
  }

  isConfigured(): boolean {
    return !!(
      this.bucketName &&
      process.env.BITIFUL_ACCESS_KEY_ID &&
      process.env.BITIFUL_SECRET_ACCESS_KEY
    );
  }

  async uploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    if (!this.isConfigured()) {
      return { success: false, error: "S3 is not configured" };
    }

    try {
      const { folder = "uploads", contentType = "image/png" } = options;

      const fileExtension = originalFilename.split(".").pop() || "png";
      const uniqueFilename = `${randomUUID()}.${fileExtension}`;
      const key = `${folder}/${uniqueFilename}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: contentType,
          ACL: "public-read",
        })
      );

      const url = this.cdnUrl
        ? `${this.cdnUrl}/${key}`
        : `${S3_ENDPOINT}/${this.bucketName}/${key}`;

      return { success: true, url, key };
    } catch (error) {
      console.error("[S3UploadService] Upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  async uploadFromUrl(imageUrl: string, folder: string = "ai-generated"): Promise<UploadResult> {
    if (!this.isConfigured()) {
      return { success: false, error: "S3 is not configured" };
    }

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return { success: false, error: "Failed to fetch image from URL" };
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get("content-type") || "image/png";

      const uniqueFilename = `${randomUUID()}.png`;
      const key = `${folder}/${uniqueFilename}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          ACL: "public-read",
        })
      );

      const url = this.cdnUrl
        ? `${this.cdnUrl}/${key}`
        : `${S3_ENDPOINT}/${this.bucketName}/${key}`;

      return { success: true, url, key };
    } catch (error) {
      console.error("[S3UploadService] Upload from URL error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  async deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: "S3 is not configured" };
    }

    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        })
      );
      return { success: true };
    } catch (error) {
      console.error("[S3UploadService] Delete error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Delete failed",
      };
    }
  }

  async getSignedUploadUrl(
    filename: string,
    contentType: string,
    folder: string = "uploads",
    expiresIn: number = 3600
  ): Promise<{ success: boolean; uploadUrl?: string; key?: string; url?: string; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: "S3 is not configured" };
    }

    try {
      const fileExtension = filename.split(".").pop() || "png";
      const uniqueFilename = `${randomUUID()}.${fileExtension}`;
      const key = `${folder}/${uniqueFilename}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        ACL: "public-read",
      });

      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

      const url = this.cdnUrl
        ? `${this.cdnUrl}/${key}`
        : `${S3_ENDPOINT}/${this.bucketName}/${key}`;

      return { success: true, uploadUrl, key, url };
    } catch (error) {
      console.error("[S3UploadService] Signed URL error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate signed URL",
      };
    }
  }
}

export const s3UploadService = new S3UploadService();