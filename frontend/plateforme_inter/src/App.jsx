import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/login';
import Register from './pages/register';
import DashboardClient from './pages/DashboardClient';
import DashboardTechnicien from './pages/DashboardTechnicien';
import DashboardPlanificateur from './pages/DashboardPlanificateur';
import 'leaflet/dist/leaflet.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const data = localStorage.getItem('user');
        return data ? JSON.parse(data) : null;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
            const data = localStorage.getItem('user');
            setUser(data ? JSON.parse(data) : null);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route 
                    path="/client" 
                    element={token && user?.role === 'client' ? <DashboardClient /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/technicien" 
                    element={token && user?.role === 'technicien' ? <DashboardTechnicien /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/planificateur" 
                    element={token && user?.role === 'planificateur' ? <DashboardPlanificateur /> : <Navigate to="/login" />} 
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;