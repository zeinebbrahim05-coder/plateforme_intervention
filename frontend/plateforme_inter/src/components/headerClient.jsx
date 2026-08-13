import { useNavigate } from "react-router-dom";

function HeaderClient() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <header className="plan-header">
            <div>
                <h1>Espace Client</h1>
                <p>Suivez vos tickets et interventions</p>
            </div>
            <div className="plan-header-right">
                <div className="plan-profile">
                    <div className="plan-avatar">
                        {user?.nom?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div>
                        <strong>{user?.nom || 'Client'}</strong>
                        <span>Client</span>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    🚪 Déconnexion
                </button>
            </div>
        </header>
    );
}

export default HeaderClient;