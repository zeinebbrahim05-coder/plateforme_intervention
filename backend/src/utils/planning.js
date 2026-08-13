function trouverCreneauDisponible(interventions, dureeMinutes = 60) {

    const maintenant = new Date();
    const heures = [8, 9, 10, 11,
        13, 14, 15, 16
    ];
    for (let jour = 0; jour < 30; jour++) {
        const date = new Date(maintenant);
        date.setDate(maintenant.getDate() + jour);

        const jourSemaine = date.getDay();
        if (jourSemaine === 0 || jourSemaine === 6) {
            continue;
        }

        const dateSQL =
            `${date.getFullYear()}-` +
            `${String(date.getMonth() + 1).padStart(2, "0")}-` +
            `${String(date.getDate()).padStart(2, "0")}`;
        const heureActuelle =
            maintenant.getHours() * 60 +
            maintenant.getMinutes();
        for (const heure of heures) {
            const debut = heure * 60;
            const fin = debut + dureeMinutes;
            if (jour === 0) {

                if (debut <= heureActuelle) {
                    continue;
                }

            }
            const conflit = interventions.some(intervention => {

                if (
                    !intervention.date_prevue ||
                    !intervention.heure_debut ||
                    !intervention.heure_fin
                ) {
                    return false;
                }

                const dateIntervention =
                    String(intervention.date_prevue)
                        .split("T")[0];

                if (dateIntervention !== dateSQL) {
                    return false;
                }

                const [hDebut, mDebut] =
                    String(intervention.heure_debut)
                        .substring(0, 5)
                        .split(":")
                        .map(Number);

                const [hFin, mFin] =
                    String(intervention.heure_fin)
                        .substring(0, 5)
                        .split(":")
                        .map(Number);

                const interventionDebut =
                    hDebut * 60 + mDebut;

                const interventionFin =
                    hFin * 60 + mFin;
                return (
                    debut < interventionFin &&
                    fin > interventionDebut
                );
            });
            if (!conflit) {
                return {
                    date: dateSQL,
                    heureDebut:`${String(Math.floor(debut / 60)).padStart(2, "0")}:${String(debut % 60).padStart(2, "0")}:00`,
                    heureFin:`${String(Math.floor(fin / 60)).padStart(2, "0")}:${String(fin % 60).padStart(2, "0")}:00`

                };
            }
        }
    }
    return null;
}
module.exports = {trouverCreneauDisponible};