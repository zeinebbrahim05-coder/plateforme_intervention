import { useEffect } from "react";
import { useState } from "react";
function UserModal({ user, onClose, onSave, chargement }) {
    const [editedUser, setEditedUser] = useState(user);
    useEffect(()=>{
        setEditedUser(user);
    },[user]);
    if (!user) return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(user.id, editedUser); 
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Modifier {user.nom}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={editedUser.nom}
                        onChange={(e) => setEditedUser({ ...editedUser, nom: e.target.value })}
                        placeholder="Nom"
                        required
                    />
                    <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="text"
                        value={editedUser.telephone || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, telephone: e.target.value })}
                        placeholder="Téléphone"
                    />
                    {user.role === "technicien" && (
                        <>
                            <input
                                type="text"
                                value={editedUser.competences || ""}
                                onChange={(e) => setEditedUser({ ...editedUser, competences: e.target.value })}
                                placeholder="Compétences"
                            />
                            <select
                                value={editedUser.disponible}
                                onChange={(e) => setEditedUser({ ...editedUser, disponible: e.target.value === "true" })}
                            >
                                <option value="true">Disponible</option>
                                <option value="false">Indisponible</option>
                            </select>
                        </>
                    )}
                    <button type="submit" disabled={chargement}>
                        {chargement ? "Enregistrement..." : "Enregistrer"}
                    </button>
                    <button type="button" onClick={onClose}>
                        Annuler
                    </button>
                </form>
            </div>
        </div>
    );
}
export default UserModal;