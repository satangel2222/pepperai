import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        // Get user from session
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Build query
        let query = supabase
            .from('generations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (type && type !== 'all') {
            query = query.eq('type', type);
        }

        const { data: generations, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({ generations: generations || [] });
    } catch (error: any) {
        console.error('Error fetching generations:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch generations' },
            { status: 500 }
        );
    }
}
