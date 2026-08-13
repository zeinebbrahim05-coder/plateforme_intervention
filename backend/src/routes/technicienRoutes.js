const express=require('express');
const router=express.Router();
const{authenticate,authorize}=require("../middleware/auth");
const {updateDisponibilite,getAllTechniciens}=require('../controllers/technicienController');
router.put('/disponibilite',authenticate,authorize(['technicien']),updateDisponibilite);
router.get('/',authenticate,authorize(['planificateur']),getAllTechniciens);
module.exports=router;