'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { CreditDisplay } from '@/components/ui/CreditDisplay';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export function Navbar() {
    const { user, signIn, signUp, signOut } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                await signUp(email, password);
            } else {
                await signIn(email, password);
            }
            setShowAuthModal(false);
            setEmail('');
            setPassword('');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-lg bg-opacity-90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">P</span>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-purple bg-clip-text text-transparent">
                                    PepperAI
                                </span>
                            </Link>

                            <div className="hidden md:flex items-center gap-6">
                                <Link
                                    href="/"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/artroom"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    ArtRoom
                                </Link>
                                <Link
                                    href="/lora-trainer"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    LoRA Trainer
                                </Link>
                                <Link
                                    href="/pricing"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Pricing
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    <CreditDisplay />
                                    <Link href="/profile">
                                        <Button variant="ghost" size="sm">
                                            Profile
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="sm" onClick={signOut}>
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        setIsSignUp(false);
                                        setShowAuthModal(true);
                                    }}
                                >
                                    Sign In
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <Modal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                title={isSignUp ? 'Create Account' : 'Sign In'}
            >
                <form onSubmit={handleAuth} className="space-y-4">
                    <Input
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button type="submit" className="w-full" loading={loading}>
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <p className="text-sm text-center text-gray-600">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-primary-600 hover:underline"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </form>
            </Modal>
        </>
    );
}
