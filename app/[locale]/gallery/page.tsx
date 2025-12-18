'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

interface Generation {
    id: string;
    type: string;
    prompt: string;
    image_url: string;
    cost: number;
    created_at: string;
}

export default function GalleryPage() {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const t = useTranslations('gallery');
    const tCommon = useTranslations('common');

    useEffect(() => {
        if (user) {
            fetchGenerations();
        }
    }, [user, filter]);

    const fetchGenerations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/gallery/list?type=${filter}`);
            const data = await response.json();
            setGenerations(data.generations || []);
        } catch (error) {
            console.error('Failed to fetch generations:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('confirmDelete'))) return;

        try {
            await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
            fetchGenerations();
        } catch (error) {
            console.error('Failed to delete generation:', error);
        }
    };

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Please sign in to view your gallery</h1>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

            <div className="flex gap-2 mb-6 flex-wrap">
                {['all', 'text2img', 'img2img', 'img2video'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === type
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {t(`filters.${type === 'text2img' ? 'textToImage' : type === 'img2img' ? 'imageToImage' : type === 'img2video' ? 'imageToVideo' : 'all'}`)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{tCommon('loading')}</p>
                </div>
            ) : (
                <GalleryGrid generations={generations} onDelete={handleDelete} />
            )}
        </div>
    );
}
