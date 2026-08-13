function Sidebar({
    techniciens,
    interventions,
    technicienSelectionne,
    setTechnicienSelectionne
}) {

    const getNombreInterventions = (technicienId) => {

        return interventions.filter(
            intervention =>
                intervention.technicien_id === technicienId
        ).length;
    };


    const totalInterventions =
        interventions.length;


    const getChargeClass = (nombre) => {

        if (nombre < 3) {
            return "load-low";
        }

        if (nombre <= 6) {
            return "load-mid";
        }

        return "load-high";
    };


    return (

        <aside className="planning-sidebar">

            <div className="sidebar-header">

                <span>
                    TECHNICIEN
                </span>

                <span>
                    NB RDV
                </span>

            </div>


            {/* TOUS */}

            <div
                className={`actor-row all ${
                    technicienSelectionne === null
                        ? "selected"
                        : ""
                }`}
                onClick={() =>
                    setTechnicienSelectionne(null)
                }
            >

                <span>
                    Tous
                </span>

                <strong>
                    {totalInterventions}
                </strong>

            </div>


            {/* TECHNICIENS */}

            {techniciens.map((technicien) => {

                const nombre =
                    getNombreInterventions(
                        technicien.user_id
                    );


                return (

                    <div
                        key={technicien.user_id}
                        className={`actor-row ${
                            technicienSelectionne ===
                            technicien.user_id
                                ? "selected"
                                : ""
                        }`}
                        onClick={() =>
                            setTechnicienSelectionne(
                                technicien.user_id
                            )
                        }
                    >

                        <div className="actor-name">

                            {technicien.nom}

                        </div>


                        <div className="actor-meta">

                            <div className="load-bar">

                                <div
                                    className={`load-bar-fill ${getChargeClass(nombre)}`}
                                    style={{
                                        width:
                                            nombre === 0
                                                ? "0%"
                                                : nombre < 3
                                                    ? "25%"
                                                    : nombre <= 6
                                                        ? "60%"
                                                        : "95%"
                                    }}
                                ></div>

                            </div>


                            <span className="actor-count">
                                {nombre}
                            </span>

                        </div>

                    </div>
                );

            })}

        </aside>
    );
}

export default Sidebar;