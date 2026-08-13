function PlanNotification({type,message,onClose}){
    if(!message)return null;
    return(
        <div className={`plan-notification ${type}`}>
            <span>{message}</span>
            <button onClick={onClose}>×</button>
        </div>
    );
}
export default PlanNotification;