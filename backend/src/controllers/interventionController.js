const Intervention=require('../models/interventionModel');
const create=async(req,res)=>{
    try{
        const {ticket_id,technicien_id,description,adresse,priorite}=req.body;
        const newIntervention=await Intervention.create({ticket_id,technicien_id,description,adresse,priorite});
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
module.exports={create,getClientInterventions,getTechnicienInterventions,getInterventionById,updateInterventionStatus,addRapport,getRapport,addEvaluation};