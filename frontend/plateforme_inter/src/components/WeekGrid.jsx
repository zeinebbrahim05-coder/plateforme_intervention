function WeekGrid({
    interventions = [],
    techniciens = [],
    date,
    technicienSelectionne
}) {
    const getWeekDays = (date) => {
        const debut = new Date(date);
        const jour = debut.getDay();
        const difference =jour === 0 ? -6 : 1 - jour;
        debut.setDate(debut.getDate() + difference);
        const jours = [];
        for (let i = 0; i < 7; i++) {
            const jourActuel = new Date(debut);
            jourActuel.setDate(debut.getDate() + i);
            jours.push(jourActuel);
        }
        return jours;
    };
    const jours = getWeekDays(date);
    const formatDate = (date) => {
        const annee = date.getFullYear();
        const mois = String(
            date.getMonth() + 1
        ).padStart(2, "0");
        const jour = String(
            date.getDate()
        ).padStart(2, "0");
        return `${annee}-${mois}-${jour}`;
    };
    const isToday = (jour) => {
        const aujourdHui = new Date();
        return (
            jour.getDate() === aujourdHui.getDate() &&
            jour.getMonth() === aujourdHui.getMonth() &&
            jour.getFullYear() === aujourdHui.getFullYear()
        );
    };
    const getInterventionsForDay = (
        jour,technicien
    ) => {
        const dateJour = formatDate(jour);
        return interventions.filter(
            (intervention) => {
                const dateIntervention =
                    intervention.date_prevue
                        ? intervention.date_prevue.substring(0, 10)
                        : null;

                return (
                    dateIntervention === dateJour &&
                    String(intervention.technicien_id) ===
                    String(technicien.user_id)
                );
            }
        );
    };

    const techniciensFiltres =
        technicienSelectionne === null
            ? techniciens
            : techniciens.filter(
                (technicien) =>
                    String(technicien.user_id) ===
                    String(technicienSelectionne)
            );
    return (

        <div className="week-grid-wrapper">
            <div className="week-grid">
                <div className="week-corner">
                    TECHNICIEN
                </div>
                {jours.map((jour) => {
                    const dateJour =
                        formatDate(jour);
                    const nombre =
                        interventions.filter(
                            (intervention) =>
                                intervention.date_prevue
                                    ?.substring(0, 10) ===
                                dateJour
                        ).length;
                    const weekend =
                        jour.getDay() === 0 ||
                        jour.getDay() === 6;
                    return (
                        <div key={dateJour}
                            className={`day-head
                                ${isToday(jour) ? "today" : ""}
                                ${weekend ? "weekend" : ""}
                            `}
                        >
                            <div className="day-name">
                                {jour.toLocaleDateString("fr-FR",
                                        {weekday: "short"}
                                    )
                                    .toUpperCase()}
                            </div>
                            <div className="day-number">
                                {jour.getDate()}
                            </div>
                            <div className="day-count">
                                {nombre} RDV
                            </div>
                        </div>
                    );
                })}
                {techniciensFiltres.map(
                    (technicien) => {
                        const nombre =
                            interventions.filter(
                                (intervention) =>
                                    String(intervention.technicien_id) ===
                                    String(technicien.user_id)
                            ).length;
                        return (

                            <div className="technician-row"
                                key={technicien.user_id}>
                                <div className="technician-label">
                                    <strong>
                                        {technicien.nom}
                                    </strong>
                                    <span>
                                        {nombre} RDV
                                    </span>
                                </div>

                                {jours.map((jour) => {
                                    const rdvs =getInterventionsForDay(
                                            jour,technicien);
                                    const weekend =
                                        jour.getDay() === 0 ||
                                        jour.getDay() === 6;
                                    return (
                                        <div key={`${technicien.user_id}-${formatDate(jour)}`}
                                            className={`
                                                day-cell
                                                ${weekend ? "weekend" : ""}
                                            `}
                                        >
                                            {rdvs.length === 0 ? (
                                                <span className="empty-cell">
                                                    —
                                                </span>
                                            ) : (
                                                rdvs.map(
                                                    (rdv) => (
                                                        <div key={rdv.id}
                                                            className={`rdv-card
                                                                ${rdv.priorite === "urgent"
                                                                    ? "urgent"
                                                                    : ""
                                                                }
                                                            `}
                                                        >
                                                            <div className="rdv-top">
                                                                <span className="rdv-type">
                                                                    {rdv.priorite === "urgent"
                                                                        ? "URGENT"
                                                                        : "INTERVENTION"
                                                                    }

                                                                </span>

                                                                <span>
                                                                    ●
                                                                </span>

                                                            </div>

                                                            <div className="rdv-name">
                                                                {rdv.client_nom || "Client"}
                                                            </div>
                                                            <div className="rdv-time">
                                                                <span>

                                                                    {rdv.heure_debut
                                                                        ? rdv.heure_debut.substring(0, 5)
                                                                        : "--:--"
                                                                    }

                                                                    {" – "}

                                                                    {rdv.heure_fin
                                                                        ? rdv.heure_fin.substring(0, 5)
                                                                        : "--:--"
                                                                    }

                                                                </span>


                                                                {rdv.code_postal && (

                                                                    <span className="rdv-cp">

                                                                        {rdv.code_postal}

                                                                    </span>

                                                                )}

                                                            </div>
                                                            <div
                                                                className={`rdv-status
                                                                    ${rdv.statut === "termine"
                                                                            ? "success": rdv.statut === "en attente"
                                                                                ? "warning": rdv.statut === "en cours"
                                                                                    ? "info": rdv.priorite === "urgent"
                                                                                        ? "danger": ""}`}>
                                                                {rdv.statut}
                                                            </div>

                                                        </div>

                                                    )
                                                )

                                            )}

                                        </div>

                                    );

                                })}

                            </div>

                        );

                    }
                )}

            </div>

        </div>

    );
}

export default WeekGrid;