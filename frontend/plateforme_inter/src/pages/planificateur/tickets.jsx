import {useEffect,useState} from "react";
import {getAllTickets,getAllUsers,
    createIntervention,updateTicketStatus,
    autoAffecter} from "../../services/api";

import PlanNotification from "../../components/PlanNotification";

function Tickets(){

    const [tickets,setTickets]=useState([]);
    const [users,setUsers]=useState([]);

    const [chargement,setChargement]=useState(true);

    const [searchTicket,setSearchTicket]=useState("");
    const [prioriteTicket,setPrioriteTicket]=useState("toutes");
    const [statutTicket,setStatutTicket]=useState("tous");

    const [technicienSelectionne,setTechnicienSelectionne]=useState({});
    const [datePrevue,setDatePrevue]=useState({});
    const [heureDebut,setHeureDebut]=useState({});
    const [heureFin,setHeureFin]=useState({});

    const [notification,setNotification]=useState({
        type:"",
        message:""});

    const afficherNotification=(type,message)=>{
        setNotification({type,message});
        setTimeout(()=>{setNotification({
                type:"",
                message:""
            });
        },3000);
    };

    const chargerDonnees=async()=>{
        try{
            setChargement(true);
            const [ticketsRes, usersRes]=await Promise.all([
                getAllTickets(),
                getAllUsers()
            ]);
            setTickets(ticketsRes.data.tickets||[]);
            setUsers(usersRes.data.users||[] );
        }catch(err){
            afficherNotification( "error",err.response?.data?.message ||"Erreur lors du chargement");
        }finally{
            setChargement(false);
        }
    };

    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        chargerDonnees();},[]);

    const techniciens=users.filter(u=>u.role==="technicien");
    const ticketsFiltres=tickets.filter(ticket=>{
        const recherche= searchTicket.toLowerCase();
        const matchRecherche=ticket.description
                ?.toLowerCase()
                .includes(recherche) ||
            ticket.adresse
                ?.toLowerCase()
                .includes(recherche) ||

            ticket.client_nom
                ?.toLowerCase()
                .includes(recherche);

        const matchPriorite=
            prioriteTicket==="toutes" ||
            ticket.priorite===prioriteTicket;

        const matchStatut=
            statutTicket==="tous" ||
            ticket.statut===statutTicket;

        return(
            matchRecherche &&
            matchPriorite &&
            matchStatut
        );

    });


    const affecter=async(ticket)=>{

        const id=technicienSelectionne[ticket.id];
        if(!id){

            afficherNotification(
                "error",
                "Choisissez un technicien"
            );
            return;
        }
        const date=datePrevue[ticket.id];
        const debut=heureDebut[ticket.id];
        const fin= heureFin[ticket.id];
        if(! date || !debut || !fin){
            afficherNotification("error", "Veuillez choisir date, une heure de debut et une heure de fin");
            return;
        }

        try{
            await createIntervention({
                ticket_id:ticket.id,
                technicien_id:id,
                description:ticket.description,
                adresse:ticket.adresse,
                priorite:ticket.priorite,
                date_prevue: date,
                heure_debut: debut,
                heure_fin: fin
            });

            await updateTicketStatus(
                ticket.id,
                {statut:"affecte"}
            );
            console.log("Ticket affecté :", ticket.id);
            await chargerDonnees();
            setTechnicienSelectionne(
                prev=>({...prev,[ticket.id]:""})
            );
            setDatePrevue(prev => ({
            ...prev,
            [ticket.id]: ""
        }));

            setHeureDebut(prev => ({
                ...prev,
                [ticket.id]: ""
            }));

            setHeureFin(prev => ({
                ...prev,
                [ticket.id]: ""
            }));
            afficherNotification(
                "success",
                "Ticket affecté avec succès"
            );
        }catch(err){
            afficherNotification("error",
                err.response?.data?.message ||
                "Erreur lors de l'affectation"
            );
        }
    };
    const affectationAutomatique=async(ticket)=>{
        try{
            await autoAffecter(ticket.id);
            await chargerDonnees();
            afficherNotification(
                "success",
                "Ticket affecté automatiquement"
            );
        }catch(err){
            afficherNotification(
                "error",
                err.response?.data?.message ||
                "Erreur lors de l'affectation automatique"
            );
        }
    };
    return(
        <div className="plan-page">
            <PlanNotification
                type={notification.type}
                message={notification.message}
                onClose={()=>
                    setNotification({type:"",
                        message:""
                    })
                }
            />
            <div className="page-heading">
                <div>
                    <h2>Tickets</h2>
                    <p>Consultez et gérez les demandes des clients.</p>
                </div>
                <div className="page-count">{tickets.length} tickets</div>
            </div>
            <div className="ticket-filters">
                <input
                    type="text"
                    placeholder="Rechercher un ticket..."
                    value={searchTicket}
                    onChange={e=>setSearchTicket(e.target.value)}/>
                <select value={prioriteTicket}
                    onChange={e=>setPrioriteTicket(e.target.value)}>
                    <option value="toutes">Toutes les priorités</option>
                    <option value="urgent">Urgent</option>
                    <option value="standard">Standard</option>
                </select>
                <select value={statutTicket}
                    onChange={e=>setStatutTicket(e.target.value)}>
                    <option value="tous">Tous les statuts</option>
                    <option value="en attente">En attente</option>
                    <option value="affecte">Affecté</option>
                    <option value="en cours">En cours</option>
                    <option value="termine">Terminé</option>
                </select>
            </div>
            {chargement ? (
                <div className="plan-loading">Chargement des tickets...</div>
            ) : (
                <div className="tickets-list">
                    {ticketsFiltres.length===0 ? (
                        <div className="empty-box">
                            <div>🎫</div>
                            <strong>Aucun ticket trouvé</strong>
                            <span>Essayez de modifier vos filtres.</span>
                        </div>
                    ) : (
                        ticketsFiltres.map(ticket=>(
                            <div className="ticket-card" key={ticket.id}>
                                <div className="ticket-card-top">
                                    <div>
                                        <span className="ticket-id">Ticket #{ticket.id}</span>
                                        <h3>{ticket.description}</h3>
                                    </div>

                                    <span className={`priority-badge ${ticket.priorite}`}>
                                        {ticket.priorite}
                                    </span>
                                </div>
                                <div className="ticket-info">
                                    <div>
                                        <span>CLIENT</span>
                                        <strong>{ticket.client_nom ||"Non renseigné"}</strong>
                                    </div>
                                    <div>
                                        <span>ADRESSE</span>
                                        <strong>
                                            {ticket.adresse}
                                        </strong>
                                    </div>
                                    <div>
                                        <span>STATUT</span>

                                        <strong className={`ticket-status ${ticket.statut.replace(" ","-")}`}>
                                            {ticket.statut}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>DATE</span>

                                        <strong>{ticket.date_creation?
                                                new Date(ticket.date_creation).toLocaleDateString("fr-FR"):"--"}
                                        </strong>
                                    </div>
                                </div>
                                {ticket.statut==="en attente" && (
                                    <div className="ticket-assignment">
                                        <select value={technicienSelectionne[ticket.id] || ""}
                                            onChange={e=>setTechnicienSelectionne({
                                                    ...technicienSelectionne,
                                                    [ticket.id]:
                                                        e.target.value
                                                })
                                            }>
                                            <option value="">
                                                Choisir un technicien
                                            </option>
                                            {techniciens.map(technicien=>(
                                                <option
                                                    key={technicien.user_id ||technicien.id}
                                                    value={technicien.user_id ||technicien.id}>
                                                    {technicien.nom}
                                                </option>
                                            ))}
                                        </select>
                                        <input type="date" value={datePrevue[ticket.id] || ""}
                                        onChange={e=>setDatePrevue({...datePrevue,[ticket.id]:e.target.value})} />
                                        <input type="time" value={heureDebut[ticket.id] || ""}
                                        onChange={e=>setHeureDebut({...heureDebut,[ticket.id]: e.target.value})} />
                                        <input type="time" value={heureFin[ticket.id] || ""}
                                        onChange={e=>setHeureFin({...heureFin, [ticket.id]: e.target.value})} />

                                        <button className="assign-btn" onClick={()=>affecter(ticket)}>
                                            Affecter</button>
                                        <button className="auto-btn"
                                            onClick={()=>affectationAutomatique(ticket)}>
                                            Auto</button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Tickets;