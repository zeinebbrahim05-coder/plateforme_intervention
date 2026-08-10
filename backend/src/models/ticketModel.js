const pool = require("../config/database");

const Ticket ={
    create: async(ticketData)=>{
        const {client_id,description,adresse,priorite}=ticketData;
        const[result]=await pool.execute("INSERT INTO tickets(client_id,description,adresse,priorite) VALUES(?,?,?,?)",
        [client_id,description,adresse,priorite ||"standard"]);
        return result.insertId;


    },
    findByClientId: async(client_id)=>{
        const [rows]= await pool.execute(`select tickets.*, users.nom as client_nom from tickets join users on
            tickets.client_id = users.id where tickets.client_id=?`,[client_id]);
            return rows;

    },
    findById:async(id)=>{
        const [rows]=await pool.execute("select tickets.*,users.nom as client_nom from tickets join users on tickets.client_id= users.id where tickets.id=?",[id]);
        return rows[0];
    },
    updateStatus:async(id,statut)=>{
        const[result]= await pool.execute("UPDATE tickets set statut=? WHERE id=?",[statut,id]);
        return result.affectedRows>0;
    },
    findAll:async()=>{
        const[rows]=await pool.execute("SELECT tickets.*, users.nom as client_nom FROM tickets join users on tickets.client_id=users.id ");
        return rows;
    },
    findByIdWithLocation:async(id)=>{
        const[rows]=await pool.execute(`select tickets.*, users.latitude as client_latitude, users.longitude as client_longitude
            from tickets
            join users on tickets.client_id=users.id where tickets.id=?`,[id]);
            return rows[0];
    }

};
module.exports=Ticket;
