import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
    id: string;
    email: string;
    credits: number;
    created_at: string;
    updated_at: string;
}

export interface Generation {
    id: string;
    user_id: string;
    type: 'text2img' | 'img2img' | 'img2video';
    prompt: string;
    settings: any;
    result_url: string;
    cost: number;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
}

export interface LoRAModel {
    id: string;
    user_id: string;
    name: string;
    trigger_word: string;
    status: 'training' | 'completed' | 'failed';
    model_url: string | null;
    training_cost: number;
    created_at: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    credits: number;
    stripe_payment_id: string;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
}
