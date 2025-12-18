import { NextRequest, NextResponse } from 'next/server';
import { generateImageToImage } from '@/lib/fal';
import { createClient } from '@/lib/supabase-server';
import { CREDIT_COSTS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get('image') as File;
        const prompt = formData.get('prompt') as string;
        const negative_prompt = formData.get('negative_prompt') as string;
        const strength = parseFloat(formData.get('strength') as string);
        const steps = parseInt(formData.get('steps') as string);
        const guidance = parseFloat(formData.get('guidance') as string);

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

        const cost = CREDIT_COSTS.img2img;

        // Check credits
        if (user.credits < cost) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
        }

        // Convert image to base64
        const buffer = await image.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const imageUrl = `data:${image.type};base64,${base64}`;

        // Generate image
        const result = await generateImageToImage({
            image_url: imageUrl,
            prompt,
            negative_prompt,
            strength,
            num_inference_steps: steps,
            guidance_scale: guidance,
        });

        const resultUrl = (result as any).data.images[0].url;

        // Deduct credits
        await supabase
            .from('users')
            .update({ credits: user.credits - cost })
            .eq('id', user.id);

        // Save generation history
        await supabase.from('generations').insert({
            user_id: user.id,
            type: 'img2img',
            prompt,
            settings: { strength, steps, guidance, negative_prompt },
            result_url: resultUrl,
            cost,
            status: 'completed',
        });

        return NextResponse.json({ image_url: resultUrl });
    } catch (error: any) {
        console.error('Image-to-image generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Generation failed' },
            { status: 500 }
        );
    }
}
