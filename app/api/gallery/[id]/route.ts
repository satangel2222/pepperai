import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Get user from session
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Delete generation (only if it belongs to the user)
        const { error } = await supabase
            .from('generations')
            .delete()
            .eq('id', params.id)
            .eq('user_id', user.id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting generation:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete generation' },
            { status: 500 }
        );
    }
}
