const pool= require('../config/database');
const Intervention={
    create: async(interventionData)=>{
        const{ticket_id,technicien_id,description,adresse,priorite,date_prevue,heure_debut,heure_fin}=interventionData;
        const[result]=await pool.execute("insert into interventions(ticket_id,technicien_id,description,adresse,priorite,statut, date_prevue, heure_debut, heure_fin) values(?,?,?,?,?,?,?,?,?)",[ticket_id,technicien_id,description,adresse,priorite ||"standard" ,"affecté", date_prevue,heure_debut,heure_fin]);
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
    },
    findAll: async () => {
    const [rows] = await pool.execute(`
        SELECT interventions.*,
               client.nom AS client_nom,
               technicien.nom AS technicien_nom
        FROM interventions
        JOIN tickets
            ON interventions.ticket_id = tickets.id
        JOIN users AS client
            ON tickets.client_id = client.id
        JOIN users AS technicien
            ON interventions.technicien_id = technicien.id
    `);

    return rows;
},
updateTechnicien: async (id, technicien_id) => {
    const [result] = await pool.execute(
        "UPDATE interventions SET technicien_id = ? WHERE id = ?",
        [technicien_id, id]
    );
    return result.affectedRows > 0;
},
findByTicketId: async(ticket_id)=>{
    const [rows] = await pool.execute("SELECT * FROM interventions WHERE ticket_id = ?",[ticket_id]);
    return rows[0];
},
findByWeek: async (dateDebut, dateFin) => {

    const [rows] = await pool.execute(`
        SELECT 
            i.*,
            client.nom AS client_nom,
            technicien.nom AS technicien_nom,
            t.description AS ticket_description
        FROM interventions i

        JOIN tickets t
            ON i.ticket_id = t.id

        JOIN users AS client
            ON t.client_id = client.id

        LEFT JOIN users AS technicien
            ON i.technicien_id = technicien.id

        WHERE i.date_prevue >= ?
        AND i.date_prevue < DATE_ADD(?, INTERVAL 1 DAY)

        ORDER BY i.date_prevue, i.heure_debut
    `, [
        dateDebut,
        dateFin
    ]);

    return rows;
},
findByMonth: async (annee, mois) => {

    const dateDebut = `${annee}-${String(mois).padStart(2, "0")}-01`;

    const dateFin = new Date(
        annee,
        mois,
        1
    );

    const dateFinSQL =
        `${dateFin.getFullYear()}-${String(
            dateFin.getMonth() + 1
        ).padStart(2, "0")}-${String(
            dateFin.getDate()
        ).padStart(2, "0")}`;

    const [rows] = await pool.execute(`
        SELECT
            i.*,
            client.nom AS client_nom,
            technicien.nom AS technicien_nom,
            t.description AS ticket_description
        FROM interventions i

        JOIN tickets t
            ON i.ticket_id = t.id

        JOIN users AS client
            ON t.client_id = client.id

        LEFT JOIN users AS technicien
            ON i.technicien_id = technicien.id

        WHERE i.date_prevue >= ?
        AND i.date_prevue < ?

        ORDER BY i.date_prevue, i.heure_debut
    `, [
        dateDebut,
        dateFinSQL
    ]);

    return rows;
},
findByTechnicienIdPourPlanning: async (technicien_id) => {

    const [rows] = await pool.execute(`
        SELECT
            id,
            date_prevue,
            heure_debut,
            heure_fin
        FROM interventions
        WHERE technicien_id = ?
        AND date_prevue IS NOT NULL
        ORDER BY date_prevue, heure_debut
    `, [technicien_id]);

    return rows;
},
};

module.exports =Intervention;
