const pool= require('../config/database');
const Intervention={
    create: async(interventionData)=>{
        const{ticket_id,technicien_id,description,adresse,priorite}=interventionData;
        const[result]=await pool.execute("insert into interventions(ticket_id,technicien_id,description,adresse,priorite) values(?,?,?,?,?)",[ticket_id,technicien_id,description,adresse,priorite ||"standard"]);
        return result.insertId;
    },

    findByTechnicienId: async(technicien_id)=>{
        const[rows]=await pool.execute(`select interventions.*,client.nom as client_nom, technicien.nom as technicien_nom, tickets.description as ticket_description
             from interventions
              join tickets on interventions.ticket_id=tickets.id
               join users as client on tickets.client_id=client.id
                join users as technicien on interventions.technicien_id=technicien.id
                 where interventions.technicien_id=?`,[technicien_id]);
        return rows;
    },
    findById:async(id)=>{
        const[rows]=await pool.execute(`select interventions.*,technicien.nom as technicien_nom, tickets.description as ticket_description, tickets.client_id
            from interventions
            join tickets on interventions.ticket_id=tickets.id
            join users as technicien on interventions.technicien_id=technicien.id
            where interventions.id=?`,[id]);
            return rows[0];

    },
    findByClientId:async(client_id)=>{
        const[rows]=await pool.execute(`select interventions.*, technicien.nom as technicien_nom, tickets.description as ticket_description
            from interventions
            join tickets on interventions.ticket_id=tickets.id
            join users as technicien on interventions.technicien_id=technicien.id
            where tickets.client_id=?`,[client_id]);
            return rows;
    },
    updateStatus:async(id,statut)=>{
        const[result]=await pool.execute("update interventions set statut=? where id =?",[statut,id]);
        return result.affectedRows>0;

    },
    updateRapport:async(id,rapport)=>{
        const[result]=await pool.execute("update interventions set rapport=? where id=?",[rapport,id]);
        return result.affectedRows>0;
    },
    updateEvaluation:async(id,note, commentaire)=>{
        const[result]= await pool.execute("update interventions set note=?,commentaire=? where id=?",[note,commentaire,id]);
        return result.affectedRows>0;
    }
};
module.exports =Intervention;
