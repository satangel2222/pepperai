'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, LoRAModel } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export function TrainingHistory() {
    const { user } = useAuth();
    const t = useTranslations('loraTrainer');
    const tCommon = useTranslations('common');
    const [models, setModels] = useState<LoRAModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchModels();
        }
    }, [user]);

    const fetchModels = async () => {
        if (!user) return;

        setLoading(true);
        const { data, error } = await supabase
            .from('lora_models')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setModels(data);
        }
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'training':
                return 'bg-blue-100 text-blue-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">{tCommon('loading')}</p>
            </div>
        );
    }

    if (models.length === 0) {
        return (
            <div className="text-center py-12">
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
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noModels')}</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Start training your first LoRA model!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {models.map((model) => (
                <div
                    key={model.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Trigger word: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{model.trigger_word}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                Created: {new Date(model.created_at).toLocaleString()}
                            </p>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                model.status
                            )}`}
                        >
                            {t('status')}: {model.status}
                        </span>
                    </div>

                    {model.status === 'completed' && model.model_url && (
                        <div className="mt-4">
                            <Button
                                size="sm"
                                onClick={() => window.open(model.model_url!, '_blank')}
                            >
                                {t('download')}
                            </Button>
                        </div>
                    )}

                    {model.status === 'training' && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-primary-600 h-2 rounded-full animate-pulse w-2/3"></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">Training in progress...</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
