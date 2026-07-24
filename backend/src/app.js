const express = require("express");
const app = express();
app.use(express.json());

const ticketRoutes= require('./routes/ticketRoutes');
const userRoutes=require('./routes/userRoutes');
const authRoutes=require('./routes/authRoutes');
const interventionRoutes=require('./routes/interventionRoutes');
app.use('/api/tickets',ticketRoutes);
app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/interventions',interventionRoutes);
app.get("/",(req,res)=>{res.send("bienvenue sur mon api");})
app.listen(3000,()=>{console.log("serveur demarre sur le port 3000");});

