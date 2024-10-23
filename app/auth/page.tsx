'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                router.push('/');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) setError(error.message);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <Card className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 p-8">
                    <CardTitle className="text-4xl font-extrabold text-center text-white">Payslip Generator</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleEmailSignIn} className="space-y-6">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Loading...' : 'Sign In with Email'}
                        </Button>
                    </form>
                    <Button onClick={handleGoogleSignIn} className="w-full" disabled={loading}>
                        {loading ? 'Loading...' : 'Sign In with Google'}
                    </Button>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                </CardContent>
            </Card>
        </div>
    );
}
