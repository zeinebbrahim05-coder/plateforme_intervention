import{useNavigate} from "react-router-dom";
function PlanificateurSidebar({page,setPage}) {
    const navigate= useNavigate();
    const handleLogout=()=>{
        if(window.confirm("etes vous sur de vouloir vous déconnecter ?")){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }

    }
    return (
        <aside className="plan-sidebar">
            <div className="plan-logo">
                <div className="plan-logo-icon">PI</div>
                <div>
                    <strong>Interventions</strong>
                    <span>Planificateur</span>
                </div>
            </div>
            <nav>
                <button className={page==="dashboard"?"active":""} onClick={()=>setPage("dashboard")}>📊 Tableau de bord</button>
                <button className={page==="planning"?"active":""} onClick={()=>setPage("planning")}>📅 Planning</button>
                <button className={page==="tickets"?"active":""} onClick={()=>setPage("tickets")}>🎫 Tickets</button>
                <button className={page==="interventions"?"active":""} onClick={()=>setPage("interventions")}>🔧 Interventions</button>
                <button className={page==="clients"?"active":""} onClick={()=>setPage("clients")}>👥 Clients</button>
                <button className={page==="techniciens"?"active":""} onClick={()=>setPage("techniciens")}>👨‍🔧 Techniciens</button>
                <button className={page==="carte"?"active":""} onClick={()=>setPage("carte")}>🗺️ Carte</button>
            </nav>
            <div className="plan-sidebar-bottom">
                <button className="logout-btn"onClick={handleLogout}>
                    Déconnexion</button>
            </div>
        </aside>
    );
}
export default PlanificateurSidebar;