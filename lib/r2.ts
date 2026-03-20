import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

/**
 * Generate a presigned PUT URL for uploading a file directly from the browser.
 * @param key       The object key in R2 (e.g. "avatars/user123/photo.jpg")
 * @param contentType MIME type of the file
 * @param expiresIn Seconds until the URL expires (default 300)
 */
export async function generatePresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn = 300,
): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });
    return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Get the permanent public URL for an object stored in R2.
 * @param key The object key in R2
 */
export function getPublicUrl(key: string): string {
    return `${R2_PUBLIC_URL}/${key}`;
}
