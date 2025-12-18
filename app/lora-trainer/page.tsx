'use client';

import { useState } from 'react';
import { TrainForm } from '@/components/lora/TrainForm';
import { TrainingHistory } from '@/components/lora/TrainingHistory';

export default function LoRATrainerPage() {
    const [activeTab, setActiveTab] = useState<'train' | 'history'>('train');

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-purple bg-clip-text text-transparent">
                    LoRA Trainer
                </h1>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab('train')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'train'
                                    ? 'bg-gradient-purple text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Train New Model
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'history'
                                    ? 'bg-gradient-purple text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Training History
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {activeTab === 'train' && <TrainForm />}
                    {activeTab === 'history' && <TrainingHistory />}
                </div>
            </div>
        </div>
    );
}
