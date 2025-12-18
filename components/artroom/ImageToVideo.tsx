'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function ImageToVideo() {
    const { user, refreshCredits } = useAuth();
    const tCommon = useTranslations('artroom.common');
    const tVideo = useTranslations('artroom.imageToVideo');
    const tImg = useTranslations('artroom.imageToImage');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [resolution, setResolution] = useState('1080p');
    const [duration, setDuration] = useState('5');
    const [seed, setSeed] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxFiles: 1,
    });

    const getCost = () => {
        const costs: Record<string, Record<string, number>> = {
            '480p': { '5': 0.5, '10': 1.0 },
            '720p': { '5': 1.0, '10': 2.0 },
            '1080p': { '5': 2.0, '10': 4.0 },
        };
        return costs[resolution]?.[duration] || 1.0;
    };

    const handleGenerate = async () => {
        if (!user) {
            setError(tCommon('signInRequired'));
            return;
        }

        if (!imageFile || !prompt.trim()) {
            setError('Please upload an image and enter a motion description');
            return;
        }

        const cost = getCost();
        if (user.credits < cost) {
            setError(tCommon('insufficientCredits'));
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('prompt', prompt);
            formData.append('negative_prompt', negativePrompt);
            formData.append('resolution', resolution);
            formData.append('duration', duration);
            if (seed) formData.append('seed', seed);

            const response = await fetch('/api/generate/image-to-video', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Generation failed');
            }

            setResult(data.video_url);
            await refreshCredits();
        } catch (err: any) {
            setError(err.message || 'Failed to generate video');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tImg('sourceImage')}
                </label>
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-400'
                        }`}
                >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                        <div className="relative w-full max-w-md mx-auto">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                width={400}
                                height={400}
                                className="rounded-lg"
                            />
                        </div>
                    ) : (
                        <div>
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
                                {tImg('dragDrop')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Input
                label={tVideo('motionDescription')}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={tVideo('motionPlaceholder')}
            />

            <Input
                label={tCommon('negativePrompt')}
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder={tCommon('negativePromptPlaceholder')}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tVideo('resolution')}
                </label>
                <div className="flex gap-2 flex-wrap">
                    {['480p', '720p', '1080p'].map((res) => (
                        <button
                            key={res}
                            onClick={() => setResolution(res)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${resolution === res
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {res}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {tVideo('duration')}
                </label>
                <div className="flex gap-2 flex-wrap">
                    {['5', '10'].map((dur) => (
                        <button
                            key={dur}
                            onClick={() => setDuration(dur)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${duration === dur
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {dur}s
                        </button>
                    ))}
                </div>
            </div>

            {/* Advanced Settings */}
            <div>
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                    {showAdvanced ? '▼' : '▶'} {tCommon('advancedSettings')}
                </button>

                {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {tCommon('seed')}
                            </label>
                            <Input
                                type="number"
                                value={seed}
                                onChange={(e) => setSeed(e.target.value)}
                                placeholder={tCommon('seedPlaceholder')}
                            />
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <Button
                onClick={handleGenerate}
                loading={loading}
                disabled={!user || loading || !imageFile}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg"
                size="lg"
            >
                {loading ? tCommon('generatingVideo') : `🎬 ${tCommon('generate')} (${getCost()} credits)`}
            </Button>

            {result && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">{tCommon('result')}</h3>
                    <video
                        src={result}
                        controls
                        className="w-full rounded-lg"
                    />
                </div>
            )}
        </div>
    );
}
