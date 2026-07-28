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
export default api;