'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CREDIT_PACKAGES } from '@/lib/stripe';
import { useAuth } from '@/contexts/AuthContext';
import { getStripe } from '@/lib/stripe';

export default function PricingPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);

    const handlePurchase = async (packageId: string) => {
        if (!user) {
            alert('Please sign in to purchase credits');
            return;
        }

        setLoading(packageId);

        try {
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId }),
            });

            const { sessionId } = await response.json();

            const stripe = await getStripe();
            if (stripe) {
                // @ts-ignore - redirectToCheckout exists on Stripe.js client
                const { error } = await stripe.redirectToCheckout({ sessionId });
                if (error) {
                    console.error('Stripe redirect error:', error);
                    alert('Failed to redirect to checkout');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to start checkout');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-purple bg-clip-text text-transparent">
                        Pricing
                    </h1>
                    <p className="text-xl text-gray-600">
                        Choose the perfect plan for your creative needs
                    </p>
                    <div className="mt-4 inline-block bg-green-100 text-green-800 px-6 py-2 rounded-full font-semibold">
                        🎉 25% cheaper than MirrorRim!
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {CREDIT_PACKAGES.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`bg-white rounded-2xl shadow-lg p-8 relative ${pkg.popular ? 'ring-2 ring-primary-500 transform scale-105' : ''
                                }`}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                                        POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="text-center">
                                <div className="text-4xl font-bold text-gray-900 mb-2">
                                    ${pkg.price}
                                </div>
                                <div className="text-2xl font-semibold text-primary-600 mb-4">
                                    {pkg.credits} Credits
                                </div>
                                <div className="text-sm text-gray-500 mb-6">
                                    ${(pkg.price / pkg.credits).toFixed(2)} per credit
                                </div>

                                <Button
                                    onClick={() => handlePurchase(pkg.id)}
                                    loading={loading === pkg.id}
                                    disabled={!user || loading !== null}
                                    className="w-full"
                                    variant={pkg.popular ? 'primary' : 'secondary'}
                                >
                                    {user ? 'Purchase' : 'Sign In to Purchase'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Credit Usage Guide */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Credit Usage Guide</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border-l-4 border-primary-500 pl-4">
                            <h3 className="font-semibold text-lg mb-2">Text to Image</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Standard: 0.25 credits</li>
                                <li>• 4K: 0.5 credits</li>
                                <li>• 8K: 1.5 credits</li>
                            </ul>
                        </div>

                        <div className="border-l-4 border-primary-500 pl-4">
                            <h3 className="font-semibold text-lg mb-2">Image to Image</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Per generation: 0.5 credits</li>
                            </ul>
                        </div>

                        <div className="border-l-4 border-primary-500 pl-4">
                            <h3 className="font-semibold text-lg mb-2">Image to Video</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• 480p (5s): 0.5 credits</li>
                                <li>• 480p (10s): 1.0 credits</li>
                                <li>• 720p (5s): 1.0 credits</li>
                                <li>• 720p (10s): 2.0 credits</li>
                                <li>• 1080p (5s): 2.0 credits</li>
                                <li>• 1080p (10s): 4.0 credits</li>
                            </ul>
                        </div>

                        <div className="border-l-4 border-primary-500 pl-4">
                            <h3 className="font-semibold text-lg mb-2">LoRA Training</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Per training session: 8.0 credits</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
