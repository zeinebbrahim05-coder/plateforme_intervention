import { useState, useEffect, useMemo } from "react";

import {
    getInterventionsByWeek,
    getIntereventionsByMonth,
    getAllTechniciens
} from "../../services/api";

import Sidebar from "../../components/Sidebar";
import WeekGrid from "../../components/WeekGrid";
import MonthGrid from "../../components/MonthGrid";

import "../../styles/planning.css";


function Planning() {

    const [vue, setVue] = useState("semaine");
    const [dateActuelle, setDateActuelle] = useState(new Date());
    const [interventions, setInterventions] = useState([]);
    const [techniciens, setTechniciens] = useState([]);
    const [technicienSelectionne, setTechnicienSelectionne] =
        useState(null);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState("");
    const [filtreStatut, setFiltreStatut] = useState("tous");
    const [recherche, setRecherche] = useState("");
    const [filtreTechnicien, setFiltreTechnicien] =
        useState("tout");
    const formatDate = (date) => {
        const annee = date.getFullYear();
        const mois = String(
            date.getMonth() + 1
        ).padStart(2, "0");
        const jour = String(
            date.getDate()
        ).padStart(2, "0");

        return `${annee}-${mois}-${jour}`;
    };
    const getMonday = (date) => {
    const lundi = new Date(date);
    const jour = lundi.getDay();
    const difference = jour === 0
        ? -6
        : 1 - jour;

    lundi.setDate(
        lundi.getDate() + difference
    );

    return lundi;
};

    useEffect(() => {
        const fetchData = async () => {
            setChargement(true);
            setErreur("");
            try {
                let response;
                if (vue === "semaine") {
                    const lundi=getMonday(dateActuelle);
                    response = await getInterventionsByWeek(
                        formatDate(lundi)
                    );
                    console.log("DATE ENVOYÉE :", formatDate(dateActuelle));
                    console.log("RÉPONSE SEMAINE :", response.data);
                    console.log(
                        "INTERVENTIONS SEMAINE :",
                        response.data?.interventions
                    );

                } else {
                    const annee =
                        dateActuelle.getFullYear();
                    const mois =
                        dateActuelle.getMonth() + 1;
                    response =
                        await getIntereventionsByMonth(
                            annee,
                            mois
                        );
                }
                setInterventions(
                    response.data?.interventions || []
                );
                const responseTechniciens =
                    await getAllTechniciens();

                setTechniciens(
                    responseTechniciens.data?.techniciens || []
                );
            } catch (err) {
                console.error("Erreur chargement planning :",err);

                setErreur(err.response?.data?.message ||"Erreur lors du chargement du planning.");
                setInterventions([]);
                setTechniciens([]);
            } finally {
                setChargement(false);
            }
        };
        fetchData();
    }, [vue, dateActuelle]);
    const interventionsFiltrees = useMemo(() => {
        let result = [...interventions];
        if (filtreStatut !== "tous") {
            result = result.filter(
                (intervention) =>
                    intervention.statut === filtreStatut
            );

        }

        if (recherche.trim() !== "") {
            const search =
                recherche.toLowerCase().trim();
            result = result.filter(
                (intervention) =>
                    intervention.client_nom
                        ?.toLowerCase()
                        .includes(search)

                    ||
                    intervention.description
                        ?.toLowerCase()
                        .includes(search)
                    ||
                    intervention.adresse
                        ?.toLowerCase()
                        .includes(search)
                    ||
                    intervention.technicien_nom
                        ?.toLowerCase()
                        .includes(search)
            );
        }
        if (technicienSelectionne !== null) {
            result = result.filter(
                (intervention) =>
                    String(intervention.technicien_id) ===
                    String(technicienSelectionne)
            );
        }
        if (filtreTechnicien !== "tout") {
            result = result.filter(
                (intervention) =>
                    String(intervention.technicien_id) ===
                    String(filtreTechnicien)
            );
        }
        return result;
    }, [interventions,filtreStatut,recherche,technicienSelectionne,filtreTechnicien
    ]);
    const allerPrecedent = () => {
        const nouvelleDate =
            new Date(dateActuelle);
        if (vue === "semaine") {
            nouvelleDate.setDate(
                nouvelleDate.getDate() - 7
            );
        } else {
            nouvelleDate.setMonth(
                nouvelleDate.getMonth() - 1
            );
        }
        setDateActuelle(nouvelleDate);
    };
    const allerSuivant = () => {
        const nouvelleDate =
            new Date(dateActuelle);
        if (vue === "semaine") {
            nouvelleDate.setDate(
                nouvelleDate.getDate() + 7
            );

        } else {
            nouvelleDate.setMonth(
                nouvelleDate.getMonth() + 1
            );
        }
        setDateActuelle(nouvelleDate);
    };
    const allerAujourdhui = () => {
        setDateActuelle(new Date());
    };
    const getDateLabel = () => {
        if (vue === "mois") {
            return dateActuelle.toLocaleDateString(
                "fr-FR",
                {
                    month: "long",
                    year: "numeric"
                }
            );
        }
        const debut =new Date(dateActuelle);
        const jour =debut.getDay();
        const difference =jour === 0
                ? -6
                : 1 - jour;

        debut.setDate(
            debut.getDate() + difference
        );

        const fin =new Date(debut);
        fin.setDate(fin.getDate() + 6
        );

        const debutJour =debut.getDate();
        const finJour =fin.getDate();
        const moisDebut =debut.toLocaleDateString(
                "fr-FR",
                {
                    month: "long"
                }
            );
        const moisFin =fin.toLocaleDateString("fr-FR",
                {
                    month: "long"
                }
            );
        const annee =fin.getFullYear();
        if (moisDebut === moisFin) {
            return `${debutJour} – ${finJour} ${moisFin} ${annee}`;
        }
        return `${debutJour} ${moisDebut} – ${finJour} ${moisFin} ${annee}`;

    };
    const resetFiltres = () => {
        setFiltreStatut("tous");
        setRecherche("");
        setFiltreTechnicien("tout");
        setTechnicienSelectionne(null);
    };
    const filtresActifs =
        filtreStatut !== "tous" ||
        recherche.trim() !== "" ||
        filtreTechnicien !== "tout" ||
        technicienSelectionne !== null;

    return (
        <div className="planning-container">
            <div className="planning-header">
                <div>
                    <div className="planning-title">
                        <span className="planning-title-icon">
                            📅
                        </span>
                        <div>
                            <h2>Planning</h2>
                            <p>Organisez et suivez les interventionsdes techniciens.</p>
                        </div>
                    </div>
                </div>
                <div className="planning-header-info">
                    <span>{interventionsFiltrees.length}</span>
                    <small>
                        intervention
                        {interventionsFiltrees.length > 1
                            ? "s"
                            : ""}
                    </small>
                </div>
            </div>
            <div className="planning-toolbar">
                <div className="toolbar-left">
                    <select
                        className="pill-btn"
                        value={filtreTechnicien}
                        onChange={(e) =>setFiltreTechnicien(e.target.value)}>
                        <option value="tout">Technicien : Tous</option>
                        {techniciens.map((tech) => (
                                <option
                                    key={tech.user_id}
                                    value={tech.user_id}>
                                    {tech.nom}
                                </option>
                            )
                        )}
                    </select>
                    <select
                        className="pill-btn"
                        value={filtreStatut}
                        onChange={(e) =>setFiltreStatut(e.target.value)}
                    >
                        <option value="tous">
                            Statut : Tous
                        </option>

                        <option value="en attente">
                            En attente
                        </option>

                        <option value="affecte">
                            Affectée
                        </option>

                        <option value="en cours">
                            En cours
                        </option>

                        <option value="termine">
                            Terminée
                        </option>

                    </select>
                    <div className="planning-search-wrapper">
                        <span className="search-icon">
                            🔍
                        </span>
                        <input
                            className="planning-search-mini"
                            type="text"
                            placeholder="Rechercher..."
                            value={recherche}
                            onChange={(e) =>
                                setRecherche(
                                    e.target.value
                                )
                            }
                        />
                        {recherche && (
                            <button
                                className="search-clear"
                                onClick={() =>
                                    setRecherche("")
                                }
                            >
                                ×
                            </button>
                        )}
                    </div>
                    {filtresActifs && (
                        <button className="reset-filters"
                            onClick={resetFiltres}>
                            ↻ Réinitialiser
                        </button>
                    )}
                </div>
                <div className="toolbar-right">
                    <div className="date-nav">
                        <button
                            onClick={allerPrecedent}
                            title="Période précédente"
                        >
                            ‹
                        </button>
                        <span>
                            📅 {getDateLabel()}
                        </span>
                        <button
                            onClick={allerSuivant}
                            title="Période suivante"
                        >
                            ›
                        </button>

                    </div>
                    <button
                        className="today-btn"
                        onClick={allerAujourdhui}
                    >
                        Aujourd'hui
                    </button>

                    <div className="view-switcher">

                        <button
                            className={
                                vue === "semaine"
                                    ? "view-btn active"
                                    : "view-btn"
                            }
                            onClick={() =>
                                setVue("semaine")
                            }
                        >
                            Semaine
                        </button>
                        <button
                            className={
                                vue === "mois"
                                    ? "view-btn active"
                                    : "view-btn"
                            }
                            onClick={() =>
                                setVue("mois")
                            }
                        >
                            Mois
                        </button>

                    </div>

                </div>

            </div>

            <div className="planning-legend">

                <span>
                    <i className="legend-dot urgent"></i>
                    Urgent
                </span>

                <span>
                    <i className="legend-dot success"></i>
                    Terminé
                </span>

                <span>
                    <i className="legend-dot warning"></i>
                    En attente
                </span>

                <span>
                    <i className="legend-dot progress"></i>
                    En cours
                </span>

            </div>

            {erreur && (

                <div className="planning-error">

                    <span>⚠</span>

                    <p>
                        {erreur}
                    </p>

                    <button
                        onClick={() =>
                            setErreur("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}

            {chargement ? (

                <div className="planning-loading">
                    <div className="planning-spinner"></div>
                    <p>
                        Chargement du planning...
                    </p>
                </div>

            ) : (

                <div className="planning-layout">
                    <Sidebar
                        techniciens={techniciens}
                        interventions={interventions}
                        technicienSelectionne={
                            technicienSelectionne
                        }
                        setTechnicienSelectionne={
                            setTechnicienSelectionne
                        }
                    />

                    <div className="planning-main">
                        {vue === "semaine" ? (
                            <WeekGrid
                                interventions={
                                    interventionsFiltrees
                                }
                                techniciens={
                                    techniciens
                                }
                                date={
                                    dateActuelle
                                }
                                technicienSelectionne={
                                    technicienSelectionne
                                }
                            />

                        ) : (

                            <MonthGrid
                                interventions={
                                    interventionsFiltrees
                                }
                                date={
                                    dateActuelle
                                }
                            />

                        )}
                        {interventionsFiltrees.length === 0 && (
                            <div className="planning-empty">
                                <div className="empty-icon">
                                    🔍
                                </div>
                                <h3>
                                    Aucune intervention trouvée
                                </h3>
                                <p>
                                    Aucune intervention ne
                                    correspond aux filtres
                                    sélectionnés.
                                </p>
                                {filtresActifs && (

                                    <button
                                        onClick={
                                            resetFiltres
                                        }
                                    >
                                        Réinitialiser les filtres
                                    </button>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}


export default Planning;