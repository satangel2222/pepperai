'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Generation {
    id: string;
    type: string;
    prompt: string;
    image_url: string;
    cost: number;
    created_at: string;
}

interface ImageCardProps {
    generation: Generation;
    onDelete: (id: string) => void;
}

export function ImageCard({ generation, onDelete }: ImageCardProps) {
    const [showActions, setShowActions] = useState(false);
    const t = useTranslations('gallery');

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = generation.image_url;
        link.download = `pepperai-${generation.id}.png`;
        link.click();
    };

    const getTypeLabel = (type: string) => {
        const typeMap: Record<string, string> = {
            'text2img': 'Text → Image',
            'img2img': 'Image → Image',
            'img2video': 'Image → Video',
        };
        return typeMap[type] || type;
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="relative aspect-square">
                <Image
                    src={generation.image_url}
                    alt={generation.prompt}
                    fill
                    className="object-cover"
                />
                {showActions && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                        >
                            {t('download')}
                        </button>
                        <button
                            onClick={() => onDelete(generation.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                        >
                            {t('delete')}
                        </button>
                    </div>
                )}
            </div>
            <div className="p-4">
                <p className="text-sm text-primary-600 font-medium mb-2">{getTypeLabel(generation.type)}</p>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{generation.prompt}</p>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{new Date(generation.created_at).toLocaleDateString()}</span>
                    <span>{generation.cost} credits</span>
                </div>
            </div>
        </div>
    );
}
