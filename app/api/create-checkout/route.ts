import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CREDIT_PACKAGES } from '@/lib/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

export async function POST(req: NextRequest) {
    try {
        const { packageId } = await req.json();

        const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
        if (!pkg) {
            return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${pkg.credits} PepperAI Credits`,
                            description: `Purchase ${pkg.credits} credits for PepperAI`,
                        },
                        unit_amount: Math.round(pkg.price * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
            metadata: {
                packageId: pkg.id,
                credits: pkg.credits.toString(),
            },
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
