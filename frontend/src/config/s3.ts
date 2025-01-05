import { S3Client } from "@aws-sdk/client-s3";

// Declare global S3 variable if running in a Node.js environment
declare global {
  var cachedS3: S3Client | undefined; // Use `undefined` for uninitialized variables
}

let S3: S3Client;

// Cloudflare R2 credentials and configurations directly in the code
const CLOUDFLARE_ACCESS_KEY_ID = "4178541a743542e3931d1f4a75a7c9fe";
const CLOUDFLARE_SECRET_ACCESS_KEY =
  "3fe48309f7ad455fce67a12be091ca5ed68ffee936f00af54306c07283502eaa";
const CLOUDFLARE_ACCOUNT_ID = "639a4fee87a11e8c5ea31efa08fecd42";
const CLOUDFLARE_BUCKET_NAME = "delivery";
const CLOUDFLARE_PUBLIC_DOMAIN =
  "https://pub-363dbd684ef24c85941b635a63222f54.r2.dev";

const isBrowser = typeof window !== "undefined";

if (process.env.NODE_ENV === "production" || isBrowser) {
  // Production mode or browser environment
  S3 = new S3Client({
    region: "auto",
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
    },
  });
} else {
  // Node.js development environment
  if (!global.cachedS3) {
    global.cachedS3 = new S3Client({
      region: "auto",
      endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
      },
    });
  }
  S3 = global.cachedS3;
}

export const S3Config = {
  bucketName: CLOUDFLARE_BUCKET_NAME,
  publicDomain: CLOUDFLARE_PUBLIC_DOMAIN,
};

export default S3;
