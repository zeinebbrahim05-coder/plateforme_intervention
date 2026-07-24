const User= require("../models/userModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const register= async(req,res)=>{
    try{
        const{nom,email,password,role,telephone,adresse}=req.body;
        const checkUser=await User.findByEmail(email);
        if(checkUser){
            return res.status(400).json({
                success:false,
                message:"email déjà utilisé"
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const userId=await User.create({
            nom,email,password:hashedPassword,role:role ||"client",telephone,adresse
        });
        return res.status(201).json({
            success:true,
            message:"inscription réussie",
            userId
        });
            
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de l'inscription"
        });
    }


};
const login =async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findByEmail(email);
        if(!user){
            return res.status(401).json({
                success:false,
                message:"email n'existe pas"
            });
        }
        const isValid=await bcrypt.compare(password,user.password);
        if(!isValid){
            return res.status(401).json({
                success:false,
                message:"mot de passe incorrcete"
            });
        }
        const token=jwt.sign({id:user.id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:'24h'});
        return res.status(200).json({
            success:true,
            token,
            user:{id:user.id,nom:user.nom,email:user.email,role:user.role}
        });


    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors du login"
        });
    }

};
module.exports={register,login};

