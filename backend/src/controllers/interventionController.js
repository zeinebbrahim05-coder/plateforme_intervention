const Intervention=require('../models/interventionModel');
const Ticket = require('../models/ticketModel');
const Technicien = require('../models/technicienModel');
const {distanceKm}=require('../utils/distance');
const{scoreFinal}=require('../utils/scoring');
const User = require('../models/userModel');
const create=async(req,res)=>{
    try{
        const {ticket_id,technicien_id,description,adresse,priorite}=req.body;
        const existante= await Intervention.findByTicketId(ticket_id);
        if(existante){
            return res.status(400).json({
                success:false,
                message:"une intervention existe deja pour ce ticket"
            });
        }
        const technicienUser=await User.findById(technicien_id);
        if(!technicienUser){
            return res.status(404).json({
                success:false,
                message:"technicien introuvable"
            });
        }
        const technicienInfo= await Technicien.findByUserId(technicien_id);
        if(!technicienInfo|| !technicienInfo.disponible){
            return res.status(400).json({
                success:false,
                message:"ce technicien n'est pas disponible"
            });
        }
        const newIntervention=await Intervention.create({ticket_id,technicien_id,description,adresse,priorite});
        await Technicien.updateDisponibilite(technicien_id,false);
        await Ticket.updateStatus(ticket_id,'affecte');
        return res.status(201).json({
            success:true,
            message:"intervention crée avec succée",
            interventionId:newIntervention
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la creation de l'interventions"
        });
    }
}
const getTechnicienInterventions=async(req,res)=>{
    try{
        const id=req.user.id;
        const intervention=await Intervention.findByTechnicienId(id);
        return res.status(200).json({
            success:true,
            intervention
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la recuperation des interventions du technicien"
        });
    }
}
const getInterventionById=async(req,res)=>{
    try{
        const id=req.params.id;
        const intervention=await Intervention.findById(id);
        if(!intervention){
            return res.status(404).json({
                success:false,
                message:"intervention non trouvé"
            });
        }

        if(req.user.role !== 'planificateur'&& intervention.technicien_id!==req.user.id && intervention.client_id !==req.user.id){
            return res.status(403).json({
                success:false,
                message:"Accès refusé"
            });
        }
        return res.status(200).json({
            success:true,
            intervention
        });

    }catch(error){
                console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la recuperation d'intervention"
        });
    }
    }

