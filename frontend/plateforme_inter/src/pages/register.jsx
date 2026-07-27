import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";

function Register(){
    const[nom, setNom]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[role,setRole]=useState("");
    const[telephone,setTelephone]=useState("");
    const[adresse,setAdresse]=useState("");
    const [erreur,setErreur]=useState("");
    const [success,setSuccess]=useState(false);
    const [chargement, setChargement]=useState(false);
    const navigate=useNavigate();


    const handleSubmit=async(e)=>{
        e.preventDefault();
        setErreur('');
        setChargement(true);
        try{
            await register({nom,email,password,role,telephone,adresse});
            setSuccess(true);
            setTimeout(()=>navigate('/login'),2000);
        }catch(err){
            setErreur(err.response?.data?.message||'Erreur lors de linscription');
        }finally{
            setChargement(false);
        }

    }
return(
    <div className="register-page">
        <div className="register-container">
            <h1>Inscription</h1>
            {erreur && <div className="error">{erreur}</div>}
            {success && <div className="success">Inscription réussie ! Redirection...</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nom</label>
                    <input
                        type="text"
                        placeholder="Votre nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label>Rôle</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="client">Client</option>
                        <option value="technicien">Technicien</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Téléphone</label>
                    <input
                        type="text"
                        placeholder="Votre téléphone"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Adresse</label>
                    <input
                        type="text"
                        placeholder="Votre adresse"
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={chargement}>
                    {chargement ? 'Inscription...' : 'S\'inscrire'}
                </button>
            </form>
            <p>
                Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    </div>
    );

}
export default Register;