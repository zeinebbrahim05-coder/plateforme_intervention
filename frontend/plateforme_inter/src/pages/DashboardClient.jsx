import { useState, useEffect } from "react";
import { createTicket, getMyTickets, getClientInterventions, getRapport, addEvaluation } from '../services/api';
import { useShareLocation } from "../hooks/useShareLocation";
import "../styles/DashboardClient.css";
import Header from "../components/headerClient";
import ClientSidebar from "../components/clientSidebar";

function DashboardClient() {
    const [page, setPage] = useState("dashboard");
    const [description, setDescription] = useState("");
    const [adresse, setAdresse] = useState("");
    const [priorite, setPriorite] = useState("standard");
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");
    const [success, setSuccess] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [interventions, setInterventions] = useState([]);
    const [rapport, setRapport] = useState(null);
    const [evaluations, setEvaluations] = useState({});

    useEffect(() => {
        const fetchTickets = async () => {
            setErreur("");
            try {
                const response = await getMyTickets();
                setTickets(response.data.tickets);
            } catch{
                setErreur("erreur lors du chargement des tickets");
            }
        };
        const fetchInterventions = async () => {
            setErreur("");
            try {
                const response = await getClientInterventions();
                setInterventions(response.data.intervention);
            } catch {
                setErreur("erreur lors du chargement des interventions");
            }
        };
        fetchTickets();
        fetchInterventions();
    }, []);

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        setChargement(true);
        setErreur('');
        try {
            await createTicket({ description, adresse, priorite });
            setSuccess(true);
            setDescription('');
            setAdresse('');
            setPriorite('standard');
            const response = await getMyTickets();
            setTickets(response.data.tickets);
            setTimeout(() => { setSuccess(false); }, 3000);
        } catch (err) {
            setErreur(err.response?.data?.message || 'Erreur lors de creation du ticket ');
        } finally {
            setChargement(false);
        }
    };

    const handleVoirRapport = async (id) => {
        setErreur("");
        try {
            setRapport(null);
            const response = await getRapport(id);
            setRapport(response.data.rapport);
        } catch {
            setErreur("erreur lors du chargement du rapport");
        }
    };

    const handleEvaluation = async (id, note, commentaire) => {
        setErreur("");
        try {
            await addEvaluation(id, { note, commentaire });
            setEvaluations((prev) => ({ ...prev, [id]: { note: 5, commentaire: "" } }));
            const response = await getClientInterventions();
            setInterventions(response.data.intervention);
        } catch{
            setErreur("erreur lors de l'ajout de l'evaluation");
        }
    };

    const shareLocation = useShareLocation(setErreur, setSuccess);

    const renderContent = () => {
        if (page === "dashboard") {
            return (
                <div className="dashboard-page">
                    <div className="page-heading">
                        <div>
                            <h1>Dashboard Client</h1>
                            <p>Gérez vos demandes et suivez vos interventions.</p>
                        </div>
                        <div className="page-count">
                            {tickets.length} tickets
                        </div>
                    </div>
                    {erreur && <p className="error">{erreur}</p>}
                    {success && <p className="success">Ticket créé avec succès.</p>}
                    
                    <div className="dashboard-section">
                        <h2>Créer un ticket</h2>
                        <form className="dashboard-form" onSubmit={handleSubmitTicket}>
                            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                            <input type="text" placeholder="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
                            <select value={priorite} onChange={(e) => setPriorite(e.target.value)}>
                                <option value="standard">Standard</option>
                                <option value="urgent">Urgent</option>
                            </select>
                            <button type="button" className="dashboard-btn dashboard-btn-primary" onClick={shareLocation}>Partager ma position</button>
                            <button type="submit" className="dashboard-btn dashboard-btn-primary" disabled={chargement}>
                                {chargement ? "Création..." : "Créer un ticket"}
                            </button>
                        </form>
                    </div>

                    <div className="dashboard-section">
                        <h2>Mes Tickets</h2>
                        {tickets.length === 0 ? (
                            <div className="dashboard-empty">Aucun ticket pour le moment</div>
                        ) : (
                            <ul>
                                {tickets.map((ticket) => (
                                    <li key={ticket.id} className="dashboard-card">
                                        <h3>{ticket.description}</h3>
                                        <p><strong>Adresse :</strong> {ticket.adresse}</p>
                                        <p><strong>Priorité :</strong> {ticket.priorite}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="dashboard-section">
                        <h2>Mes interventions</h2>
                        {interventions.length === 0 ? (
                            <p>Aucune intervention pour le moment</p>
                        ) : (
                            <ul>
                                {interventions.map((intervention) => (
                                    <li key={intervention.id} className="dashboard-card">
                                        <h3>{intervention.description}</h3>
                                        <p>
                                            <strong>Statut :</strong>{" "}
                                            <span className={`status ${intervention.statut.replace(" ", "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                                                {intervention.statut}
                                            </span>
                                        </p>
                                        <p><strong>Technicien :</strong> {intervention.technicien_nom || "Pas encore affecté"}</p>
                                        <p>
                                            <strong>Date prévue :</strong>{" "}
                                            {intervention.date_prevue
                                                ? new Date(intervention.date_prevue).toLocaleDateString("fr-FR")
                                                : "Non planifiée"
                                            }
                                        </p>
                                        <p>
                                            <strong>Horaire :</strong>{" "}
                                            {intervention.heure_debut && intervention.heure_fin
                                                ? `${intervention.heure_debut.slice(0, 5)} - ${intervention.heure_fin.slice(0, 5)}`
                                                : "Non planifié"
                                            }
                                        </p>
                                        <button onClick={() => handleVoirRapport(intervention.id)} className="dashboard-btn dashboard-btn-primary">
                                            Voir le rapport
                                        </button>
                                        {intervention.statut === "termine" && (
                                            <div className="evaluation">
                                                <h4>Évaluer cette intervention</h4>
                                                <select
                                                    value={evaluations[intervention.id]?.note || 5}
                                                    onChange={(e) => setEvaluations({
                                                        ...evaluations,
                                                        [intervention.id]: {
                                                            ...evaluations[intervention.id],
                                                            note: Number(e.target.value)
                                                        }
                                                    })}
                                                >
                                                    <option value="1">1 ⭐</option>
                                                    <option value="2">2 ⭐⭐</option>
                                                    <option value="3">3 ⭐⭐⭐</option>
                                                    <option value="4">4 ⭐⭐⭐⭐</option>
                                                    <option value="5">5 ⭐⭐⭐⭐⭐</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Votre commentaire..."
                                                    value={evaluations[intervention.id]?.commentaire || ""}
                                                    onChange={(e) => setEvaluations({
                                                        ...evaluations,
                                                        [intervention.id]: {
                                                            ...evaluations[intervention.id],
                                                            commentaire: e.target.value
                                                        }
                                                    })}
                                                />
                                                <button
                                                    onClick={() => handleEvaluation(
                                                        intervention.id,
                                                        evaluations[intervention.id]?.note || 5,
                                                        evaluations[intervention.id]?.commentaire || ""
                                                    )}
                                                    className="dashboard-btn dashboard-btn-success"
                                                >
                                                    Envoyer l'évaluation
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {rapport && (
                        <div className="dashboard-section">
                            <h3>Rapport de l'intervention</h3>
                            <p>{rapport}</p>
                        </div>
                    )}
                </div>
            );
        }

        if (page === "tickets") {
            return (
                <div className="dashboard-page">
                    <div className="page-heading">
                        <div>
                            <h1>Mes tickets</h1>
                            <p>Gérez vos demandes</p>
                        </div>
                        <div className="page-count">
                            {tickets.length} tickets
                        </div>
                    </div>
                    {tickets.length === 0 ? (
                        <div className="dashboard-empty">Aucun ticket pour le moment</div>
                    ) : (
                        <ul>
                            {tickets.map((ticket) => (
                                <li key={ticket.id} className="dashboard-card">
                                    <h3>{ticket.description}</h3>
                                    <p><strong>Adresse :</strong> {ticket.adresse}</p>
                                    <p><strong>Priorité :</strong> {ticket.priorite}</p>
                                    <p><strong>Statut :</strong> <span className={`status ${ticket.statut.replace(" ","-")}`}>{ticket.statut}</span></p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        }

        if (page === "interventions") {
            return (
                <div className="dashboard-page">
                    <div className="page-heading">
                        <div>
                            <h1>Mes interventions</h1>
                            <p>Suivez vos interventions et partagez votre avis.</p>
                        </div>

                        <div className="page-count">
                            {interventions.length} intervention(s)
                        </div>
                    </div>

                    {erreur && <p className="error">{erreur}</p>}

                    {interventions.length === 0 ? (
                        <div className="dashboard-empty">
                            Aucune intervention pour le moment
                        </div>
                    ) : (
                        <ul>
                            {interventions.map((intervention) => (
                                <li
                                    key={intervention.id}
                                    className="dashboard-card"
                                >
                                    <h3>{intervention.description}</h3>

                                    <p>
                                        <strong>Statut :</strong>{" "}
                                        <span
                                            className={`status ${
                                                intervention.statut
                                                    .replace(" ", "-")
                                                    .normalize("NFD")
                                                    .replace(/[\u0300-\u036f]/g, "")
                                            }`}
                                        >
                                            {intervention.statut}
                                        </span>
                                    </p>

                                    <p>
                                        <strong>Technicien :</strong>{" "}
                                        {intervention.technicien_nom ||
                                            "Pas encore affecté"}
                                    </p>

                                    <p>
                                        <strong>Date prévue :</strong>{" "}
                                        {intervention.date_prevue
                                            ? new Date(
                                                intervention.date_prevue
                                            ).toLocaleDateString("fr-FR")
                                            : "Non planifiée"}
                                    </p>

                                    <p>
                                        <strong>Horaire :</strong>{" "}
                                        {intervention.heure_debut &&
                                        intervention.heure_fin
                                            ? `${intervention.heure_debut.slice(
                                                0,
                                                5
                                            )} - ${intervention.heure_fin.slice(
                                                0,
                                                5
                                            )}`
                                            : "Non planifié"}
                                    </p>

                                    {/* RAPPORT */}
                                    <button
                                        onClick={() =>
                                            handleVoirRapport(intervention.id)
                                        }
                                        className="dashboard-btn dashboard-btn-primary"
                                    >
                                        Voir le rapport
                                    </button>

                                    {/* ÉVALUATION */}
                                    {intervention.statut === "termine" && (
                                        <div className="evaluation">
                                            <h4>⭐ Évaluer cette intervention</h4>

                                            <select
                                                value={
                                                    evaluations[intervention.id]
                                                        ?.note || 5
                                                }
                                                onChange={(e) =>
                                                    setEvaluations((prev) => ({
                                                        ...prev,
                                                        [intervention.id]: {
                                                            ...prev[intervention.id],
                                                            note: Number(
                                                                e.target.value
                                                            ),
                                                        },
                                                    }))
                                                }
                                            >
                                                <option value="1">1 ⭐</option>
                                                <option value="2">2 ⭐⭐</option>
                                                <option value="3">3 ⭐⭐⭐</option>
                                                <option value="4">4 ⭐⭐⭐⭐</option>
                                                <option value="5">5 ⭐⭐⭐⭐⭐</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Votre commentaire..."
                                                value={
                                                    evaluations[intervention.id]
                                                        ?.commentaire || ""
                                                }
                                                onChange={(e) =>
                                                    setEvaluations((prev) => ({
                                                        ...prev,[intervention.id]: {...prev[intervention.id],
                                                            commentaire:e.target.value,},}))}/>
                                            <button onClick={() =>
                                                    handleEvaluation(intervention.id,evaluations[intervention.id]
                                                            ?.note || 5,
                                                        evaluations[intervention.id]
                                                            ?.commentaire || ""
                                                    )
                                                }
                                                className="dashboard-btn dashboard-btn-success">
                                                Envoyer l'évaluation
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    {rapport && (
                        <div className="dashboard-section">
                            <h3>Rapport de l'intervention</h3>
                            <p>{rapport}</p>
                        </div>
                    )}
                </div>
            );
        }

        return <div>Page en construction</div>;
    };

    return (
        <div className="plan-app">
            <ClientSidebar page={page} setPage={setPage} />
            <main className="plan-content">
                <Header />
                {renderContent()}
            </main>
        </div>
    );
}

export default DashboardClient;