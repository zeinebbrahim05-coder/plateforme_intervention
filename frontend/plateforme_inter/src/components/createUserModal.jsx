import { useState } from "react";

function CreateUserModal({ onClose, onSave, chargement }) {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("client");
    const [telephone, setTelephone] = useState("");
    const [adresse, setAdresse] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nom, email, password, role, telephone, adresse });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Ajouter un utilisateur</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Nom"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                        required
                    />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="client">Client</option>
                        <option value="technicien">Technicien</option>
                        <option value="planificateur">Planificateur</option>
                    </select>
                    <input
                        type="text"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="Téléphone"
                    />
                    <input
                        type="text"
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                        placeholder="Adresse"
                    />
                    <button type="submit" disabled={chargement}>
                        {chargement ? "Création..." : "Créer"}
                    </button>
                    <button type="button" onClick={onClose}>
                        Annuler
                    </button>
                </form>
            </div>
        </div>
    );
}
export default CreateUserModal;