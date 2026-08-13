import {useEffect,useState} from "react";
import {
    getAllTickets,
    getAllInterventions,
    getAllUsers
} from "../../services/api";

function Dashboard(){

    const [tickets,setTickets]=useState([]);
    const [interventions,setInterventions]=useState([]);
    const [users,setUsers]=useState([]);
    const [chargement,setChargement]=useState(true);
    const [erreur,setErreur]=useState("");

    useEffect(()=>{
        const chargerDonnees=async()=>{

            try{

                setChargement(true);

                const [
                    ticketsRes,
                    interventionsRes,
                    usersRes
                ]=await Promise.all([
                    getAllTickets(),
                    getAllInterventions(),
                    getAllUsers()
                ]);

                setTickets(ticketsRes.data.tickets||[]);
                setInterventions(
                    interventionsRes.data.interventions||[]
                );
                setUsers(usersRes.data.users||[]);

            }catch(err){

                console.error(err);

                setErreur(
                    err.response?.data?.message ||
                    "Erreur lors du chargement des données"
                );

            }finally{

                setChargement(false);

            }
        };

        chargerDonnees();

    },[]);

    const ticketsEnAttente=
        tickets.filter(t=>t.statut==="en attente").length;

    const ticketsUrgents=
        tickets.filter(t=>t.priorite==="urgent").length;

    const techniciens=
        users.filter(u=>u.role==="technicien");

    const techniciensDisponibles=
        techniciens.filter(
            t=>t.disponible===true || t.disponible===1
        ).length;

    const interventionsEnCours=
        interventions.filter(
            i=>i.statut==="en cours"
        ).length;

    const interventionsTerminees=
        interventions.filter(
            i=>i.statut==="termine"
        ).length;

    if(chargement){

        return(
            <div className="plan-page">
                <div className="plan-loading">
                    Chargement des données...
                </div>
            </div>
        );

    }

    return(

        <div className="plan-page">

            <div className="dashboard-welcome">

                <div>
                    <h2>Tableau de bord</h2>

                    <p>
                        Bienvenue dans votre espace planificateur.
                    </p>
                </div>

            </div>

            {erreur && (
                <div className="plan-error">
                    {erreur}
                </div>
            )}

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon purple">
                        🎫
                    </div>

                    <div>
                        <span>Tickets en attente</span>
                        <strong>{ticketsEnAttente}</strong>
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon red">
                        ⚠
                    </div>

                    <div>
                        <span>Tickets urgents</span>
                        <strong>{ticketsUrgents}</strong>
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon blue">
                        🔧
                    </div>

                    <div>
                        <span>Techniciens disponibles</span>
                        <strong>{techniciensDisponibles}</strong>
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon green">
                        ✓
                    </div>

                    <div>
                        <span>Interventions terminées</span>
                        <strong>{interventionsTerminees}</strong>
                    </div>

                </div>

            </div>


            <div className="dashboard-grid">

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h3>
                                Résumé des interventions
                            </h3>

                            <span>
                                État actuel des interventions
                            </span>

                        </div>

                    </div>


                    <div className="status-list">

                        <div className="status-item">

                            <span>
                                <i className="status-dot waiting"></i>
                                En attente
                            </span>

                            <strong>
                                {
                                    interventions.filter(
                                        i=>i.statut==="en attente"
                                    ).length
                                }
                            </strong>

                        </div>


                        <div className="status-item">

                            <span>
                                <i className="status-dot assigned"></i>
                                Affectées
                            </span>

                            <strong>
                                {
                                    interventions.filter(
                                        i=>i.statut==="affecté"
                                    ).length
                                }
                            </strong>

                        </div>


                        <div className="status-item">

                            <span>
                                <i className="status-dot progress"></i>
                                En cours
                            </span>

                            <strong>
                                {interventionsEnCours}
                            </strong>

                        </div>


                        <div className="status-item">

                            <span>
                                <i className="status-dot finished"></i>
                                Terminées
                            </span>

                            <strong>
                                {interventionsTerminees}
                            </strong>

                        </div>

                    </div>

                </div>


                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h3>Techniciens</h3>

                            <span>
                                État des techniciens
                            </span>

                        </div>

                        <strong className="panel-number">
                            {techniciens.length}
                        </strong>

                    </div>


                    <div className="technician-summary">

                        <div>

                            <span className="online-dot"></span>

                            <span>
                                Disponibles
                            </span>

                            <strong>
                                {techniciensDisponibles}
                            </strong>

                        </div>


                        <div>

                            <span className="offline-dot"></span>

                            <span>
                                Indisponibles
                            </span>

                            <strong>
                                {
                                    techniciens.length -
                                    techniciensDisponibles
                                }
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            <div className="dashboard-panel recent-panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Dernières interventions
                        </h3>

                        <span>
                            Les interventions récemment créées
                        </span>

                    </div>

                </div>


                {interventions.length===0 ? (

                    <p className="empty-message">
                        Aucune intervention.
                    </p>

                ) : (

                    <div className="recent-list">

                        {interventions
                            .slice(0,5)
                            .map(intervention=>(

                            <div
                                className="recent-item"
                                key={intervention.id}
                            >

                                <div className="recent-main">

                                    <strong>
                                        {intervention.description}
                                    </strong>

                                    <span>
                                        Client : {
                                            intervention.client_nom ||
                                            "Non renseigné"
                                        }
                                    </span>

                                </div>

                                <span
                                    className={`recent-status ${intervention.statut}`}
                                >
                                    {intervention.statut}
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );
}

export default Dashboard;