function StatsCards({tickets, users}){
    return(
        <div className="stats-container">
            <div className="stat-card">
                <h3>{tickets.filter(t=>t.statut==="en attente").length}</h3>
                <p>En attente</p>
            </div>
            <div className="stat-card">
                <h3>{tickets.filter(t => t.statut === "affecte").length}</h3>
                <p>Affectés</p>
            </div>
            <div className="stat-card">
                <h3>{tickets.filter(t => t.statut === "en cours").length}</h3>
                <p>En cours</p>
            </div>
            <div className="stat-card">
                <h3>{tickets.filter(t => t.statut === "termine").length}</h3>
                <p>Terminés</p>
            </div>
            <div className="stat-card">
                <h3>{users.filter(u => u.role === "technicien").length}</h3>
                <p>Techniciens</p>
            </div>
        </div>
    );
}
export default StatsCards;