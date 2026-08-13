import { useState } from "react";

function MonthGrid({ interventions, date }) {
    const [selectedDay, setSelectedDay] = useState(null);

    const getDaysInMonth = () => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;

        const days = [];

        for (let i = startDay; i > 0; i--) {
            const day = new Date(year, month, 1 - i);
            days.push({
                date: day,
                currentMonth: false
            });
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({
                date: new Date(year, month, i),
                currentMonth: true
            });
        }

        let nextDay = 1;

        while (days.length < 42) {
            days.push({
                date: new Date(year, month + 1, nextDay),
                currentMonth: false
            });
            nextDay++;
        }

        return days;
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const getInterventionsForDay = (day) => {
        const dateString = formatDate(day.date);

        return interventions.filter(intervention => {
            if (!intervention.date_prevue) return false;

            return intervention.date_prevue.substring(0, 10) === dateString;
        });
    };

    const isToday = (day) => {
        const today = new Date();

        return (
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear()
        );
    };

    const getStatusClass = (intervention) => {
        if (intervention.priorite === "urgent") {
            return "urgent";
        }

        if (intervention.statut === "termine") {
            return "termine";
        }

        if (
            intervention.statut === "en attente" ||
            intervention.statut === "affecte"
        ) {
            return "attente";
        }

        if (intervention.statut === "en cours") {
            return "cours";
        }

        return "normal";
    };

    const days = getDaysInMonth();

    const totalInterventions = interventions.filter(intervention => {
        if (!intervention.date_prevue) return false;

        const interventionDate = new Date(intervention.date_prevue);
        return (
            interventionDate.getMonth() === date.getMonth() &&
            interventionDate.getFullYear() === date.getFullYear()
        );
    }).length;

    const monthName = date.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric"
    });

    return (
        <div className="month-view">

            <div className="month-header">
                <div>
                    <h2>
                        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                    </h2>

                    <span>
                        {totalInterventions} intervention
                        {totalInterventions > 1 ? "s" : ""} ce mois
                    </span>
                </div>

                <div className="month-info">
                    Cliquez sur une journée pour voir les interventions
                </div>
            </div>

            <div className="month-weekdays">
                <div>LUN</div>
                <div>MAR</div>
                <div>MER</div>
                <div>JEU</div>
                <div>VEN</div>
                <div className="weekend">SAM</div>
                <div className="weekend">DIM</div>
            </div>

            <div className="month-grid">

                {days.map((day, index) => {

                    const dayInterventions = getInterventionsForDay(day);
                    const weekend = index % 7 >= 5;

                    return (
                        <div
                            key={index}
                            className={`month-cell
                                ${!day.currentMonth ? "other-month" : ""}
                                ${weekend ? "weekend" : ""}
                                ${isToday(day.date) ? "today" : ""}
                            `}
                            onClick={() => {
                                if (dayInterventions.length > 0) {
                                    setSelectedDay({
                                        date: day.date,
                                        interventions: dayInterventions
                                    });
                                }
                            }}
                        >

                            <div className="month-cell-top">

                                <span className="month-day-number">
                                    {day.date.getDate()}
                                </span>

                                {dayInterventions.length > 0 && (
                                    <span className="month-count">
                                        {dayInterventions.length} RDV
                                    </span>
                                )}

                            </div>

                            <div className="month-events">

                                {dayInterventions.slice(0, 3).map(intervention => (

                                    <div
                                        key={intervention.id}
                                        className={`month-event ${getStatusClass(intervention)}`}
                                    >

                                        <div className="month-event-time">
                                            {intervention.heure_debut
                                                ? intervention.heure_debut.substring(0, 5)
                                                : "--:--"
                                            }
                                        </div>

                                        <div className="month-event-name">
                                            {intervention.client_nom || "Client"}
                                        </div>

                                    </div>

                                ))}

                                {dayInterventions.length > 3 && (
                                    <div className="month-more">
                                        +{dayInterventions.length - 3} autres
                                    </div>
                                )}

                            </div>

                            {dayInterventions.length > 0 && (
                                <div className="month-status-dots">

                                    {[...new Set(
                                        dayInterventions.map(i => getStatusClass(i))
                                    )].map(status => (
                                        <span
                                            key={status}
                                            className={`month-status-dot ${status}`}
                                        />
                                    ))}

                                </div>
                            )}

                        </div>
                    );
                })}

            </div>

            {selectedDay && (

                <div
                    className="month-popup-overlay"
                    onClick={() => setSelectedDay(null)}
                >

                    <div
                        className="month-day-popup"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="month-popup-header">

                            <div>
                                <strong>
                                    {selectedDay.date.toLocaleDateString(
                                        "fr-FR",
                                        {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        }
                                    )}
                                </strong>

                                <span>
                                    {selectedDay.interventions.length} RDV
                                </span>
                            </div>

                            <button
                                onClick={() => setSelectedDay(null)}
                            >
                                ×
                            </button>

                        </div>

                        <div className="month-popup-list">

                            {selectedDay.interventions.map(intervention => (

                                <div
                                    key={intervention.id}
                                    className="month-popup-intervention"
                                >

                                    <div className="popup-time">
                                        {intervention.heure_debut
                                            ? intervention.heure_debut.substring(0, 5)
                                            : "--:--"
                                        }
                                    </div>

                                    <div className="popup-info">

                                        <strong>
                                            {intervention.client_nom || "Client"}
                                        </strong>

                                        <span>
                                            {intervention.technicien_nom ||
                                                "Technicien non affecté"}
                                        </span>

                                        <small>
                                            {intervention.description}
                                        </small>

                                    </div>

                                    <span
                                        className={`popup-status ${getStatusClass(intervention)}`}
                                    >
                                        {intervention.statut}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default MonthGrid;