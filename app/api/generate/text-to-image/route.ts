import { NextRequest, NextResponse } from 'next/server';
import { generateTextToImage } from '@/lib/fal';
import { createClient } from '@/lib/supabase-server';
import { CREDIT_COSTS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const { prompt, image_size, resolution, lora_url, lora_scale, num_images, seed, negative_prompt } = await req.json();

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

        // Calculate cost
        const cost = CREDIT_COSTS.text2img[resolution as keyof typeof CREDIT_COSTS.text2img] || 0.25;

        // Check credits
        if (user.credits < cost) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
        }

        // Generate image
        const result = await generateTextToImage({
            prompt,
            image_size,
            negative_prompt,
            num_images,
            seed,
            lora_url,
            lora_scale,
        });

        const imageUrl = (result as any).data.images[0].url;

        // Deduct credits
        await supabase
            .from('users')
            .update({ credits: user.credits - cost })
            .eq('id', user.id);

        // Save generation history
        await supabase.from('generations').insert({
            user_id: user.id,
            type: 'text2img',
            prompt,
            settings: { image_size, resolution, lora_url, lora_scale },
            result_url: imageUrl,
            cost,
            status: 'completed',
        });

        return NextResponse.json({ image_url: imageUrl });
    } catch (error: any) {
        console.error('Text-to-image generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Generation failed' },
            { status: 500 }
        );
    }
}
