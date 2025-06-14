'use client';
import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useAuth } from '@/context/AuthContext';
import { Message } from 'primereact/message';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const { login, isLoading, error } = useAuth();

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            return;
        }
        await login(email, password);
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="interlux logo" className="mb-5 w-6rem flex-shrink-0" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome to Interlux Admin!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                    Email
                                </label>
                                <InputText id="email" type="email" placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} value={email} onChange={(e) => setEmail(e.target.value)} required />

                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                    Password
                                </label>
                                <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" feedback={false} required />

                                <div className="flex align-items-center justify-content-between gap-5">
                                    {error && (
                                        <div className="mb-4">
                                            <Message severity="error" text={'Incorrect account or password.'} />
                                        </div>
                                    )}
                                </div>
                                <Button type="submit" label="Sign In" className="w-full p-3 text-xl" loading={isLoading} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
