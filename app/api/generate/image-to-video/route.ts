import { NextRequest, NextResponse } from 'next/server';
import { generateImageToVideo } from '@/lib/fal';
import { createClient } from '@/lib/supabase-server';
import { CREDIT_COSTS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get('image') as File;
        const prompt = formData.get('prompt') as string;
        const resolution = formData.get('resolution') as string;
        const duration = parseInt(formData.get('duration') as string);

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
        const costKey = `${resolution}_${duration}s` as keyof typeof CREDIT_COSTS.img2video;
        const cost = CREDIT_COSTS.img2video[costKey] || 1.0;

        // Check credits
        if (user.credits < cost) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
        }

        // Convert image to base64
        const buffer = await image.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const imageUrl = `data:${image.type};base64,${base64}`;

        // Generate video
        const result = await generateImageToVideo({
            image_url: imageUrl,
            prompt,
            duration,
            resolution,
        });

        const videoUrl = (result as any).data.video.url;

        // Deduct credits
        await supabase
            .from('users')
            .update({ credits: user.credits - cost })
            .eq('id', user.id);

        // Save generation history
        await supabase.from('generations').insert({
            user_id: user.id,
            type: 'img2video',
            prompt,
            settings: { resolution, duration },
            result_url: videoUrl,
            cost,
            status: 'completed',
        });

        return NextResponse.json({ video_url: videoUrl });
    } catch (error: any) {
        console.error('Image-to-video generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Generation failed' },
            { status: 500 }
        );
    }
}
