import { updateUserLocation } from "../services/api";
export function useShareLocation(setErreur, setSuccess){
    const shareLocation=()=>{
        if(!navigator.geolocation){
            setErreur("la geocalisation n'est pas supportée par votre navigateur");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async(position)=>{
                const{latitude, longitude}=position.coords;
                try{
                    await updateUserLocation(latitude,longitude);
                    setSuccess(true);
                    setTimeout(()=>setSuccess(false),3000);
                }catch(err){
                    setErreur("erreur lors de l'envoi de la position");
                }
            },(error)=>{
                setErreur("accès a la position refusé ou indisponible");
            }
        );
    };
    return shareLocation;
}