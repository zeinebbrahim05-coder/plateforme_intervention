import { useState, useEffect } from "react";
import { getTechnicienInterventions, updateInterventionStatus, addRapport, updateDisponibilite } from "../services/api";
import { useShareLocation } from "../hooks/useShareLocation";
import Header from "../components/headerTechnicien";
import TechnicienSidebar from "../components/technicienSidebar";
import "../styles/DashboardTechnicien.css";

function DashboardTechnicien() {
    const [page, setPage] = useState("dashboard");
    const [interventions, setInterventions] = useState([]);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");
    const [success, setSuccess] = useState(false);
    const [nouveauStatut, setNouveauStatut] = useState({});
    const [rapport, setRapport] = useState({});
    const [disponible, setDisponible] = useState(true);

    useEffect(() => {
        const fetchInterventions = async () => {
            setErreur("");
            try {
                const response = await getTechnicienInterventions();
                setInterventions(response.data.intervention || response.data.interventions || []);
            } catch{
                setErreur("erreur lors du chargement des interventions");
            }
        };
        fetchInterventions();
    }, []);

    const handleUpdateStatus = async (id) => {
        if (!nouveauStatut[id]) {
            setErreur("Veuillez selectionné un statut");
            return;
        }
        setChargement(true);
        setErreur("");
        try {
            await updateInterventionStatus(id, { statut: nouveauStatut[id] });
            setSuccess(true);
            const response = await getTechnicienInterventions();
            setInterventions(response.data.intervention || response.data.interventions || []);
            setNouveauStatut(prev => ({ ...prev, [id]: "" }));
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setErreur(err.response?.data?.message || 'Erreur lors de la modification du statut ');
        } finally {
            setChargement(false);
        }
    };

    const handleRapport = async (id) => {
        if (!rapport[id]) {
            setErreur("veuillez saisir un rapport");
            return;
        }
        setChargement(true);
        setErreur("");
        try {
            await addRapport(id, { rapport: rapport[id] });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            const response = await getTechnicienInterventions();
            setInterventions(response.data.intervention || response.data.interventions || []);
            setRapport(prev => ({ ...prev, [id]: "" }));
        } catch (err) {
            setErreur(err.response?.data?.message || "Erreur lors de l'ajout du rapport ");
        } finally {
            setChargement(false);
        }
    };

    const shareLocation = useShareLocation(setErreur, setSuccess);

    const toggleDisponibilite = async () => {
        try {
            const nouvelleValeur = !disponible;
            await updateDisponibilite(nouvelleValeur);
            setDisponible(nouvelleValeur);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch{
            setErreur("erreur lors de la mise a jour de la disponibilite");
        }
    };

    const renderContent = () => {
        if (page === "dashboard") {
            return (
                <div className="dashboard-page">
                    <div className="page-heading">
                        <div>
                            <h1>Dashboard Technicien</h1>
                            <p>Bienvenue sur votre espace technicien.</p>
                        </div>
                    </div>
                    
                    <div className="dashboard-actions">
                        <button className="btn btn-info" onClick={shareLocation}>Partager ma position</button>
                        <button className={disponible ? "btn btn-success" : "btn btn-warning"} onClick={toggleDisponibilite}>
                            {disponible ? "Disponible ✓" : "Indisponible"}
                        </button>
                    </div>

                    {erreur && <p className="error">{erreur}</p>}
                    {success && <p className="success">Action effectuée avec succès !</p>}

                    <div className="section">
                        <h2>Mes interventions</h2>
                        {interventions.length === 0 ? (
                            <p>Aucune intervention pour le moment</p>
                        ) : (
                            <ul>
                                {interventions.map((intervention) => (
                                    <li key={intervention.id} className="card">
                                        <h3>{intervention.description}</h3>
                                        <p><strong>Statut :</strong> <span className={`status ${intervention.statut.replace(" ","-")}`}>{intervention.statut}</span></p>
                                        <p><strong>Client :</strong> {intervention.client_nom}</p>
                                        <p><strong>Adresse :</strong> {intervention.adresse}</p>
                                        <div className="status-update">
                                            <select 
                                                value={nouveauStatut[intervention.id] || ""}
                                                onChange={(e) => setNouveauStatut({ ...nouveauStatut, [intervention.id]: e.target.value })}
                                            >
                                                <option value="">Choisir un statut</option>
                                                <option value="en attente">En attente</option>
                                                <option value="affecté">Affecté</option>
                                                <option value="en cours">En cours</option>
                                                <option value="termine">Terminé</option>
                                            </select>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => handleUpdateStatus(intervention.id)}
                                                disabled={chargement}
                                            >
                                                Modifier le statut
                                            </button>
                                        </div>
                                        <div className="rapport-add">
                                            <textarea
                                                placeholder="Rédigez votre rapport..."
                                                value={rapport[intervention.id] || ""}
                                                onChange={(e) => setRapport({ ...rapport, [intervention.id]: e.target.value })}
                                            />
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleRapport(intervention.id)}
                                            >
                                                Ajouter un rapport
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            );
        }

        if (page === "interventions") {
            return (
                <div className="dashboard-page">
                    <div className="page-heading">
                        <div>
                            <h1>Mes interventions</h1>
                            <p>Gérez toutes vos interventions</p>
                        </div>
                    </div>

                    {erreur && <p className="error">{erreur}</p>}
                    {success && <p className="success">Action effectuée avec succès !</p>}

                    <div className="page-count">
                        <h2>Liste des interventions</h2>
                        {interventions.length === 0 ? (
                            <p>Aucune intervention pour le moment</p>
                        ) : (
                            <ul>
                                {interventions.map((intervention) => (
                                    <li key={intervention.id} className="card">
                                        <h3>{intervention.description}</h3>
                                        <p><strong>Statut :</strong> <span className={`status ${intervention.statut}`}>{intervention.statut}</span></p>
                                        <p><strong>Client :</strong> {intervention.client_nom}</p>
                                        <p><strong>Adresse :</strong> {intervention.adresse}</p>
                                        <div className="status-update">
                                            <select 
                                                value={nouveauStatut[intervention.id] || ""}
                                                onChange={(e) => setNouveauStatut({ ...nouveauStatut, [intervention.id]: e.target.value })}
                                            >
                                                <option value="">Choisir un statut</option>
                                                <option value="en attente">En attente</option>
                                                <option value="affecté">Affecté</option>
                                                <option value="en cours">En cours</option>
                                                <option value="termine">Terminé</option>
                                            </select>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => handleUpdateStatus(intervention.id)}
                                                disabled={chargement}
                                            >
                                                Modifier le statut
                                            </button>
                                        </div>
                                        <div className="rapport-add">
                                            <textarea
                                                placeholder="Rédigez votre rapport..."
                                                value={rapport[intervention.id] || ""}
                                                onChange={(e) => setRapport({ ...rapport, [intervention.id]: e.target.value })}
                                            />
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleRapport(intervention.id)}
                                            >
                                                Ajouter un rapport
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            );
        }

        if (page === "disponibilite") {
            return (
                <div className="dashboard-page">
                    <div className="page-heading">
                        <div>
                            <h1>Gestion de la disponibilité</h1>
                            <p>Modifiez votre statut de disponibilité</p>
                        </div>
                    </div>

                    {erreur && <p className="error">{erreur}</p>}
                    {success && <p className="success">Disponibilité mise à jour !</p>}

                    <div className="section">
                        <h2>Statut actuel</h2>
                        <div className="disponibilite-card">
                            <p>
                                <strong>Vous êtes actuellement :</strong>{" "}
                                <span className={disponible ? "status-disponible" : "status-indisponible"}>
                                    {disponible ? "✅ Disponible" : "❌ Indisponible"}
                                </span>
                            </p>
                            <button 
                                className={disponible ? "btn btn-warning" : "btn btn-success"} 
                                onClick={toggleDisponibilite}
                            >
                                {disponible ? "Marquer indisponible" : "Marquer disponible"}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return <div>Page en construction</div>;
    };

    return (
        <div className="plan-app">
            <TechnicienSidebar page={page} setPage={setPage} />
            <main className="plan-content">
                <Header />
                {renderContent()}
            </main>
        </div>
    );
}

export default DashboardTechnicien;