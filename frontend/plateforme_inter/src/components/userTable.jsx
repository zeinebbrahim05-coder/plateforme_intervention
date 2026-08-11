function UserTable({users, role, title, onEdit, onDelete}){
    const filteredUsers= users.filter(u=>u.role ===role);
    if (filteredUsers.length === 0) {
        return <div className="section"><p className="empty-message">Aucun {role}.</p></div>;
    }
    return (
        <div className="section">
            <h2>{title}</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        {role === "technicien" && (
                            <>
                                <th>Compétences</th>
                                <th>Disponible</th>
                            </>
                        )}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.nom}</td>
                            <td>{user.email}</td>
                            <td>{user.telephone || "-"}</td>
                            {role === "technicien" && (
                                <>
                                    <td>{user.competences || "-"}</td>
                                    <td>
                                        <span className={`status ${user.disponible ? 'disponible' : 'indisponible'}`}>
                                            {user.disponible ? 'Oui' : 'Non'}
                                        </span>
                                    </td>
                                </>
                            )}
                            <td>
                                <button className="btn btn-warning" onClick={() => onEdit(user)}>
                                    Modifier
                                </button>
                                <button className="btn btn-danger" onClick={()=>onDelete(user)}>
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;