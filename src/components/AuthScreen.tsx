'use client';

import { supabase } from '@/lib/supabase';
import { Bookmark, Lock, Zap, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function AuthScreen() {
    const [loading, setLoading] = useState(false);

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                console.error('Error signing in:', error);
                alert(`Login failed: ${error.message}`);
                setLoading(false);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('An unexpected error occurred during login');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 text-center"
            >
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Bookmark className="w-8 h-8 text-white" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                    Smart Bookmark
                </h1>
                <p className="text-muted-foreground mb-8 text-lg">
                    Your private, real-time bookmark manager.
                </p>

                <button
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="w-full bg-white text-black font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                    {loading ? (
                        <span className="animate-pulse">Redirecting...</span>
                    ) : (
                        <>
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                            <span>Sign in with Google</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                        </>
                    )}
                </button>

                <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-white/5 rounded-lg text-primary">
                            <Lock className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-muted-foreground">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-white/5 rounded-lg text-primary">
                            <Zap className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-muted-foreground">Fast</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-white/5 rounded-lg text-primary">
                            <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-muted-foreground">Private</span>
                    </div>
                </div>
            </motion.div>

            <p className="mt-8 text-sm text-muted-foreground/50">
                © {new Date().getFullYear()} Smart Bookmark App. All rights reserved.
            </p>
        </div>
    );
}
