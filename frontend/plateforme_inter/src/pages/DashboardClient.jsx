import { useState, useEffect } from "react";
import{createTicket, getMyTickets,getClientInterventions,getRapport,addEvaluation} from '../services/api';
function DashboardClient() {
    const[description,setDescription]=useState("");
    const[adresse,setAdresse]=useState("");
    const[priorite,setPriorite]=useState("standard");
    const [chargement, setChargement]=useState(false);
    const [erreur,setErreur]=useState("");
    const [success,setSuccess]=useState(false);
    const[tickets,setTickets]=useState([]);
    const[interventions,setInterventions]=useState([]);
    const[rapport,setRapport]=useState(null);
    const[interventionId,setInterventionId]=useState(null);
    const [note, setNote] = useState(5);
    const [commentaire, setCommentaire] = useState("");

    useEffect(()=>{
        const fetchTickets=async()=>{
            try{
                const response=await getMyTickets();
                setTickets(response.data.tickets);
            }catch(err){
                setErreur("erreur lors du chargement des tickets");
            }
        };
        const fetchInterventions=async()=>{
            try{
                const response=await getClientInterventions();
                setInterventions(response.data.intervention);
            }catch(err){
                setErreur("erreur lors du chargement des interventions");
            }
        };
        fetchTickets(), fetchInterventions();
    },[]);

    const handleSubmitTicket=async(e)=>{
        e.preventDefault();
        setChargement(true);
        setErreur('');
        try{
            await createTicket({description,adresse,priorite});
            setSuccess(true);
            setDescription('');setAdresse('');setPriorite('standard');
            setTickets([]);
            const response=await getMyTickets();
            setTickets(response.data.tickets);


        }catch(err){
            setErreur(err.response?.data?.message||'Erreur lors de creation du ticket ');
        }finally{
            setChargement(false);
        }
    }
    const handleVoirRapport=async(id)=>{
        try{
            setRapport(null);
            const response=await getRapport(id);
            setRapport(response.data.rapport);
            setInterventionId(id);
        }catch(err){
            setErreur("erreur lors du chargement du rapport");
        }
    };
    const handleEvaluation=async(id,note,commentaire)=>{
        try{
            await addEvaluation(id,{note,commentaire});
            const response=await getClientInterventions();
            setInterventions(response.data.intervention);
        }catch(err){
            setErreur("erreur lors de l'ajout de l'evaluation");
        }
    }
    return (
        <div className="dashboard-container">
            <h1>Dashboard Client</h1>
            <p>Bienvenue sur votre espace client.</p>
            <div className="section">
                <h2>Créer un ticket</h2>
                <form onSubmit={handleSubmitTicket}>
                    <input type="text" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
                    <input type="text" placeholder="Adresse" value={adresse} onChange={(e)=>setAdresse(e.target.value)} />
                    <select value={priorite} onChange={(e)=>setPriorite(e.target.value)}>
                        <option value="standard">Standard</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <button type="submit" className="btn btn-primary">Créer un ticket</button>
                </form>
            </div>
            <div className="section">
                <h2>Mes Tickets</h2>
                {tickets.length===0?(
                    <p>Aucun ticket pour le moment</p>
                ):(
                    <ul>{tickets.map((ticket)=>(
                        <li key={ticket.id}>{ticket.description}-{ticket.adresse}-{ticket.priorite}</li>
                    ))}</ul>
                )}
            </div>
            <div className="section">
            <h2>Mes interventions</h2>
            {interventions.length===0?(
                <p>Aucune intervention pour le moment</p>
            ):(
                <ul>{interventions.map((intervention)=>(
                    <li key={intervention.id}>{intervention.description}-{intervention.statut}-{intervention.technicien_nom ?intervention.technicien_nom :("pas encore affecté")}
                    <button onClick={()=>handleVoirRapport(intervention.id)}>voir rapport</button>
                    {intervention.statut === "termine" && (
                        <div>
                            <h4>Évaluer cette intervention</h4>
                            <select onChange={(e) => setNote(e.target.value)}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <input type="text" placeholder="Commentaire" onChange={(e) => setCommentaire(e.target.value)} />
                            <button onClick={() => handleEvaluation(intervention.id, note, commentaire)}>
                                Envoyer l'évaluation
                            </button>
                        </div>
        )}
                    </li>


                ))}</ul>
            )}
            </div>
            {rapport&&(
                <div>
                    <h3>Rapport de l'intervention</h3>
                    <p>{rapport}</p>
                </div>
            )}
        </div>
    );
}

export default DashboardClient;