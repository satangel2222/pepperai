'use client';

import React from 'react';

interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
}

export function Slider({ label, value, onChange, min, max, step = 1 }: SliderProps) {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-sm font-semibold text-primary-600">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
}
