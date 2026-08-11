
const User=require("../models/userModel");
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
        const hashedPassword = await bcrypt.hash(password, 10);
        if(checkuser){
            return res.status(400).json({
                success:false,
                message:"email existe deja"
            });
        }
        const newuser= await User.create({nom,email,password : hashedPassword,role,telephone,adresse});
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
        const{nom,email,telephone,adresse}=req.body;
        const checkuser= await User.findById(id);
        if(!checkuser){
            return res.status(404).json({
                success:false,
                message:"utilisateur n'esxiste pas"
            });
        }
        await User.update(id,{nom,email,telephone,adresse});
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
        await User.delete(id);
        return res.status(200).json({
            success:true,
            message:"utilisateur supprimé"
        });
        
    }catch(error){
        console.error(error);
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



