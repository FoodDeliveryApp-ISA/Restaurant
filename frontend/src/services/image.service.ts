import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import S3 from "../config/s3";

class ImageService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicDomain: string;

  constructor(bucketName: string, publicDomain: string) {
    this.s3Client = S3;
    this.bucketName = bucketName;
    this.publicDomain = publicDomain;
  }

  /**
   * Uploads an image to the specified bucket.
   * @param key - The key (path) to store the image under.
   * @param file - The image file object (from browser).
   * @param mimeType - The MIME type of the image (e.g., "image/jpeg").
   */
  async uploadImage(
    key: string,
    file: File,
    mimeType: string
  ): Promise<string> {
    try {
      console.log("Uploading image...");

      // Ensure file is valid
      if (!(file instanceof File)) {
        throw new Error("The uploaded object is not a valid file.");
      }

      const fileBuffer = await file.arrayBuffer();
      console.log("File buffer:", fileBuffer);

      // Upload image to R2 using AWS SDK
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: new Blob([fileBuffer], { type: mimeType }),
          ContentType: mimeType,
          ACL: "public-read", // Ensure the image is public
        },
      });

      console.log("Starting upload...");
      const data = await upload.done(); // Wait until upload is done
      console.log("Upload complete:", data);

      // Return public URL where the file is accessible
      return `${this.publicDomain}/${this.bucketName}/${encodeURIComponent(
        key
      )}`;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  }

  /**
   * Fetches the public URL for an image.
   * Since objects are public, return the formatted public URL.
   * @param key - The key (path) of the image.
   */
  getPublicImageUrl(key: string): string {
    // Construct the correct public URL without bucket name and avoid double encoding
    return `${this.publicDomain}/${key}`;
  }

  /**
   * Deletes an image from the specified bucket.
   * @param key - The key (path) of the image to delete.
   */
  async deleteImage(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.s3Client.send(command); // Delete the image from the bucket
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new Error("Failed to delete image");
    }
  }
}

export default ImageService;
