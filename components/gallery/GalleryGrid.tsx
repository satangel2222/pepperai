'use client';

import { ImageCard } from './ImageCard';

interface Generation {
    id: string;
    type: string;
    prompt: string;
    image_url: string;
    cost: number;
    created_at: string;
}

interface GalleryGridProps {
    generations: Generation[];
    onDelete: (id: string) => void;
}

export function GalleryGrid({ generations, onDelete }: GalleryGridProps) {
    if (generations.length === 0) {
        return (
            <div className="text-center py-16">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <p className="mt-4 text-gray-500">No generations yet. Start creating!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((gen) => (
                <ImageCard key={gen.id} generation={gen} onDelete={onDelete} />
            ))}
        </div>
    );
}
