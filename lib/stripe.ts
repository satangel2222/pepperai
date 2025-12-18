import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    }
    return stripePromise;
};

// Credit packages with 25% discount from MirrorRim
export const CREDIT_PACKAGES = [
    {
        id: 'package_28',
        credits: 28,
        price: 18.75,
        priceId: 'price_28_credits', // Will be replaced with actual Stripe price ID
        popular: false,
    },
    {
        id: 'package_60',
        credits: 60,
        price: 37.50,
        priceId: 'price_60_credits',
        popular: true,
    },
    {
        id: 'package_133',
        credits: 133,
        price: 75.00,
        priceId: 'price_133_credits',
        popular: false,
    },
    {
        id: 'package_429',
        credits: 429,
        price: 225.00,
        priceId: 'price_429_credits',
        popular: false,
    },
];

// Credit costs for different operations
export const CREDIT_COSTS = {
    text2img: {
        standard: 0.25,
        '4k': 0.5,
        '8k': 1.5,
    },
    img2img: 0.5,
    img2video: {
        '480p_5s': 0.5,
        '480p_10s': 1.0,
        '720p_5s': 1.0,
        '720p_10s': 2.0,
        '1080p_5s': 2.0,
        '1080p_10s': 4.0,
    },
    lora_training: 8.0,
};
