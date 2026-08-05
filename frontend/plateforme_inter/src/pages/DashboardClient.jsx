import { useState, useEffect } from "react";
import{createTicket, getMyTickets,getClientInterventions,getRapport,addEvaluation,updateUserLocation} from '../services/api';
import"../styles/DashboardClient.css";
import Header from "../components/header";
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
    const[evaluations,setEvaluations]=useState({});


    useEffect(()=>{
        const fetchTickets=async()=>{
            setErreur("");
            try{
                const response=await getMyTickets();
                setTickets(response.data.tickets);
            }catch(err){
                setErreur("erreur lors du chargement des tickets");
            }
        };
        const fetchInterventions=async()=>{
            setErreur("");
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
            const response=await getMyTickets();
            setTickets(response.data.tickets);
            setTimeout(()=>{setSuccess(false);},3000);


        }catch(err){
            setErreur(err.response?.data?.message||'Erreur lors de creation du ticket ');
        }finally{
            setChargement(false);
        }
    }
    const handleVoirRapport=async(id)=>{
        setErreur("");
        try{
            setRapport(null);
            const response=await getRapport(id);
            setRapport(response.data.rapport);
        }catch(err){
            setErreur("erreur lors du chargement du rapport");
        }
    };
    const handleEvaluation=async(id,note,commentaire)=>{
        setErreur("");
        try{
            await addEvaluation(id,{note,commentaire});
            setEvaluations((prev) => ({...prev,[id]: {note: 5,commentaire: ""}}));
            const response=await getClientInterventions();
            setInterventions(response.data.intervention);
        }catch(err){
            setErreur("erreur lors de l'ajout de l'evaluation");
        }
    }
    const shareLocation=()=>{
        if(!navigator.geolocation){
            setErreur("la géocalisation n'est pas supportée par votre navigateur");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async(position)=>{
                const{latitude, longitude}=position.coords;
                try{
                    await updateUserLocation(latitude, longitude);
                    setSuccess("Position partagée avec succès");
                    setTimeout(()=>setSuccess(false),3000);
                }catch(err){
                    setErreur("erreur lors de l'envoi de la position");
                }
                
            },
            (error)=>{
                setErreur("accès a la position refusé ou indisponible");
            }
        );
    };
    return (
        <>
        <Header/>
        <div className="dashboard-container">
            <h1>Dashboard Client</h1>
            <p>Bienvenue sur votre espace client.</p>
            {erreur && <p className="error">{erreur}</p>}
            {success && <p className="success">Ticket créé avec succès.</p>}
            <div className="section">
                <h2>Créer un ticket</h2>
                <form onSubmit={handleSubmitTicket}>
                    <input type="text" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} required/>
                    <input type="text" placeholder="Adresse" value={adresse} onChange={(e)=>setAdresse(e.target.value)} required/>
                    <select value={priorite} onChange={(e)=>setPriorite(e.target.value)}>
                        <option value="standard">Standard</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <button className="btn btn-info" onClick={shareLocation}>Partager ma position</button>
                    <button type="submit" className="btn btn-primary">Créer un ticket</button>
                </form>
            </div>
            <div className="section">
                <h2>Mes Tickets</h2>
                {tickets.length===0?(
                    <p>Aucun ticket pour le moment</p>
                ):(
                    <ul>{tickets.map((ticket)=>(
                        <li key={ticket.id} className="card">
                            <h3>{ticket.description}</h3>
                            <p><strong>Adresse :</strong> {ticket.adresse}</p>
                            <p><strong>Priorité :</strong> {ticket.priorite}</p></li>
                    ))}</ul>
                )}
            </div>
            <div className="section">
            <h2>Mes interventions</h2>
            {interventions.length===0?(
                <p>Aucune intervention pour le moment</p>
            ):(
                <ul>{interventions.map((intervention)=>(
                    <li key={intervention.id} className="card">

                    <h3>{intervention.description}</h3>

                    <p><strong>Statut :</strong>{" "}
                        <span className={`status ${intervention.statut}`}>
                            {intervention.statut}</span>
                    </p>

                    <p><strong>Technicien :</strong>{" "} {intervention.technicien_nom || "Pas encore affecté"}</p>
                    <button onClick={() => handleVoirRapport(intervention.id)}className="btn btn-primary">Voir le rapport</button>
                    {intervention.statut === "termine" && (
                        <div className="evaluation">
                            <h4>Évaluer cette intervention</h4>
                            <select
                                value={evaluations[intervention.id]?.note || 5}
                                onChange={(e) =>setEvaluations({...evaluations,[intervention.id]: { ...evaluations[intervention.id],
                                         note: Number(e.target.value)}})}>
                                <option value="1">1 ⭐</option>
                                <option value="2">2 ⭐⭐</option>
                                <option value="3">3 ⭐⭐⭐</option>
                                <option value="4">4 ⭐⭐⭐⭐</option>
                                <option value="5">5 ⭐⭐⭐⭐⭐</option>
                            </select>

                            <input type="text" placeholder="Votre commentaire..." value={evaluations[intervention.id]?.commentaire || ""}
                                onChange={(e) =>setEvaluations({
                                        ...evaluations, [intervention.id]: {...evaluations[intervention.id],commentaire: e.target.value}})}/>

                            <button onClick={() =>handleEvaluation(intervention.id,
                                        evaluations[intervention.id]?.note || 5,
                                        evaluations[intervention.id]?.commentaire || "")}className="btn btn-success">
                                Envoyer l'évaluation
                            </button>

                        </div>
                    )}

                </li>

                ))}</ul>
            )}
            </div>
            {rapport&&(
                <div className="section">
                    <h3>Rapport de l'intervention</h3>
                    <p>{rapport}</p>
                </div>
            )}
        </div>
        </>
    );
}

export default DashboardClient;