'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export function TrainForm() {
    const { user, refreshCredits } = useAuth();
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [triggerWord, setTriggerWord] = useState('');
    const [steps, setSteps] = useState(3000);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImages((prev) => [...prev, ...acceptedFiles]);

        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'] },
        multiple: true,
    });

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleTrain = async () => {
        if (!user) {
            setError('Please sign in to train models');
            return;
        }

        if (images.length < 5) {
            setError('Please upload at least 5 images (20+ recommended)');
            return;
        }

        if (!triggerWord.trim()) {
            setError('Please enter a trigger word');
            return;
        }

        const cost = 8.0;
        if (user.credits < cost) {
            setError('Insufficient credits. Training costs 8 credits.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const formData = new FormData();
            images.forEach((image) => formData.append('images', image));
            formData.append('trigger_word', triggerWord);
            formData.append('steps', steps.toString());

            const response = await fetch('/api/lora/train', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Training failed');
            }

            setSuccess(true);
            setImages([]);
            setPreviews([]);
            setTriggerWord('');
            await refreshCredits();
        } catch (err: any) {
            setError(err.message || 'Failed to start training');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Training Images (Minimum 5, Recommended 20+)
                </label>
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-400'
                        }`}
                >
                    <input {...getInputProps()} />
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                        Drag and drop images, or click to select
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Supports JPG, PNG, WebP, GIF, AVIF
                    </p>
                </div>

                {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <Image
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    width={200}
                                    height={200}
                                    className="rounded-lg object-cover w-full h-32"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <p className="mt-2 text-sm text-gray-600">
                    {images.length} image(s) uploaded
                </p>
            </div>

            <Input
                label="Trigger Word"
                value={triggerWord}
                onChange={(e) => setTriggerWord(e.target.value)}
                placeholder="e.g., mycharacter, mystyle"
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Training Steps
                </label>
                <div className="flex gap-2 flex-wrap">
                    {[2000, 3000, 4000].map((s) => (
                        <button
                            key={s}
                            onClick={() => setSteps(s)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${steps === s
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {s} steps
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    Training started successfully! Check the Training History tab to monitor progress.
                </div>
            )}

            <Button
                onClick={handleTrain}
                loading={loading}
                disabled={!user || loading || images.length < 5}
                className="w-full"
                size="lg"
            >
                Start Training (8 credits)
            </Button>
        </div>
    );
}
