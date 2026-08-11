
const User=require("../models/userModel");
const Technicien = require("../models/technicienModel");
const getUsers = async(req,res)=>{
    try{
    const users = await User.findAll();
    res.status(200).json({
        success:true,
        users
    });
}catch(error){
    console.error(error);
    return res.status(500).json({
        success:false,
        message:"erreur lors de la recperation des users"
    });
    }
}
const getUsersById= async(req,res)=>{
    try{
        const {id} = req.params;
        const user= await User.findById(id);
        if(!user){
            return res.status(404).json({
            success:false,
            message:"utilisateur introuvable"
            });      
        }
        
        return res.status(200).json({
        success:true,
        user
    });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la recuperation du user"
        });
    }
    };
const bcrypt = require('bcrypt');
const createUser=async(req,res)=>{
    try{
        const{nom,email,password,role,telephone,adresse}=req.body;
        const checkuser=await User.findByEmail(email);
        if(checkuser){
            return res.status(400).json({
                success:false,
                message:"email existe deja"
            });
        }
        const hashedPassword= await bcrypt.hash(password,10);
        const newuser= await User.create({nom,email,password : hashedPassword,role,telephone,adresse});
        if(role === 'technicien'){
            await Technicien.create(newuser);
        }
        return res.status(201).json({
            success:true,
            message:"utilisateur crée avec succès",
            userId:newuser
                
            })
        

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de creation"
        });

    }
};

const updateUser=async(req,res)=>{
    try{
        const{id}=req.params;
        const{nom,email,telephone,adresse, competences, disponible}=req.body;
        const checkuser= await User.findById(id);
        if(!checkuser){
            return res.status(404).json({
                success:false,
                message:"utilisateur n'esxiste pas"
            });
        }
        await User.update(id,{nom,email,telephone,adresse});
        if(checkuser.role ==='technicien' && competences !== undefined && disponible !== undefined){
            await Technicien.updateInfos(id, competences, disponible);
        }
        return res.status(200).json({
            success:true,
            message:"utilisateur modifié avec succée"

            });
        
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la modification"
        });
    }

};

const deleteUser=async(req,res)=>{
    try{
        const{id}=req.params;
        const checkuser= await User.findById(id);
        if(!checkuser){
            return res.status(404).json({
                success:false,
                message:"utilisateur n'existe pas"
            });
        }
        if(checkuser.role ==='technicien'){
            await Technicien.delete(id);
        }
        await User.delete(id);
        return res.status(200).json({
            success:true,
            message:"utilisateur supprimé"
        });
        
    }catch(error){
        console.error(error);
        if(error.code=== 'ER_ROW_IS_REFERENCED_2'){
            return res.status(400).json({
                success:false,
                message:"impossible de supprimer: cet utilisateur a des tickets ou interventions liés"
            });
        }
        return res.status(500).json({
            success:false,
            message:"erreur lor de la suppression"
        });
    }
};
const updateUserLocation=async(req,res)=>{
    try{
        console.log("req.user: ",req.user);
        const userId=req.user.id;
        const{latitude, longitude}=req.body;
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                success: false,
                message: "Coordonnées invalides"
            });
        }
        await User.updateLocation(userId,latitude,longitude);
        return res.status(200).json({
            success: true,
            message: "position mise a jour avec succès"
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la mise a jour de la position"
        });
    }
};

module.exports={getUsers,getUsersById,createUser,updateUser,deleteUser, updateUserLocation};



