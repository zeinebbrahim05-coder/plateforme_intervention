import { useEffect, useState } from "react";
import { getAllUsers, getAllTickets, getAllInterventions } from "../../services/api";
import Map from "../../components/map";

function Carte() {
    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [interventions, setInterventions] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        const charger = async () => {
            try {
                const [usersRes, ticketsRes, interventionsRes] = await Promise.all([
                    getAllUsers(),
                    getAllTickets(),
                    getAllInterventions()
                ]);
                setUsers(usersRes.data.users || []);
                setTickets(ticketsRes.data.tickets || []);
                setInterventions(interventionsRes.data.interventions || []);
            } catch (err) {
                console.error(err);
                setErreur("Erreur lors du chargement de la carte");
            } finally {
                setChargement(false);
            }
        };
        charger();
    }, []);

    const techniciens = users.filter(u => u.role === "technicien");
    const techniciensActifs = techniciens.filter(t => t.disponible === true || t.disponible === 1).length;
    const clientsActifs = users.filter(u => u.role === "client" && u.latitude && u.longitude).length;

    return (
        <div className="plan-page">
            <div className="page-heading">
                <div>
                    <h2>Carte</h2>
                    <p>Visualisez les interventions et les techniciens en temps réel.</p>
                </div>
                <div className="page-count">
                    {techniciensActifs} technicien{techniciensActifs > 1 ? "s" : ""} disponible{techniciensActifs > 1 ? "s" : ""}
                </div>
            </div>

            {erreur && <div className="plan-error"><span>{erreur}</span></div>}

            {chargement ? (
                <div className="plan-loading">Chargement de la carte...</div>
            ) : (
                <>
                    <div className="map-legend">
                        <span><i className="legend-dot legend-tech"></i>Technicien</span>
                        <span><i className="legend-dot legend-client"></i>Client</span>
                        <span className="map-legend-count">{clientsActifs} client{clientsActifs > 1 ? "s" : ""} localisé{clientsActifs > 1 ? "s" : ""}</span>
                    </div>

                    <div className="map-card">
                        <Map
                            techniciens={techniciens}
                            interventions={interventions}
                            users={users}
                            tickets={tickets}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default Carte;