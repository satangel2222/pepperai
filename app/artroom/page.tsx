'use client';

import { useState } from 'react';
import { TextToImage } from '@/components/artroom/TextToImage';
import { ImageToImage } from '@/components/artroom/ImageToImage';
import { ImageToVideo } from '@/components/artroom/ImageToVideo';

export default function ArtRoomPage() {
    const [activeTab, setActiveTab] = useState<'text2img' | 'img2img' | 'img2video'>('text2img');

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-purple bg-clip-text text-transparent">
                    ArtRoom
                </h1>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab('text2img')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'text2img'
                                    ? 'bg-gradient-purple text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Text to Image
                        </button>
                        <button
                            onClick={() => setActiveTab('img2img')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'img2img'
                                    ? 'bg-gradient-purple text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Image to Image
                        </button>
                        <button
                            onClick={() => setActiveTab('img2video')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'img2video'
                                    ? 'bg-gradient-purple text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Image to Video
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {activeTab === 'text2img' && <TextToImage />}
                    {activeTab === 'img2img' && <ImageToImage />}
                    {activeTab === 'img2video' && <ImageToVideo />}
                </div>
            </div>
        </div>
    );
}
