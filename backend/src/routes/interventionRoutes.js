const express=require('express');
const router=express.Router();
const {authenticate,authorize}=require("../middleware/auth");
const{create,getClientInterventions,getTechnicienInterventions,updateInterventionStatus,getInterventionById,addRapport,getRapport,addEvaluation,getAllInterventions,affecterTechnicien,autoAffecter}=require('../controllers/interventionController');

router.post('/',authenticate, authorize(['planificateur']),create);
router.get('/client/mes-interventions',authenticate,authorize(['client']),getClientInterventions);
router.get('/technicien/mes-interventions',authenticate,authorize(['technicien']),getTechnicienInterventions);
router.get('/:id',authenticate,authorize(['client','technicien','planificateur']),getInterventionById);
router.put('/:id/statut',authenticate,authorize(['technicien','planificateur']),updateInterventionStatus);
router.put('/:id/rapport',authenticate,authorize(['technicien']),addRapport);
router.get('/:id/rapport',authenticate,authorize(['client','technicien','planificateur']),getRapport);
router.put('/:id/evaluation',authenticate,authorize(['client']),addEvaluation);
router.get('/',authenticate,authorize(['planificateur']),getAllInterventions);
router.put('/:id/affecter',authenticate,authorize(['planificateur']),affecterTechnicien);
router.post('/auto-affecter/:ticketId',authenticate,authorize(['planificateur']),autoAffecter);
module.exports=router;
