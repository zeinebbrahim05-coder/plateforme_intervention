import { useEffect, useState } from "react";
import { getAllInterventions, updateInterventionStatus } from "../../services/api";
import "../../styles/planificateurLayout.css";

function Interventions() {
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState("");

    const chargerInterventions = async () => {
        try {
            setLoading(true);
            setErreur("");

            const response = await getAllInterventions();

            if (response?.data?.success) {
                setInterventions(response.data.interventions || []);
            } else if (response?.data) {
                setInterventions(response.data.interventions || response.data || []);
            } else {
                setInterventions([]);
            }
        } catch{
            setErreur("Impossible de charger les interventions.");
        } finally {
            setLoading(false);
        }
    };
     useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        chargerInterventions();
    }, []);

    const modifierStatut = async (id, statut) => {
        try {
            await updateInterventionStatus(id, { statut });
            await chargerInterventions();
        } catch{
            setErreur("Impossible de modifier le statut.");
        }
    };

    const getStatutClass = (statut) => {
        if (!statut) return "";

        return statut
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");
    };

    const getNoteStars = (note) => {
        const valeur = Number(note);

        if (!valeur) return "";

        return "⭐".repeat(valeur);
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="page-heading">
                    <div>
                        <h1>Interventions</h1>
                        <p>Gestion et suivi des interventions</p>
                    </div>
                </div>

                <div className="dashboard-empty">
                    Chargement des interventions...
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div>
                    <h1>Interventions</h1>
                    <p>Gestion et suivi des interventions</p>
                </div>

                <div className="page-count">
                    {interventions.length} intervention(s)
                </div>
            </div>

            {erreur && (
                <p className="error">
                    {erreur}
                </p>
            )}

            {interventions.length === 0 ? (
                <div className="dashboard-empty">
                    Aucune intervention disponible.
                </div>
            ) : (
                <ul className="interventions-list">
                    {interventions.map((intervention) => (
                        <li
                            key={intervention.id}
                            className="dashboard-card intervention-card"
                        >
                            <div className="intervention-header">
                                <div>
                                    <h3>
                                        {intervention.description ||
                                            "Intervention sans description"}
                                    </h3>

                                    <p>
                                        <strong>Client :</strong>{" "}
                                        {intervention.client_nom ||
                                            intervention.client_name ||
                                            "Non renseigné"}
                                    </p>

                                    <p>
                                        <strong>Technicien :</strong>{" "}
                                        {intervention.technicien_nom ||
                                            intervention.technicien_name ||
                                            "Pas encore affecté"}
                                    </p>
                                </div>

                                <span
                                    className={`status ${getStatutClass(
                                        intervention.statut
                                    )}`}
                                >
                                    {intervention.statut || "Non défini"}
                                </span>
                            </div>

                            <div className="intervention-info">
                                <p>
                                    <strong>Adresse :</strong>{" "}
                                    {intervention.adresse || "Non renseignée"}
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
                            </div>

                            <div className="intervention-actions">
                                <select
                                    value={intervention.statut || ""}
                                    onChange={(e) =>
                                        modifierStatut(
                                            intervention.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="affecté">
                                        Affectée
                                    </option>
                                    <option value="en cours">
                                        En cours
                                    </option>
                                    <option value="termine">
                                        Terminée
                                    </option>
                                </select>
                            </div>

                            {intervention.statut === "termine" && (
                                <div className="intervention-details">
                                    <div className="rapport-display">
                                        <h4>📋 Rapport du technicien</h4>

                                        {intervention.rapport ? (
                                            <p>
                                                {intervention.rapport}
                                            </p>
                                        ) : (
                                            <p className="empty-info">
                                                Aucun rapport disponible.
                                            </p>
                                        )}
                                    </div>

                                    <div className="evaluation-display">
                                        <h4>⭐ Évaluation du client</h4>

                                        {intervention.note ? (
                                            <>
                                                <p>
                                                    <strong>Note :</strong>{" "}
                                                    {getNoteStars(
                                                        intervention.note
                                                    )}{" "}
                                                    ({intervention.note}/5)
                                                </p>

                                                {intervention.commentaire ? (
                                                    <p>
                                                        <strong>
                                                            Commentaire :
                                                        </strong>{" "}
                                                        {
                                                            intervention.commentaire
                                                        }
                                                    </p>
                                                ) : (
                                                    <p className="empty-info">
                                                        Aucun commentaire.
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p className="empty-info">
                                                Le client n'a pas encore évalué
                                                cette intervention.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Interventions;