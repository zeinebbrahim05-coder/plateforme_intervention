import { useNavigate } from "react-router-dom";
import "../styles/header.css";
function Header(){
    const navigate=useNavigate();
    const user=JSON.parse(localStorage.getItem('user'));
    const handleLogout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    return(
        <header className="header">
            <div className="header-left">
                <h1>Plateforme Interventions</h1>
            </div>
            <div className="header-right">
                <span className="user-name">{user?.nom ||'Utilisateur'}</span>
                <button className="btn btn-danger" onClick={()=>{handleLogout()}}>Déconnexion</button>
            </div>
        </header>
    );
}
export default Header;