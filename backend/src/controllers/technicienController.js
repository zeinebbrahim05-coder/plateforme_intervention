const Technicien = require('../models/technicienModel');
const updateDisponibilite=async(req,res)=>{
    try{
        const userId=req.user.id;
        const{disponible}=req.body;
        if(typeof disponible!=='boolean'){
            return res.status(400).json({success:false,
                message:"valeur disponible invalide"
            });
        }
        await Technicien.updateDisponibilite(userId,disponible);
        return res.status(200).json({
            success:true,
            message:"disponibilté mise a jour "
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la mise a jour"
        });
    }
}
const getAllTechniciens = async(req,res)=>{
    try{
        const techniciens = await Technicien.findAll();
        return res.status(200).json({
            success:true,
            techniciens
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la recuperation des techniciens"
        });
    };
}
module.exports={updateDisponibilite, getAllTechniciens};