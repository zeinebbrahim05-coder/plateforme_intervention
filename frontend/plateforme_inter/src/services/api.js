import axios from 'axios';
const api=axios.create({
    baseURL:'http://localhost:3000/api',
    headers:{'Content-Type':'application/json',},
});
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token');
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});
export const register=(data)=>api.post('/auth/register',data);
export const login =(data)=>api.post('/auth/login',data);
export const createTicket=(data)=>api.post('/tickets',data);
export const getMyTickets=()=>api.get('/tickets/mes-tickets');
export const getClientInterventions=()=>api.get('/interventions/client/mes-interventions');
export const getRapport=(id)=>api.get(`/interventions/${id}/rapport`);
export const addEvaluation=(id,data)=>api.put(`/interventions/${id}/evaluation`,data);
export const getTechnicienInterventions=()=>api.get('/interventions/technicien/mes-interventions');
export const updateInterventionStatus=(id,data)=>api.put(`/interventions/${id}/statut`,data);
export const addRapport=(id,data)=>api.put(`/interventions/${id}/rapport`,data);
export const getAllTickets=()=>api.get('/tickets');
export const getAllInterventions=()=>api.get('/interventions');
export const getAllUsers=()=>api.get('/users');
export const affecterTechnicien=(id,data)=>api.put(`/interventions/${id}/affecter`,data);
export const updateTicketStatus=(id,data)=>api.put(`/tickets/${id}/statut`,data);
export const updateUserLocation=(latitude, longitude)=>api.put('/users/location',{latitude,longitude});
export default api;