const pool = require("../config/database");
const Technicien={
    findDisponible: async()=>{
        const [rows]=await pool.execute(`select techniciens.id, techniciens.user_id, techniciens.competences,
            techniciens.disponible, users.latitude, users.longitude, users.nom
            from techniciens join users on techniciens.user_id=users.id
            where techniciens.disponible=true
            and users.latitude is not null
            and users.longitude is not null`);
        return rows;
    },
    create: async(user_id)=>{
        const [result]= await pool.execute(
            "insert into techniciens(user_id, competences, disponible) values(?,'',true)",
            [user_id]
        );
        return result.insertId;
    },
    updateDisponibilite:async(user_id,disponible)=>{
        const[result]=await pool.execute(
            "update techniciens set disponible=? where user_id=?",
            [disponible,user_id]
        );
        return result.affectedRows>0;
    },
    findByUserId: async(user_id)=>{
    const [rows] = await pool.execute("SELECT * FROM techniciens WHERE user_id = ?",[user_id]);
    return rows[0];
},
};
module.exports=Technicien;