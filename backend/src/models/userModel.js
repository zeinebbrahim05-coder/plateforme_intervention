const pool = require("../config/database");
const User ={
    findAll:async()=>{
        const[rows]=await pool.execute("SELECT id,nom,email,role,telephone,adresse,created_at,updated_at from users");
        return rows;
    },
    findById: async(id)=>{
        const[rows]=await pool.execute("SELECT id,nom,email,role,telephone,adresse,created_at,updated_at FROM users WHERE id =?",[id]);
        return rows[0];

    },
    findByEmail:async(email)=>{
        const [rows]=await pool.execute("SELECT * FROM users WHERE email=?",[email]);
        return rows[0];
    },

    create : async(userData)=>{
        const{nom, email, password, role, telephone, adresse}=userData
        const[result]= await pool.execute("INSERT INTO users(nom,email,password,role,telephone,adresse) VALUES(?,?,?,?,?,?)",[nom,email,password,role,telephone,adresse]);
        return result.insertId;
    },
    update: async(id,userData)=>{
        const{nom,email,telephone,adresse}=userData;
        const[result]= await pool.execute("UPDATE users SET nom=?, email=?, telephone=?, adresse=? WHERE id=?",[nom,email,telephone,adresse,id]);
        return result.affectedRows>0;
    },
    delete: async(id)=>{
        const[result]=await pool.execute("DELETE FROM users WHERE id =?",[id]);
        return result.affectedRows > 0;
    }
};
module.exports=User;