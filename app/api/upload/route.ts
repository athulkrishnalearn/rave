import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl, getPublicUrl } from '@/lib/r2';
import { getUserFromRequest } from '@/lib/auth';


// Allowed MIME types and their extensions
const ALLOWED_TYPES: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/webm': 'webm',
    'application/pdf': 'pdf',
    'image/heic': 'heic',
    'image/heif': 'heif',
};

export async function POST(req: NextRequest) {
    try {
        // Verify user is authenticated
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { filename, contentType, folder } = await req.json();

        if (!filename || !contentType || !folder) {
            return NextResponse.json(
                { error: 'filename, contentType, and folder are required' },
                { status: 400 },
            );
        }

        // Validate content type
        const ext = ALLOWED_TYPES[contentType];
        if (!ext) {
            return NextResponse.json(
                { error: `File type '${contentType}' is not allowed` },
                { status: 400 },
            );
        }

        // Build a unique, safe object key
        const uniqueId = crypto.randomUUID();
        const userId = user.id?.toString() || 'anon';
        const key = `${folder}/${userId}/${uniqueId}.${ext}`;

        // Generate presigned PUT URL (valid for 5 minutes)
        const uploadUrl = await generatePresignedUploadUrl(key, contentType, 300);
        const publicUrl = getPublicUrl(key);

        return NextResponse.json({ uploadUrl, publicUrl, key });
    } catch (error: any) {
        console.error('[/api/upload] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 },
        );
    }
}
