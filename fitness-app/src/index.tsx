import React from 'react';
import { createRoot } from 'react-dom/client';
import './Assets/styles/tailwind.css'; // Ensure this path is correct
import AppRoutes from './routes';
import { AuthProvider } from './components/AuthContext';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    </React.StrictMode>
);
