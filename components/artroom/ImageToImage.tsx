'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export function ImageToImage() {
    const { user, refreshCredits } = useAuth();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [strength, setStrength] = useState(0.8);
    const [steps, setSteps] = useState(4);
    const [guidance, setGuidance] = useState(3.5);
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

    const handleGenerate = async () => {
        if (!user) {
            setError('Please sign in to generate images');
            return;
        }

        if (!imageFile || !prompt.trim()) {
            setError('Please upload an image and enter a prompt');
            return;
        }

        const cost = 0.5;
        if (user.credits < cost) {
            setError('Insufficient credits');
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
            formData.append('strength', strength.toString());
            formData.append('steps', steps.toString());
            formData.append('guidance', guidance.toString());
            if (seed) formData.append('seed', seed);

            const response = await fetch('/api/generate/image-to-image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Generation failed');
            }

            setResult(data.image_url);
            await refreshCredits();
        } catch (err: any) {
            setError(err.message || 'Failed to generate image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source Image
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
                                Drag and drop an image, or click to select
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Input
                label="Transformation Prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how to transform the image..."
            />

            <Input
                label="Negative Prompt (Optional)"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What to avoid..."
            />

            <Slider
                label={`Image Strength: ${strength.toFixed(1)} (Redraw Intensity)`}
                value={strength}
                onChange={setStrength}
                min={0.1}
                max={1}
                step={0.1}
            />

            {/* Advanced Settings */}
            <div>
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                    {showAdvanced ? '▼' : '▶'} Advanced Settings
                </button>

                {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                        <Slider
                            label={`Inference Steps: ${steps}`}
                            value={steps}
                            onChange={setSteps}
                            min={1}
                            max={10}
                            step={1}
                        />

                        <Slider
                            label={`Guidance Scale: ${guidance.toFixed(1)}`}
                            value={guidance}
                            onChange={setGuidance}
                            min={1}
                            max={10}
                            step={0.5}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Seed (for reproducible results)
                            </label>
                            <Input
                                type="number"
                                value={seed}
                                onChange={(e) => setSeed(e.target.value)}
                                placeholder="Random if empty"
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
                {loading ? 'Transforming...' : '🎨 Transform Image (0.5 credits)'}
            </Button>

            {result && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Result:</h3>
                    <div className="relative rounded-lg overflow-hidden">
                        <Image
                            src={result}
                            alt="Generated image"
                            width={1024}
                            height={1024}
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
