import {useState} from "react";
import PlanificateurSidebar from "../components/planificateurSidebar";
import PlanificateurHeader from "../components/header";
import Dashboard from "./planificateur/dashboard";
import Tickets from "./planificateur/tickets";
import Interventions from "./planificateur/interventions";
import Clients from "./planificateur/client";
import Techniciens from "./planificateur/technicien";
import Planning from "./planificateur/planning";
import Carte from "./planificateur/carte";
import "../styles/planificateurLayout.css";


function DashboardPlanificateur(){
    const [page,setPage]=useState("dashboard");
    return(
        <div className="plan-app">
            <PlanificateurSidebar page={page}
                setPage={setPage}
            />
            <main className="plan-content">
                <PlanificateurHeader/>
                {page==="dashboard" &&<Dashboard/>}
                {page==="planning" &&<Planning/>}
                {page==="tickets" &&<Tickets/>}
                {page==="interventions" &&<Interventions/>}
                {page==="clients" &&<Clients/>}
                {page==="techniciens" &&<Techniciens/>}
                {page==="carte" &&<Carte/>}
            </main>
        </div>
    );
}

export default DashboardPlanificateur;