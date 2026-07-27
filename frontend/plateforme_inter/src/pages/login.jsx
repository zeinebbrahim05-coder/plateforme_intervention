import { useState } from "react";
import{useNavigate,Link} from 'react-router-dom';
import { login } from "../services/api";

function Login(){
    const [email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [erreur,setErreur]=useState("");
    const [chargement, setChargement]=useState(false);
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setErreur('');
        setChargement(true);
        try{
            const reponse=await login({email,password});
            localStorage.setItem('token',reponse.data.token);
            localStorage.setItem('user',JSON.stringify(reponse.data.user));

            const role= reponse.data.user.role;
            if(role==='client')navigate('/client');
            else if(role==='technicien')navigate('/technicien');
            else if(role==='planificateur')navigate('/planificateur');
        }catch(err){
            setErreur(err.response?.data?.message ||'erreur de connexion');
        }finally{
            setChargement(false);
        }

        };
    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Connexion</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Votre email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            placeholder="Votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {erreur && <div className="error">{erreur}</div>}
                    <button type="submit" disabled={chargement}>
                        {chargement ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
                <p>
                    Pas encore de compte ? <Link to="/register">S'inscrire</Link>
                </p>
            </div>
        </div>
    );

}export default Login;