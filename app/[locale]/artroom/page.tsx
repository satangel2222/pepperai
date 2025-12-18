'use client';

import { useState } from 'react';
import { TextToImage } from '@/components/artroom/TextToImage';
import { ImageToImage } from '@/components/artroom/ImageToImage';
import { ImageToVideo } from '@/components/artroom/ImageToVideo';

export default function ArtRoomPage() {
    const [activeTab, setActiveTab] = useState<'text2img' | 'img2img' | 'img2video'>('text2img');

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1800px] mx-auto px-4 py-6">
                {/* Header */}
                <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-purple bg-clip-text text-transparent">
                    ArtRoom
                </h1>

                {/* Split Panel Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-200px)]">
                    {/* Left Panel: Controls */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[calc(100vh-150px)]">
                        {/* Tabs */}
                        <div className="mb-6">
                            <div className="bg-gray-100 rounded-lg p-1 inline-flex w-full">
                                <button
                                    onClick={() => setActiveTab('text2img')}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'text2img'
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    文生图
                                </button>
                                <button
                                    onClick={() => setActiveTab('img2img')}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'img2img'
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    图生图
                                </button>
                                <button
                                    onClick={() => setActiveTab('img2video')}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${activeTab === 'img2video'
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    图生视频
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {activeTab === 'text2img' && <TextToImage />}
                        {activeTab === 'img2img' && <ImageToImage />}
                        {activeTab === 'img2video' && <ImageToVideo />}

                        {/* Model Info Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                            Based on Z-Image Turbo (6B Params)
                        </div>
                    </div>

                    {/* Right Panel: Preview */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-lg font-medium">你的想象力在此等待</p>
                            <p className="text-sm mt-2">Your imagination is waiting here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
