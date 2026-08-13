import{MapContainer,TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import{technicienIcon,clientIcon, MapCluster} from './mapIcons.jsx';

function Map({interventions=[], users=[], tickets=[]}){
    return(
        <MapContainer key="map-container" center={[36.8065, 10.1815]} zoom={13} style={{height: '400px', width:'100%'}}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
            <MapCluster>
            {users.filter(u=> u.role==="technicien" && u.latitude && u.longitude).map((user)=>{
                return(
                    <Marker key={user.id} position={[Number (user.latitude), Number(user.longitude)]} icon={technicienIcon}>
                        <Popup><strong>{user.nom}</strong><br />
                        Compétences: {user.competences||"non renseignées"} <br />
                        Disponible: {user.disponible!==null&&user.disponible!==undefined ?(user.disponible ? 'oui':'non'):"inconnu"}</Popup>
                    </Marker>
                );
                }
            )}
            {users.filter(u=>u.role==="client" && u.latitude && u.longitude).map((client)=>{
                const ticketFound=tickets.filter(ticket=>ticket.client_id===client.id);
                return(
                <Marker key={client.id} position={[Number(client.latitude),Number(client.longitude)]} icon={clientIcon}>
                    <Popup><strong>Client: {client.nom}</strong><br />
                    {client.adresse}
                    <hr />
                    <strong>Ticket: </strong> <hr /><br />
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

            </MapCluster>
        </MapContainer>
    );
}export default Map;