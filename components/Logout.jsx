import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function Logout() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('User logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div>
            {user && (
                <button onClick={handleLogout}>Logout</button>
            )}
        </div>
    );
}
