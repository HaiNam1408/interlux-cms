'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import 'primeflex/primeflex.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="apple-mobile-web-app-title" content="Interlux" />
            </head>
            <body>
                <PrimeReactProvider>
                    <AuthProvider>
                        <LayoutProvider>
                            <ProtectedRoute>{children}</ProtectedRoute>
                        </LayoutProvider>
                    </AuthProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
