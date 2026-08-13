import { useNavigate } from "react-router-dom";

function TechnicienSidebar({ page, setPage }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const menuItems = [
        { id: "dashboard", label: "Tableau de bord" },
        { id: "interventions", label: "Mes interventions" },
        { id: "disponibilite", label: "Disponibilité" }
    ];

    return (
        <aside className="plan-sidebar">
            <div className="plan-logo">
                <div className="plan-logo-icon">T</div>
                <div>
                    <strong>Interventions</strong>
                    <span>Technicien</span>
                </div>
            </div>
            <nav>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={page === item.id ? "active" : ""}
                        onClick={() => setPage(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="plan-sidebar-bottom">
                <button className="logout-btn" onClick={handleLogout}>
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}

export default TechnicienSidebar;