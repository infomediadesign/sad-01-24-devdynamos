import React from 'react';
import axios from 'axios';

const Logout: React.FC = () => {
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(
                'http://127.0.0.1:5000/logout',
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                localStorage.removeItem('token');
                alert('User logged out successfully');
                window.location.href = '/login';
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Logout failed', error);
                alert('Logout failed: ' + error.message);
            } else {
                console.error('Logout failed', error);
                alert('An unknown error occurred');
            }
        }
    };

    return (
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
        >
            Logout
        </button>
    );
};

export default Logout;
