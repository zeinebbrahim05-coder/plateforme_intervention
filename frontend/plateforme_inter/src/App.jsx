import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import DashboardClient from './pages/DashboardClient';
import DashboardTechnicien from './pages/DashboardTechnicien';
import DashboardPlanificateur from './pages/DashboardPlanificateur';

function App() {
    // Récupérer le token et l'utilisateur depuis localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <BrowserRouter>
            <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Routes protégées */}
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