import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PutBucketCorsCommand, S3Client } from '@aws-sdk/client-s3';

async function setCors() {
    const r2Client = new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
    });

    try {
        const command = new PutBucketCorsCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ['*'],
                        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                        AllowedOrigins: ['*'],
                        ExposeHeaders: ['ETag'],
                        MaxAgeSeconds: 3000,
                    },
                ],
            },
        });

        await r2Client.send(command);
        console.log('✅ CORS configuration successfully applied to R2 bucket.');
    } catch (err) {
        console.error('❌ Error setting CORS configuration:', err);
    }
}

setCors();
