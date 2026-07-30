import { useState, useEffect } from "react";
import{getAllTickets,getAllInterventions,getAllUsers,updateInterventionStatus,affecterTechnicien,updateTicketStatus, getRapport}from "../services/api";
import Header from "../components/header";
import "../styles/DashboardPlanificateur.css";
function DashboardPlanificateur() {
    const[tickets,setTickets]=useState([]);
    const[interventions,setInterventions]=useState([]);
    const[users,setUsers]=useState([]);
    const[chargement,setChargement]=useState(false);
    const[erreur,setErreur]=useState("");
    const[success,setSuccess]=useState(false);
    const[selectedTechnicien,setSelectedTechnicien]=useState({});
    const[nouvStatut,setNouvStatut]=useState({});
    const[searchTerm,setSearchTerm]=useState("");
    const[prioriteFilter,setPrioriteFilter]=useState("toutes");
    useEffect(()=>{
        const fetchData=async()=>{
            setErreur("");
            try{
                const[ticketRes,interventionsRes,usersRes]=await Promise.all([
                    getAllTickets(),getAllInterventions(),getAllUsers()
                ]);
                setTickets(ticketRes.data.tickets);
                setInterventions(interventionsRes.data.interventions);
                setUsers(usersRes.data.users);
                console.log(interventionsRes.data.interventions);

            }catch (err) {
                setErreur(err.response?.data?.message || "Erreur lors du chargement des données");
            }
        };fetchData();
    },[]);
    const handleAffecter=async(ticket)=>{
        if(!selectedTechnicien[ticket.id]){
            setErreur("choisissez un techncien");
            return;
        }
        setChargement(true);
        setErreur("");
        try{
            await affecterTechnicien(ticket.id,{technicien_id:selectedTechnicien[ticket.id]});
            await updateTicketStatus(ticket.id,{statut:"affecte"});
            setSuccess(true);
            const[ticketRes,interventionsRes]=await Promise.all([getAllTickets(),getAllInterventions()]);
            setTickets(ticketRes.data.tickets);
            setInterventions(interventionsRes.data.interventions);
            setSelectedTechnicien(prev=>({...prev,[ticket.id]:""}));
            setTimeout(()=>setSuccess(false),3000);
        }catch(err){
            setErreur(err.response?.data?.message || "erreur lors de l'affectation");
        }finally{
            setChargement(false);
        }
    }
    const handUpdateStatus=async(intervention)=>{
        if(!nouvStatut[intervention.id]){
            setErreur("veuillez sélectionner un statut");
            return;
        }
        setChargement(true);
        setErreur("");
        try{
            await updateInterventionStatus(intervention.id,{statut:nouvStatut[intervention.id]});
            setSuccess(true);
            const response=await getAllInterventions();
            setInterventions(response.data.interventions);
            setNouvStatut(prev=>({...prev,[intervention.id]:""}));
            setTimeout(()=>setSuccess(false),3000);

        }catch(err){
            setErreur(err.response?.data?.message || "erreur lors de la modification du statut");
        }finally{
            setChargement(false);
        }
    }
    const filteredInterventions=interventions.filter(i=>{
        const matchSearch=(i.client_nom && i.client_nom.toLowerCase().includes(searchTerm.toLowerCase()))||
        (i.technicien_nom && i.technicien_nom.toLowerCase().includes(searchTerm.toLowerCase()))||
        (i.description && i.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchPriorite= prioriteFilter==="toutes"|| i.priorite===prioriteFilter;
        return matchSearch && matchPriorite;
    });

 return (
    <>
        <Header />
        <div className="dashboard-container">
            <h1>Dashboard Planificateur</h1>
            <p>Bienvenue sur votre espace planificateur.</p>
            <div className="stats-container">
                <div className="stat-card">
                    <h3>{tickets.filter(t=>t.statut==="en attente").length}</h3>
                    <p>Tickets en attente</p>
                </div>
                <div className="stat-card">
                    <h3>{tickets.filter(t=>t.statut==="en cours").length}</h3>
                    <p>Tickets en cours</p>
                </div>
                <div className="stat-card">
                    <h3>{tickets.filter(t=>t.statut==="affecte").length}</h3>
                    <p>Tickets affectées</p>
                </div>
                <div className="stat-card">
                    <h3>{tickets.filter(t=>t.statut==="termine").length}</h3>
                    <p>Tickets terminées</p>
                </div> 
                <div className="stat-card">
                    <h3>{users.filter(u=>u.role==="technicien").length}</h3>
                    <p>Techniciens</p>
                </div>

            </div>

            {erreur && <p className="error">{erreur}</p>}
            {success && <p className="success">Action effectuée avec succès.</p>}
            <div className="section">
                <h2>Tous les tickets</h2>
                {tickets.length === 0 ? (
                    <p>Aucun ticket.</p>
                ) : (
                    <ul>
                        {tickets.map((ticket) => (
                            <li key={ticket.id} className="card">

                                <h3>{ticket.description}</h3>
                                <p><strong>Adresse :</strong> {ticket.adresse}</p>
                                <p><strong>Priorité :</strong> {ticket.priorite}</p>
                                <p><strong>Statut :</strong><span className={`status ${ticket.statut}`}>{ticket.statut}</span> </p>
                                <select className="select-technicien" value={selectedTechnicien[ticket.id] || ""}
                                    onChange={(e) =>setSelectedTechnicien({...selectedTechnicien,[ticket.id]: e.target.value,})}>
                                    <option value=""> Choisir un technicien
                                    </option>{users.filter((user) => user.role === "technicien") .map((user) => (<option key={user.id} value={user.id}>{user.nom}</option>))}
                                </select>
                                <button className="btn btn-primary" onClick={() =>handleAffecter(ticket)} disabled={ticket.statut !=="en attente"}> Affecter</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="section">
                <div className="filters-container">
                    <input 
                        type="text" 
                        placeholder="🔍 Rechercher par client, technicien ou description..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-bar"
                    />
                    <select 
                        value={prioriteFilter} 
                        onChange={(e) => setPrioriteFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="toutes">Toutes les priorités</option>
                        <option value="urgent">🟠 Urgent</option>
                        <option value="standard">🟢 Standard</option>
                    </select>
                </div>
                <h2>Toutes les interventions</h2>
                {filteredInterventions.length === 0 ? (
                    <p>Aucune intervention ne correspond a votre recherche.</p>
                ) : (
                    <ul>
                        {filteredInterventions.map((intervention) => (
                            <li key={intervention.id}className="card">
                                <h3>{intervention.description}</h3>
                                <p><strong>Client :</strong>{" "}{intervention.client_nom}</p>
                                <p><strong>Technicien :</strong>{" "}{intervention.technicien_nom}</p>
                                <p><strong>Statut :</strong>{" "}<span className={`status ${intervention.statut}`}>{intervention.statut}</span></p>
                                {intervention.statut === "termine" && intervention.rapport && (
                                    <div className="rapport-display">
                                        <h4>Rapport du technicien</h4>
                                        <p>{intervention.rapport}</p>
                                    </div>
                                )}
                                {intervention.statut === "termine" && intervention.note && (
                                    <div className="evaluation-display">
                                        <h4>⭐ Évaluation du client</h4>
                                        <p><strong>Note :</strong> {intervention.note} ⭐</p>
                                        {intervention.commentaire && (
                                            <p><strong>Commentaire :</strong> {intervention.commentaire}</p>
                                        )}
                                    </div>
                                )}
                                <div className="statuts_update">
                                    <select className="select-statut" value={nouvStatut[intervention.id]||intervention.statut} onChange={(e)=>setNouvStatut({...nouvStatut,[intervention.id]:e.target.value})}>
                                        <option value="en attente">En attente</option>
                                        <option value="affecte">Affecté</option>
                                        <option value="en cours">En cours</option>
                                        <option value="termine">Terminé</option>
                                    </select>
                                    <button className="btn btn-warning" onClick={()=>handUpdateStatus(intervention)}>Modifier</button>
                                    </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </>
);
}

export default DashboardPlanificateur;