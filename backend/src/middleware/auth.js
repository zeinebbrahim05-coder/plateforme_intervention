const jwt=require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authenticate=async(req,res,next)=>{
    try{

        const token=req.headers.authorization.split(' ')[1];
        const checkToken=jwt.verify(token, process.env.JWT_SECRET);
        req.user=checkToken;
        next();
    }catch(error){
        console.error(error);
        return res.status(401).json({
            success:false,
            message:"token invalide ou expiré"
        });
    }
};

const authorize=(roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success:false,
                message:"accès refusé "
            });
        }
        next();
    }
}
module.exports={authenticate,authorize};