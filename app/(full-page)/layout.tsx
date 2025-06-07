import { Metadata } from 'next';
import React from 'react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'InterLux Admin',
    description: 'The ultimate collection of design-agnostic, flexible and accessible Admin Panel.'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}
