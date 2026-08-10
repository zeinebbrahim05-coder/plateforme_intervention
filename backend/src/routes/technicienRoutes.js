const express=require('express');
const router=express.Router();
const{authenticate,authorize}=require("../middleware/auth");
const {updateDisponibilite}=require('../controllers/technicienController');
router.put('/disponibilite',authenticate,authorize(['technicien']),updateDisponibilite);
module.exports=router;