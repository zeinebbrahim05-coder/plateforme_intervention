function competencesScore(competencesStr, descriptionStr){
    if(!competencesStr || !descriptionStr) return 0.3;
    const mots = competencesStr.toLowerCase().split(/[,;]+/).map(m=>m.trim()).filter(m=>m.length>2);
    const description=descriptionStr.toLowerCase();
    const matched= mots.some(mot=>description.includes(mot));
    return matched? 1 :0.3;
}
function chargeScorre(nombreInterventionsActives){
    return 1/(1+nombreInterventionsActives);
}
function distanceScore(distance, distanceMax){
    if(distanceMax<=0) return 1;
    return 1-(distance/distanceMax);
}
function scoreFinal({distance, distanceMax, competences, description, chargeActuelle, priorite}){
    const urgent= priorite ==='urgent';
    const poids = urgent
    ?{distance: 0.5, competences:0.2, charge:0.3}
    :{distance:0.4, competences:0.3, charge:0.3};
    const dScore= distanceScore(distance, distanceMax);
    const cScore= competencesScore(competences, description);
    const chScore= chargeScorre(chargeActuelle);

    return{
        score:poids.distance * dScore+poids.competences * cScore + poids.charge * chScore,
        detail:{distanceScore: dScore, competencesScore: cScore, chargeScorre: chScore, poids}
    };
}
module.exports={competencesScore, chargeScorre, distanceScore, scoreFinal};