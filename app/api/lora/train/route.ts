import { NextRequest, NextResponse } from 'next/server';
import { trainLoRA } from '@/lib/fal';
import { createClient } from '@/lib/supabase-server';
import { CREDIT_COSTS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const images = formData.getAll('images') as File[];
        const trigger_word = formData.get('trigger_word') as string;
        const steps = parseInt(formData.get('steps') as string);

        // Get user from session
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user profile
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const cost = CREDIT_COSTS.lora_training;

        // Check credits
        if (user.credits < cost) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
        }

        // Convert images to base64 and create a zip-like data URL
        // In production, you'd upload to a storage service
        const imageDataUrls = await Promise.all(
            images.map(async (image) => {
                const buffer = await image.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                return `data:${image.type};base64,${base64}`;
            })
        );

        // For now, we'll use the first image as a placeholder
        // In production, you'd create a proper dataset URL
        const images_data_url = imageDataUrls[0];

        // Start training
        const result = await trainLoRA({
            images_data_url,
            trigger_word,
            steps,
        });

        // Deduct credits
        await supabase
            .from('users')
            .update({ credits: user.credits - cost })
            .eq('id', user.id);

        // Save training job
        await supabase.from('lora_models').insert({
            user_id: user.id,
            name: `LoRA Model - ${trigger_word}`,
            trigger_word,
            status: 'training',
            model_url: null,
            training_cost: cost,
        });

        return NextResponse.json({
            success: true,
            message: 'Training started successfully',
        });
    } catch (error: any) {
        console.error('LoRA training error:', error);
        return NextResponse.json(
            { error: error.message || 'Training failed' },
            { status: 500 }
        );
    }
}
