'use client';

import { useState } from 'react';

interface UseUploadOptions {
    /** The R2 folder/prefix to store files under, e.g. "avatars", "posts", "docs" */
    folder: string;
    /** The authentication token */
    token?: string | null;
}

interface UploadResult {
    publicUrl: string;
}

interface UseUploadReturn {
    upload: (file: File) => Promise<UploadResult>;
    uploading: boolean;
    progress: number;  // 0-100
    error: string | null;
    reset: () => void;
}

/**
 * Reusable hook for uploading files to Cloudflare R2 via presigned PUT URL.
 *
 * Usage:
 *   const { upload, uploading, error } = useUpload({ folder: 'avatars' });
 *   const { publicUrl } = await upload(selectedFile);
 */
export function useUpload({ folder, token }: UseUploadOptions): UseUploadReturn {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setUploading(false);
        setProgress(0);
        setError(null);
    };

    const upload = async (file: File): Promise<UploadResult> => {
        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            // 1. Get presigned URL from our API
            const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('rave_token') : null);
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
                },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                    folder,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to get upload URL');
            }

            const { uploadUrl, publicUrl } = await res.json();

            // 2. Upload file directly to R2 via presigned PUT (using XHR for progress tracking)
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        setProgress(Math.round((e.loaded / e.total) * 100));
                    }
                };
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                };
                xhr.onerror = () => reject(new Error('Network error during upload'));
                xhr.open('PUT', uploadUrl);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);
            });

            setProgress(100);
            return { publicUrl };
        } catch (err: any) {
            const message = err?.message || 'Upload failed';
            setError(message);
            throw new Error(message);
        } finally {
            setUploading(false);
        }
    };

    return { upload, uploading, progress, error, reset };
}
