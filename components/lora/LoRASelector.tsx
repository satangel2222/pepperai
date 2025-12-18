'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';

interface LoRAModel {
    id: string;
    trigger_word: string;
    status: string;
    created_at: string;
    model_url?: string;
}

interface LoRASelectorProps {
    onSelect: (model: LoRAModel | null, weight: number) => void;
}

export function LoRASelector({ onSelect }: LoRASelectorProps) {
    const [models, setModels] = useState<LoRAModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<LoRAModel | null>(null);
    const [weight, setWeight] = useState(0.8);
    const { user } = useAuth();
    const t = useTranslations('loraTrainer');

    useEffect(() => {
        if (user) {
            fetchModels();
        }
    }, [user]);

    const fetchModels = async () => {
        try {
            const response = await fetch('/api/lora/list');
            const data = await response.json();
            setModels(data.models.filter((m: LoRAModel) => m.status === 'completed'));
        } catch (error) {
            console.error('Failed to fetch LoRA models:', error);
        }
    };

    const handleModelChange = (model: LoRAModel | null) => {
        setSelectedModel(model);
        onSelect(model, weight);
    };

    const handleWeightChange = (newWeight: number) => {
        setWeight(newWeight);
        if (selectedModel) {
            onSelect(selectedModel, newWeight);
        }
    };

    if (!user || models.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                LoRA Model (Optional)
            </label>
            <select
                value={selectedModel?.id || ''}
                onChange={(e) => {
                    const model = models.find(m => m.id === e.target.value) || null;
                    handleModelChange(model);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
                <option value="">None</option>
                {models.map((model) => (
                    <option key={model.id} value={model.id}>
                        {model.trigger_word}
                    </option>
                ))}
            </select>

            {selectedModel && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        LoRA Weight: {weight.toFixed(2)}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={weight}
                        onChange={(e) => handleWeightChange(parseFloat(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Subtle</span>
                        <span>Strong</span>
                    </div>
                </div>
            )}
        </div>
    );
}
