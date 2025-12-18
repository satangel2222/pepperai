import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        // Get user from session cookie
        const cookieHeader = request.headers.get('cookie');
        if (!cookieHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Extract session from cookie
        const sessionMatch = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/);
        if (!sessionMatch) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sessionToken = decodeURIComponent(sessionMatch[1]);
        const sessionData = JSON.parse(sessionToken);

        const { data: { user }, error: authError } = await supabase.auth.getUser(sessionData.access_token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user's LoRA models
        const { data: models, error } = await supabase
            .from('lora_models')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({ models: models || [] });
    } catch (error: any) {
        console.error('Error fetching LoRA models:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch models' },
            { status: 500 }
        );
    }
}
