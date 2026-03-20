"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";

interface ImageCropperModalProps {
    imageSrc: string;
    onCropDone: (croppedBlob: Blob) => void;
    onCancel: () => void;
    aspectRatio?: number;
    cropShape?: "rect" | "round";
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((file) => {
            resolve(file);
        }, "image/jpeg", 0.95);
    });
}

export default function ImageCropperModal({ 
    imageSrc, 
    onCropDone, 
    onCancel, 
    aspectRatio = 1,
    cropShape = "round"
}: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedBlob) onCropDone(croppedBlob);
        } catch (e) {
            console.error("Cropping failed", e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] p-6 w-full max-w-lg shadow-2xl relative flex flex-col items-center">
                <button 
                    onClick={onCancel} 
                    className="absolute top-4 right-4 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-full transition-colors"
                    disabled={isProcessing}
                >
                    <X size={20} />
                </button>
                
                <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tighter self-start mb-6">Adjust Image</h3>
                
                <div className="relative w-full h-[400px] bg-zinc-100 rounded-3xl overflow-hidden mb-6">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        cropShape={cropShape}
                        showGrid={false}
                        style={{
                            containerStyle: { borderRadius: '1.5rem' }
                        }}
                    />
                </div>

                <div className="w-full flex items-center gap-4 mb-8">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Zoom</span>
                    <input 
                        type="range" 
                        value={zoom} 
                        min={1} 
                        max={3} 
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900" 
                    />
                </div>

                <div className="w-full flex gap-3">
                    <button 
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="flex-1 py-4 bg-zinc-100 text-zinc-600 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors flex justify-center items-center gap-2"
                    >
                        {isProcessing ? "Processing..." : <><Check size={16} /> Confirm Crop</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