const getClientInterventions=async(req,res)=>{
    try{
        const id=req.user.id;
        const intervention=await Intervention.findByClientId(id);
        return res.status(200).json({
            success:true,
            intervention
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la recuperation des interventions du client"
        });
    }
}
const updateInterventionStatus=async(req,res)=>{
    try{
        const id=req.params.id;
        const newStatut=req.body.statut;
        const statutValid=['en attente','affecté','en cours','termine'];
        if(!statutValid.includes(newStatut)){
            return res.status(400).json({
                success:false,
                message:"statut invalide"
            });
        }
        const checkIntervention=await Intervention.findById(id);
        if(!checkIntervention){
            return res.status(404).json({
                success:false,
                message:"intervention non trouvé"
            });
        }
        await Intervention.updateStatus(id,newStatut);
        const statutTicket=newStatut==='affecté' ?'affecte': newStatut;
        await Ticket.updateStatus(checkIntervention.ticket_id,statutTicket);
        if(newStatut==='termine'&& checkIntervention.technicien_id){
            await Technicien.updateDisponibilite(checkIntervention.technicien_id,true);
        }
        return res.status(200).json({
            success:true,
            message:"statut modifié"
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la modification du statut"
        });
    }
}
const addRapport=async(req,res)=>{
    try{
        const id=req.params.id;
        const rapport=req.body.rapport;
        const checkIntervention=await Intervention.findById(id);
        if(!checkIntervention){
            return res.status(404).json({
                success:false,
                message:"intervention non trouvé"
            });
        }
        await Intervention.updateRapport(id,rapport);
        return res.status(200).json({
            success:true,
            message:"rapport ajouté",
            rapport
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"erreur lors du recuperation du rapport"
        });
    }
}
const getRapport=async(req,res)=>{
    try{
        const id=req.params.id;
        const intervention=await Intervention.findById(id);
        if(!intervention){
            return res.status(404).json({
                success:false,
                message:"intervention non trouvée"
            });
        }
        if(!intervention.rapport){
            return res.status(404).json({
                success:false,
                message:"aucun rapport disponible pour cette intervention"
            });
        }
        return res.status(200).json({
            success:true,
            rapport:intervention.rapport,
            intervention:{
                id:intervention.id,description:intervention.description,statut:intervention.statut
            }
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de recuperation du rapport"
        });
    }
}
const addEvaluation=async(req,res)=>{
    try{
        const id= req.params.id;
        const{note,commentaire}=req.body;
        if(!note||note<1||note>5){
            return res.status(400).json({
                success:false,
                message:"la note doit etre comprise entre 1 et 5"
            });
        }
        const intervention = await Intervention.findById(id);
        if(!intervention){
            return res.status(404).json({
                success:false,
                message:"intervention non trouvée"
            });
        }
        await Intervention.updateEvaluation(id, note,commentaire||null);
        return res.status(200).json({
            success:true,
            message:"evaluation ajoutée avec succès"
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de l'ajout de l'evaluation"
        });

    }
}
const getAllInterventions = async (req, res) => {
    try {
        const interventions = await Intervention.findAll();

        return res.status(200).json({
            success: true,
            interventions
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des interventions"
        });
    }
};
const affecterTechnicien=async(req,res)=>{
    try{
        console.log('req.params:',req.params);
        console.log('req.body:',req.body);
        const id =req.params.id;
        const{technicien_id}=req.body;
        const intervention=await Intervention.findById(id);
        if(!intervention){
            return res.status(404).json({
                success: false,
                message:"intervention non trouvée"
            });

        }
        await Intervention.updateTechnicien(id,technicien_id);
        return res.status(200).json({
            success:true,
            message:"technicien affecté avec succès"
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de l'affectation"
        });
    }
};
const autoAffecter=async(req,res)=>{
    try{
        const ticketId=req.params.ticketId;
        const ticket=await Ticket.findByIdWithLocation(ticketId);
        if(!ticket){
            return res.status(404).json({success:false,message:"ticket non trouvé"});
        }
        const existante=await Intervention.findByTicketId(ticket.id);
        if(existante){
            return res.status(400).json({
                success:false,
                message:"une intervention existe deja pour ce ticket"
            });
        }
        if (ticket.client_latitude===null||ticket.client_longitude===null){
            return res.status(400).json({success:false,message:"position du client inconnue, affectation automatique impossible"});
        }
        const disponible=await Technicien.findDisponible();
        if(disponible.length===0){
            return res.status(404).json({success:false,
                message:"aucun technicien disponible"
            });
        }
        const avecDistance=disponible.map(t=>({
            ...t, distance:distanceKm(ticket.client_latitude,ticket.client_longitude, t.latitude, t.longitude)
        }));
        const distanceMax = Math.max(...avecDistance.map(t=>t.distance), 0.0001);

        const avecScore = avecDistance.map(t=>{
            const { score, detail } = scoreFinal({
                distance: t.distance,
                distanceMax,
                competences: t.competences,
                description: ticket.description,
                chargeActuelle: t.charge_actuelle,
                priorite: ticket.priorite
            });
            return { ...t, score, detail };
        });
        avecScore.sort((a,b)=>b.score - a.score);
        const meilleur=avecScore[0];
        const interventionId=await Intervention.create({
            ticket_id:ticket.id, technicien_id:meilleur.user_id,
            description:ticket.description,
            adresse:ticket.adresse,
            priorite: ticket.priorite
        });
        await Ticket.updateStatus(ticket.id,'affecte');
        await Technicien.updateDisponibilite(meilleur.user_id, false);
        return res.status(201).json({
            success:true,
            message:"techncien affecté automatiquement",
            interventionId,
            technicien:{id: meilleur.user_id, nom:meilleur.nom, distance_km:Math.round(meilleur.distance*10)/10,
                score: Math.round(meilleur.score*100)/100,
                charge_actuelle:meilleur.charge_actuelle,
                detail_score: meilleur.detail
            }
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de laffectation automatique"
        });
    }
};
module.exports={create,getClientInterventions,getTechnicienInterventions,getInterventionById,updateInterventionStatus,addRapport,getRapport,addEvaluation,getAllInterventions,affecterTechnicien,autoAffecter};