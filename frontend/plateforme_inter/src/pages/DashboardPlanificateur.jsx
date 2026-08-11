import { useState, useEffect } from "react";
import { getAllTickets, getAllInterventions, getAllUsers, updateUser, createIntervention,updateTicketStatus,autoAffecter,updateInterventionStatus, deleteUser, createUser } from "../services/api";
import Header from "../components/header";
import Map from "../components/map";
import StatsCards from "../components/statsCards";
import UserTable from "../components/userTable";
import UserModal from "../components/userModal";
import CreateUserModal from "../components/createUserModal";
import "../styles/DashboardPlanificateur.css";

function DashboardPlanificateur() {
    const [tickets, setTickets] = useState([]);
    const [interventions, setInterventions] = useState([]);
    const [users, setUsers] = useState([]);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");
    const [success, setSuccess] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTechnicien, setSelectedTechnicien] = useState({});
    const [nouvStatut, setNouvStatut] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [prioriteFilter, setPrioriteFilter] = useState("toutes");
    const [showCreateModal, setShowCreateModal]= useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setErreur("");
            try {
                const [ticketRes, interventionsRes, usersRes] = await Promise.all([
                    getAllTickets(),
                    getAllInterventions(),
                    getAllUsers()
                ]);
                setTickets(ticketRes.data.tickets);
                setInterventions(interventionsRes.data.interventions);
                setUsers(usersRes.data.users);
            } catch (err) {
                setErreur(err.response?.data?.message || "Erreur lors du chargement des données");
            }
        };
        fetchData();
    }, []);

    const handleAffecter = async (ticket) => {
        if (!selectedTechnicien[ticket.id]) {
            setErreur("Choisissez un technicien");
            return;
        }
        setChargement(true);
        setErreur("");
        try {
            await createIntervention({ticket_id: ticket.id,technicien_id: selectedTechnicien[ticket.id],
                description: ticket.description,adresse: ticket.adresse,priorite: ticket.priorite
            });
            await updateTicketStatus(ticket.id, { statut: "affecte" });
            setSuccess(true);
            const [ticketRes, interventionsRes] = await Promise.all([getAllTickets(),getAllInterventions()]);
            setTickets(ticketRes.data.tickets);
            setInterventions(interventionsRes.data.interventions);
            setSelectedTechnicien(prev => ({ ...prev, [ticket.id]: "" }));
            setTimeout(() => setSuccess(false), 3000);
        }catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de l'affectation");
        }finally {
            setChargement(false);
        }
    };
    const handUpdateStatus = async (intervention) => {
        if (!nouvStatut[intervention.id]) {
            setErreur("Veuillez sélectionner un statut");
            return;
        }
        setChargement(true);
        setErreur("");
        try {
            await updateInterventionStatus(intervention.id, { statut: nouvStatut[intervention.id] });
            setSuccess(true);
    const [interventionsRes, ticketsRes] = await Promise.all([getAllInterventions(),getAllTickets()]);
            setInterventions(interventionsRes.data.interventions);
            setTickets(ticketsRes.data.tickets);
            setNouvStatut(prev => ({ ...prev, [intervention.id]: "" }));
            setTimeout(() => setSuccess(false), 3000);
        }catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de la modification du statut");
        }finally {
            setChargement(false);
        }
    };

    const filteredInterventions = interventions.filter(i => {
        const matchSearch = (i.client_nom && i.client_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (i.technicien_nom && i.technicien_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (i.description && i.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchPriorite = prioriteFilter === "toutes" || i.priorite === prioriteFilter;
        return matchSearch && matchPriorite;
    });

    const handleAutoAffecter = async (ticket) => {
        setChargement(true);
        setErreur("");
        try {
            await autoAffecter(ticket.id);
            setSuccess(true);
            const [ticketRes, interventionsRes] = await Promise.all([
                getAllTickets(),
                getAllInterventions()
            ]);
            setTickets(ticketRes.data.tickets);
            setInterventions(interventionsRes.data.interventions);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de l'affectation automatique");
        } finally {
            setChargement(false);
        }
    };

    const handleUpdateUser = async (id, userData) => {
        setChargement(true);
        try {
            await updateUser(id, userData);
            const response = await getAllUsers();
            setUsers(response.data.users);
            setSuccess(true);
            setShowModal(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setErreur("Erreur lors de la modification");
        } finally {
            setChargement(false);
        }
    };

    const handleEditUser = (user) => {
        setEditUser(user);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditUser(null);
    };
    const handleDeleteUser=async(user)=>{
        if(!window.confirm(`Supprimer ${user.nom}?`)) return;
        setChargement(true);
        try{
            await deleteUser(user.id);
            const response= await getAllUsers();
            setUsers(response.data.users);
            setSuccess(true);
            setTimeout(()=>setSuccess(false), 3000);
        }catch(err){
            setErreur(err.response?.data?.message || "Erreur lors de la suppression ");
        }finally{
            setChargement(false);
        }
    };
    const handleCreateUser=async(userData)=>{
        setChargement(true);
        setErreur("");
        try{
            await createUser(userData);
            const response=await getAllUsers();
            setUsers(response.data.users);
            setSuccess(true);
            setShowCreateModal(false);
            setTimeout(()=>setSuccess(false),3000);
        }catch(err){
            setErreur(err.response?.data?.message || "Erreur lors de la creation");
        }finally{
            setChargement(false);
        }
    }

    return (
        <>
            <Header />
            <div className="dashboard-container">
                <h1>Dashboard Planificateur</h1>
                <p>Bienvenue sur votre espace planificateur.</p>

                {erreur && <p className="error">{erreur}</p>}
                {success && <p className="success">Action effectuée avec succès.</p>}

                <StatsCards tickets={tickets} users={users} />

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
                                    <p><strong>Statut :</strong> <span className={`status ${ticket.statut}`}>{ticket.statut}</span></p>

                                    <div className="ticket-actions">
                                        <select
                                            className="select-technicien"
                                            value={selectedTechnicien[ticket.id] || ""}
                                            onChange={(e) => setSelectedTechnicien({ ...selectedTechnicien, [ticket.id]: e.target.value })}>
                                            <option value="">Choisir un technicien</option>
                                            {users.filter(user => user.role === "technicien").map((user) => (
                                                <option key={user.id} value={user.id}>{user.nom}</option>
                                            ))}
                                        </select>
                                        <button className="btn btn-primary"
                                            onClick={() => handleAffecter(ticket)}
                                            disabled={ticket.statut !== "en attente"}>
                                            Affecter</button>

                                        <button className="btn btn-success"
                                            onClick={() => handleAutoAffecter(ticket)} disabled={ticket.statut !== "en attente"}>
                                             Auto</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="section">
                    <div className="filters-container">
                        <input type="text"
                            placeholder="Rechercher par client, technicien ou description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-bar"/>
                        <select value={prioriteFilter}
                            onChange={(e) => setPrioriteFilter(e.target.value)}
                            className="filter-select">
                            <option value="toutes">Toutes les priorités</option>
                            <option value="urgent">Urgent</option>
                            <option value="standard">Standard</option>
                        </select>
                    </div>

                    <h2>Toutes les interventions</h2>
                    {filteredInterventions.length === 0 ? (
                        <p>Aucune intervention ne correspond à votre recherche.</p>
                    ) : (
                        <ul>
                            {filteredInterventions.map((intervention) => (
                                <li key={intervention.id} className="card">
                                    <h3>{intervention.description}</h3>
                                    <p><strong>Client :</strong> {intervention.client_nom}</p>
                                    <p><strong>Technicien :</strong> {intervention.technicien_nom || "Non affecté"}</p>
                                    <p><strong>Statut :</strong> <span className={`status ${intervention.statut}`}>{intervention.statut}</span></p>

                                    {intervention.statut === "termine" && intervention.rapport && (
                                        <div className="rapport-display">
                                            <h4>Rapport du technicien</h4>
                                            <p>{intervention.rapport}</p>
                                        </div>
                                    )}

                                    {intervention.statut === "termine" && intervention.note && (
                                        <div className="evaluation-display">
                                            <h4>Évaluation du client</h4>
                                            <p><strong>Note :</strong> {intervention.note} ⭐</p>
                                            {intervention.commentaire && <p><strong>Commentaire :</strong> {intervention.commentaire}</p>}
                                        </div>
                                    )}

                                    <div className="statuts_update">
                                        <select className="select-statut"
                                            value={nouvStatut[intervention.id] || intervention.statut}
                                            onChange={(e) => setNouvStatut({ ...nouvStatut, [intervention.id]: e.target.value })}>
                                            <option value="en attente">En attente</option>
                                            <option value="affecté">Affecté</option>
                                            <option value="en cours">En cours</option>
                                            <option value="termine">Terminé</option>
                                        </select>
                                        <button className="btn btn-warning"
                                            onClick={() => handUpdateStatus(intervention)} disabled={chargement}>
                                            Modifier</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="section">
                    <button className="btn btn-primary" onClick={()=> setShowCreateModal(true)}>+ Ajouter un utilisateur</button>
                </div>
                <UserTable users={users}
                    role="client" title="Clients"
                    onEdit={handleEditUser} onDelete={handleDeleteUser} />
                <UserTable users={users}
                    role="technicien" title="Techniciens"
                    onEdit={handleEditUser} onDelete={handleDeleteUser}/>
                <Map techniciens={users.filter(u => u.role === "technicien")}
                    interventions={interventions} users={users}
                    tickets={tickets}/>
                {showModal && editUser && (
                    <UserModal user={editUser} onClose={handleModalClose}
                        onSave={handleUpdateUser} chargement={chargement}/>
                )}
                {showCreateModal &&(
                    <CreateUserModal onClose={()=> setShowCreateModal(false)}
                    onSave={handleCreateUser}
                    chargement={chargement}/>
                )}
            </div>
        </>
    );
}

export default DashboardPlanificateur;