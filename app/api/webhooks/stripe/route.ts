import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const credits = parseInt(session.metadata?.credits || '0');
        const amount = (session.amount_total || 0) / 100;

        // Get user from session (you'll need to pass user_id in metadata during checkout creation)
        // For now, we'll use the customer email
        const customerEmail = session.customer_details?.email;

        if (customerEmail && credits > 0) {
            // Find user by email
            const { data: authUser } = await supabase.auth.admin.listUsers();
            const user = authUser?.users.find((u) => u.email === customerEmail);

            if (user) {
                // Get current credits
                const { data: profile } = await supabase
                    .from('users')
                    .select('credits')
                    .eq('id', user.id)
                    .single();

                const currentCredits = profile?.credits || 0;

                // Add credits
                await supabase
                    .from('users')
                    .update({ credits: currentCredits + credits })
                    .eq('id', user.id);

                // Record transaction
                await supabase.from('transactions').insert({
                    user_id: user.id,
                    amount,
                    credits,
                    stripe_payment_id: session.payment_intent as string,
                    status: 'completed',
                });
            }
        }
    }

    return NextResponse.json({ received: true });
}
