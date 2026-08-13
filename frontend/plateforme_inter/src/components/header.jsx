import PlanNotification from "./PlanNotification";

function PlanificateurHeader({notification}) {
    return (
        <>
            <header className="plan-header">
                <div>
                    <h1>Espace Planificateur</h1>
                    <p>Gérez vos tickets, interventions et techniciens</p>
                </div>
                <div className="plan-header-right">
                    <div className="plan-profile">
                        <div className="plan-avatar">P</div>
                        <div>
                            <strong>Planificateur</strong>
                            <span>Administrateur</span>
                        </div>
                    </div>
                </div>
            </header>
            <PlanNotification
                type={notification?.type}
                message={notification?.message}
                onClose={notification?.onClose}
            />
        </>
    );
}

export default PlanificateurHeader;