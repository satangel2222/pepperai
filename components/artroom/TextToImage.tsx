'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export function TextToImage() {
    const { user, refreshCredits } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [resolution, setResolution] = useState<'standard' | '4k' | '8k'>('standard');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState('');

    const aspectRatios = [
        { label: '1:1', value: '1024x1024' },
        { label: '4:3', value: '1024x768' },
        { label: '3:4', value: '768x1024' },
        { label: '16:9', value: '1024x576' },
        { label: '9:16', value: '576x1024' },
    ];

    const resolutionCosts = {
        standard: 0.25,
        '4k': 0.5,
        '8k': 1.5,
    };

    const handleGenerate = async () => {
        if (!user) {
            setError('Please sign in to generate images');
            return;
        }

        if (!prompt.trim()) {
            setError('Please enter a prompt');
            return;
        }

        const cost = resolutionCosts[resolution];
        if (user.credits < cost) {
            setError('Insufficient credits');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const selectedRatio = aspectRatios.find((r) => r.label === aspectRatio);
            const response = await fetch('/api/generate/text-to-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    image_size: selectedRatio?.value || '1024x1024',
                    resolution,
                }),
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
                    Prompt
                </label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to create..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={4}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aspect Ratio
                </label>
                <div className="flex gap-2 flex-wrap">
                    {aspectRatios.map((ratio) => (
                        <button
                            key={ratio.label}
                            onClick={() => setAspectRatio(ratio.label)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${aspectRatio === ratio.label
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {ratio.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution
                </label>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setResolution('standard')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${resolution === 'standard'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Standard (0.25 credits)
                    </button>
                    <button
                        onClick={() => setResolution('4k')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${resolution === '4k'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        4K (0.5 credits)
                    </button>
                    <button
                        onClick={() => setResolution('8k')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${resolution === '8k'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        8K (1.5 credits)
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <Button
                onClick={handleGenerate}
                loading={loading}
                disabled={!user || loading}
                className="w-full"
                size="lg"
            >
                Generate Image ({resolutionCosts[resolution]} credits)
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
