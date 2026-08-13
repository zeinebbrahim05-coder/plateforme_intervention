import {useCallback,useEffect,useState} from "react";

import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} from "../../services/api";

import PlanNotification from "../../components/PlanNotification";
import "../../styles/planificateurLayout.css";

function Clients(){

    const [users,setUsers]=useState([]);

    const [searchClient,setSearchClient]=
        useState("");

    const [clientForm,setClientForm]=useState({
        nom:"",
        email:"",
        password:"",
        telephone:"",
        adresse:""
    });

    const [clientEdit,setClientEdit]=
        useState(null);

    const [notification,setNotification]=
        useState({
            type:"",
            message:""
        });
    const afficherNotification=(type,message)=>{
        setNotification({type,message});
        setTimeout(()=>{setNotification({
                type:"",message:""});},3000);
    };
    const chargerClients=useCallback(async()=>{
        try{
            const res=await getAllUsers();
            setUsers(res.data.users||[]);
        }catch{
            afficherNotification("error","Erreur lors du chargement des clients");
        }
    },[]);
    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        chargerClients()},[]);

    const clients=users.filter(user=>user.role==="client");
    const clientsFiltres=clients.filter(client=>{
            const recherche=searchClient.toLowerCase();
            return(client.nom?.toLowerCase().includes(recherche) ||
                client.email?.toLowerCase().includes(recherche) ||
                client.telephone?.toLowerCase().includes(recherche)
            );
        });
    const viderForm=()=>{setClientForm({
            nom:"",
            email:"",
            password:"",
            telephone:"",
            adresse:""
        });

        setClientEdit(null);
    };
    const enregistrerClient=async(e)=>{
        e.preventDefault();
        try{
            if(clientEdit){
                await updateUser(clientEdit.id,{
                        nom:clientForm.nom,
                        email:clientForm.email,
                        telephone:clientForm.telephone,
                        adresse:clientForm.adresse
                    }
                );
                afficherNotification("success","Client modifié avec succès");
            }else{
                await createUser({...clientForm,role:"client"});
                afficherNotification("success","Client créé avec succès");
            }
            await chargerClients();
            viderForm();
        }catch(err){
            afficherNotification(
                "error",
                err.response?.data?.message ||
                "Erreur lors de l'enregistrement"
            );
        }
    };
    const supprimerClient=async(id)=>{
        const confirmer=window.confirm(
                "Voulez-vous vraiment supprimer ce client ?"
            );
        if(!confirmer)return;
        try{
            await deleteUser(id);
            setUsers(prev=>prev.filter(user=>user.id!==id)
            );

            afficherNotification("success","Client supprimé avec succès");
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
                    setNotification({type:"",message:""})
                }
            />
            <div className="page-heading">
                <div>
                    <h2>Clients</h2>
                    <p>Gérez les clients de la plateforme.</p>
                </div>
                <div className="page-count">
                    {clients.length} clients
                </div>
            </div>
            <div className="client-toolbar">
                <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={searchClient}
                    onChange={e=>setSearchClient(e.target.value)
                    }
                />
                <button className="client-add-btn"
                    onClick={()=>{viderForm();setClientEdit(false);
                    }}
                >
                    + Nouveau client
                </button>
            </div>
            {clientEdit!==null && (
                <div className="client-form-card">
                    <div className="form-title">
                        <div>
                            <h3>{clientEdit ?"Modifier le client"
                                    :"Nouveau client"}
                            </h3>
                            <p>{clientEdit ?"Modifiez les informations du client.":"Ajoutez un nouveau client."}</p>
                        </div>
                        <button className="close-form"
                            onClick={viderForm}>
                            ×
                        </button>
                    </div>
                    <form onSubmit={enregistrerClient}>
                        <div className="client-form-grid">
                            <div className="form-group">
                                <label>Nom</label>
                                <input
                                    type="text"
                                    value={clientForm.nom}
                                    onChange={e=>
                                        setClientForm({
                                            ...clientForm,
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
                                    value={clientForm.email}
                                    onChange={e=>
                                        setClientForm({
                                            ...clientForm,
                                            email:e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>
                            {!clientEdit && (
                                <div className="form-group">
                                    <label>Mot de passe</label>
                                    <input
                                        type="password"
                                        value={clientForm.password}
                                        onChange={e=>
                                            setClientForm({
                                                ...clientForm,
                                                password:e.target.value
                                            })
                                        }
                                        required
                                    />

                                </div>
                            )}
                            <div className="form-group">
                                <label>Téléphone</label>
                                <input
                                    type="text"
                                    value={clientForm.telephone}
                                    onChange={e=>
                                        setClientForm({
                                            ...clientForm,
                                            telephone:e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Adresse</label>
                                <input
                                    type="text"
                                    value={clientForm.adresse}
                                    onChange={e=>
                                        setClientForm({
                                            ...clientForm,
                                            adresse:e.target.value
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
                                {clientEdit?"Enregistrer les modifications":
                                    "Créer le client"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="clients-list">
                {clientsFiltres.length===0 ? (
                    <div className="empty-box">
                        <div>👤</div>
                        <strong>Aucun client trouvé</strong>
                        <span>Essayez de modifier votre recherche.</span>
                    </div>
                ) : (
                    clientsFiltres.map(client=>(
                        <div className="client-card"
                            key={client.id}
                        >
                            <div className="client-card-main">
                                <div className="client-avatar">
                                    {
                                        client.nom
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                        "C"
                                    }

                                </div>

                                <div className="client-details">
                                    <h3>{client.nom}</h3>
                                    <span>{client.email}</span>
                                </div>
                            </div>
                            <div className="client-info">
                                <div>
                                    <span>TÉLÉPHONE</span>
                                    <strong>
                                        {
                                            client.telephone ||
                                            "Non renseigné"
                                        }
                                    </strong>

                                </div>
                                <div>
                                    <span>ADRESSE</span>
                                    <strong>
                                        {
                                            client.adresse ||
                                            "Non renseignée"
                                        }
                                    </strong>
                                </div>
                            </div>
                            <div className="client-actions">
                                <button
                                    className="edit-btn"
                                    onClick={()=>{
                                        setClientEdit(client);
                                        setClientForm({
                                            nom:client.nom||"",
                                            email:client.email||"",
                                            password:"",
                                            telephone:
                                                client.telephone||"",
                                            adresse:
                                                client.adresse||""
                                        });

                                    }}
                                >
                                    Modifier
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={()=>
                                        supprimerClient(
                                            client.id
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

export default Clients;