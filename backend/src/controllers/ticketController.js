const Ticket = require("../models/ticketModel");

const createTicket = async(req,res)=>{
    try{
        const client_id=req.user.id;
        const {description, adresse, priorite}= req.body;
        const ticketId = await Ticket.create({
            client_id, description, adresse, priorite
        });
        return res.status(201).json({
            success:true,
            message:"Ticket créé avec succès",
            ticketId
        });


    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la creation du ticket"
        });
    }
    
};
const getMyTickets=async(req,res)=>{
    try{
        const client_id=req.user.id;
        const tickets=await Ticket.findByClientId(client_id);
        return res.status(200).json({
            success:true,
            tickets
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la recuperation des tickets"
        })
    }
};
const getTicketById=async(req,res)=>{
    try{
        const {id}=req.params;
        const ticket=await Ticket.findById(id);
        if(!ticket){
            return res.status(404).json({
                success:false,
                message:"ticket non trouvé"
            });
        }
        if(req.user.role==='client' && ticket.client_id!==req.user.id){
            return res.status(403).json({
                success:false,
                message:"accès refusé"
            });
        }
        return res.status(200).json({
            success:true,
            ticket
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la recuperation du ticket"
        });
    }
};
const updateTicketStatus=async(req,res)=>{
    try{
        const {id}=req.params;
        const newStatut=req.body.statut;
        const statutValide=['en attente','affecte', 'en cours', 'termine'];
        if(!statutValide.includes(newStatut)){
            return res.status(400).json({
                success:false,
                message:"la statut n'est pas valide"
            });
        }
        const checkTicket=await Ticket.findById(id);
        if(!checkTicket){
            return res.status(404).json({
                success:false,
                message:"ticket non trouvé"
            });
        }
        await Ticket.updateStatus(id,newStatut);
        return res.status(200).json({
            success:true,
            message:"statut modifié avec succée"
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la modification du statut"
        });

    }
};
const getAllTickets=async(req,res)=>{
    try{
        const tickets=await Ticket.findAll();
        return res.status(200).json({
            success:true,
            tickets
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"erreur lors de la recuperation des tickets"
        });
    }
};
module.exports={createTicket,getMyTickets,getTicketById,updateTicketStatus,getAllTickets};

