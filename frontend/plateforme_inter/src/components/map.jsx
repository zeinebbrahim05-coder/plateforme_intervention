import{MapContainer,TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const technicienIcon=new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[1,-34],
});
const clientIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
const interventionIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
function Map({techniciens=[], interventions=[], users=[], tickets=[]}){
    return(
        <MapContainer center={[36.8065, 10.1815]} zoom={13} style={{height: '400px', width:'100%'}}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
            {users.filter(u=> u.role==="technicien" && u.latitude && u.longitude).map((user)=>{
                const techFound= techniciens.find((t)=>t.user_id===user.id);
                return(
                    <Marker key={user.id} position={[Number (user.latitude), Number(user.longitude)]} icon={technicienIcon}>
                        <Popup><strong>{user.nom}</strong><br />
                        Compétences: {techFound? techFound.competences :"non renseignées"} <br />
                        Disponible: {techFound ?(techFound.disponible ? 'oui':'non'):"inconnu"}</Popup>
                    </Marker>
                );
                }
            )}
            {users.filter(u=>u.role==="client" && u.latitude && u.longitude).map((client)=>{
                const ticketFound=tickets.filter(ticket=>ticket.client_id===client.id);
                console.log("ticket trouvé : ",ticketFound);
                return(
                <Marker key={client.id} position={[client.latitude, client.longitude]} icon={clientIcon}>
                    <Popup><strong>Client: {client.nom}</strong><br />
                    <hr />
                    <strong>Ticket: </strong>{ticketFound? ticketFound.description: "Aucun ticket"} <hr /><br />
                    {ticketFound.length===0?(<p>Aucun ticket</p>):
                    (ticketFound.map((ticket)=>{
                        const interventionFound=interventions.find((intervention)=>intervention.ticket_id===ticket.id);
                        return(
                            <div key={ticket.id}>
                                <strong>{ticket.description}</strong> <br />
                                <strong>Priorité: </strong>{ticket.priorite? ticket.priorite :"-"} <br />
                                <strong>Statut: </strong>{ticket.statut? ticket.statut : "-"} <br />
                                <strong>Technicien: </strong>{interventionFound? interventionFound.technicien_nom : "Non affceté"} <hr /><br />
                            </div>
                        );

                    }))}


                    </Popup>
                </Marker>
                );
})}


        </MapContainer>
    );
}export default Map;