import {useEffect,useState} from "react";

import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} from "../../services/api";

import PlanNotification from "../../components/PlanNotification";
import "../../styles/planificateurLayout.css";

function Techniciens(){
    const [users,setUsers]=useState([]);
    const [searchTechnicien,setSearchTechnicien]=
        useState("");
    const [technicienForm,setTechnicienForm]=useState({
        nom:"",
        email:"",
        password:"",
        telephone:"",
        adresse:"",
        competences:""
    });
    const [technicienEdit,setTechnicienEdit]=
        useState(null);
    const [notification,setNotification]=
        useState({
            type:"",
            message:""
        });
    const afficherNotification=(type,message)=>{
        setNotification({type,message});
        setTimeout(()=>{setNotification({type:"",message:""
            });
        },3000);
    };
    const chargerTechniciens=async()=>{
        try{
            const res=
                await getAllUsers();
            setUsers(
                res.data.users||[]
            );
        }catch{
            afficherNotification(
                "error",
                "Erreur lors du chargement des techniciens"
            );
        }
    };
    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        chargerTechniciens();},[]);
    const techniciens=
        users.filter(
            user=>user.role==="technicien"
        );
    const techniciensFiltres=
        techniciens.filter(technicien=>{
            const recherche=
                searchTechnicien.toLowerCase();
            return(
                technicien.nom
                    ?.toLowerCase()
                    .includes(recherche) ||
                technicien.email
                    ?.toLowerCase()
                    .includes(recherche) ||
                technicien.competences
                    ?.toLowerCase()
                    .includes(recherche)
            );
        });
    const viderForm=()=>{
        setTechnicienForm({
            nom:"",
            email:"",
            password:"",
            telephone:"",
            adresse:"",
            competences:""
        });

        setTechnicienEdit(null);
    };

    const enregistrerTechnicien=async(e)=>{
        e.preventDefault();
        try{
            if(technicienEdit){
                await updateUser(
                    technicienEdit.id,
                    {
                        nom:technicienForm.nom,
                        email:technicienForm.email,
                        telephone:technicienForm.telephone,
                        adresse:technicienForm.adresse,
                        competences:
                            technicienForm.competences
                    }
                );
                afficherNotification(
                    "success",
                    "Technicien modifié avec succès"
                );
            }else{
                await createUser({
                    nom:technicienForm.nom,
                    email:technicienForm.email,
                    password:technicienForm.password,
                    telephone:technicienForm.telephone,
                    adresse:technicienForm.adresse,
                    competences:
                        technicienForm.competences,
                    role:"technicien"
                });
                afficherNotification(
                    "success",
                    "Technicien créé avec succès"
                );
            }
            await chargerTechniciens();
            viderForm();
        }catch(err){
            afficherNotification(
                "error",
                err.response?.data?.message ||
                "Erreur lors de l'enregistrement"
            );
        }
    };
    const supprimerTechnicien=async(id)=>{
        const confirmer=
            window.confirm(
                "Voulez-vous vraiment supprimer ce technicien ?"
            );
        if(!confirmer)return;
        try{
            await deleteUser(id);
            setUsers(
                prev=>
                    prev.filter(
                        user=>user.id!==id
                    )
            );
            afficherNotification(
                "success",
                "Technicien supprimé avec succès"
            );
        }catch(err){
            afficherNotification(
                "error",
                err.response?.data?.message ||
                "Erreur lors de la suppression"
            );
        }
    };
    return(
        <div className="plan-page">
            <PlanNotification
                type={notification.type}
                message={notification.message}
                onClose={()=>
                    setNotification({
                        type:"",
                        message:""
                    })
                }
            />
            <div className="page-heading">
                <div>
                    <h2>Techniciens</h2>
                    <p>
                        Gérez les techniciens de la plateforme.
                    </p>
                </div>
                <div className="page-count">
                    {techniciens.length} techniciens
                </div>
            </div>
            <div className="client-toolbar">
                <input
                    type="text"
                    placeholder="Rechercher un technicien..."
                    value={searchTechnicien}
                    onChange={e=>
                        setSearchTechnicien(e.target.value)
                    }
                />
                <button
                    className="client-add-btn"
                    onClick={()=>{
                        viderForm();
                        setTechnicienEdit(false);
                    }}
                >
                    + Nouveau technicien
                </button>
            </div>
            {technicienEdit!==null && (
                <div className="client-form-card">
                    <div className="form-title">
                        <div>
                            <h3>
                                {
                                    technicienEdit
                                    ?
                                    "Modifier le technicien"
                                    :
                                    "Nouveau technicien"
                                }
                            </h3>
                            <p>
                                {
                                    technicienEdit
                                    ?
                                    "Modifiez les informations du technicien."
                                    :
                                    "Ajoutez un nouveau technicien."
                                }
                            </p>
                        </div>
                        <button
                            className="close-form"
                            onClick={viderForm}
                        >
                            ×
                        </button>
                    </div>
                    <form onSubmit={enregistrerTechnicien}>
                        <div className="client-form-grid">
                            <div className="form-group">
                                <label>Nom</label>
                                <input
                                    type="text"
                                    value={technicienForm.nom}
                                    onChange={e=>
                                        setTechnicienForm({
                                            ...technicienForm,
                                            nom:e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={technicienForm.email}
                                    onChange={e=>
                                        setTechnicienForm({
                                            ...technicienForm,
                                            email:e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>
                            {!technicienEdit && (
                                <div className="form-group">
                                    <label>
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={
                                            technicienForm.password
                                        }
                                        onChange={e=>
                                            setTechnicienForm({
                                                ...technicienForm,
                                                password:e.target.value
                                            })
                                        }
                                        required
                                    />
                                </div>

                            )}
                            <div className="form-group">
                                <label>
                                    Téléphone
                                </label>
                                <input
                                    type="text"
                                    value={
                                        technicienForm.telephone
                                    }
                                    onChange={e=>
                                        setTechnicienForm({
                                            ...technicienForm,
                                            telephone:e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Adresse
                                </label>
                                <input
                                    type="text"
                                    value={
                                        technicienForm.adresse
                                    }
                                    onChange={e=>
                                        setTechnicienForm({
                                            ...technicienForm,
                                            adresse:e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    Compétences
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: plomberie, électricité"
                                    value={
                                        technicienForm.competences
                                    }
                                    onChange={e=>
                                        setTechnicienForm({
                                            ...technicienForm,
                                            competences:e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={viderForm}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="save-btn"
                            >
                                {
                                    technicienEdit
                                    ?
                                    "Enregistrer les modifications"
                                    :
                                    "Créer le technicien"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="clients-list">
                {techniciensFiltres.length===0 ? (
                    <div className="empty-box">
                        <div>🔧</div>
                        <strong>
                            Aucun technicien trouvé
                        </strong>
                        <span>
                            Essayez de modifier votre recherche.
                        </span>
                    </div>
                ) : (
                    techniciensFiltres.map(technicien=>(
                        <div
                            className="client-card"
                            key={technicien.id}
                        >
                            <div className="client-card-main">
                                <div className="client-avatar">
                                    {
                                        technicien.nom
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                        "T"
                                    }
                                </div>
                                <div className="client-details">
                                    <h3>
                                        {technicien.nom}
                                    </h3>
                                    <span>
                                        {technicien.email}
                                    </span>
                                </div>
                            </div>
                            <div className="client-info">

                                <div>

                                    <span>
                                        COMPÉTENCES
                                    </span>

                                    <strong>
                                        {
                                            technicien.competences ||
                                            "Non renseignées"
                                        }
                                    </strong>
                                </div>
                                <div>

                                    <span>DISPONIBILITÉ</span>
                                    <strong>
                                        <span className={`technicien-disponibilite ${technicien.disponible===true || technicien.disponible===1 ? "disponible" : "indisponible"}`}>
                                            <i></i>
                                            {technicien.disponible===true || technicien.disponible===1 ? "Disponible" : "Indisponible"}
                                        </span>
                                    </strong>

                                </div>

                            </div>


                            <div className="client-actions">

                                <button
                                    className="edit-btn"
                                    onClick={()=>{

                                        setTechnicienEdit(
                                            technicien
                                        );

                                        setTechnicienForm({

                                            nom:
                                                technicien.nom||"",

                                            email:
                                                technicien.email||"",

                                            password:"",

                                            telephone:
                                                technicien.telephone||"",

                                            adresse:
                                                technicien.adresse||"",

                                            competences:
                                                technicien.competences||""

                                        });

                                    }}
                                >
                                    Modifier
                                </button>


                                <button
                                    className="delete-btn"
                                    onClick={()=>
                                        supprimerTechnicien(
                                            technicien.id
                                        )
                                    }
                                >
                                    Supprimer
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default Techniciens;