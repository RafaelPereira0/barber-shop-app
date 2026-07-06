import { useEffect, useState } from "react";
import type { ServiceType } from "../../types/service";
import { deleteService, getServices } from "../../api/services.api";
import ServiceCard from "../../components/ServiceCard";
import { useAuth } from "../../hooks/useAuth";
import ServiceForm from "../../components/ServiceForm";
import styles from "./services.module.css";

export default function Services(){
    const {user} = useAuth();
    const [services, setServices] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
    
    async function loadServices(){
        try{
            const response = await getServices();
            setServices(response);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    async function handleDelete(id: number){
        try{
            if (!confirm("Tem certeza que deseja remover este serviço? O processo não poderá ser desfeito.")) return;
            await deleteService(id);
            loadServices();
        }catch(err){
            console.log(err);
        }
    }

    function handleEdit(service: ServiceType){
        setSelectedService(service);
        setShowForm(true);
    }

    useEffect(() => {
        loadServices();
    },[]);

    if(loading) return <div className={styles.loading}>Carregando serviços...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Serviços</h1>
                {(user?.role !== "CLIENT") && (
                    <button 
                        className={showForm ? styles.btnCancel : styles.btnNew} 
                        onClick={() => {setSelectedService(null); setShowForm(!showForm)}}
                    >
                        {showForm ? "Cancelar" : "Novo Serviço"}
                    </button>
                )}
            </div>

            {showForm && (
                <div className={styles.formContainer}>
                    <ServiceForm
                        service={selectedService}
                        onSuccess={() => {
                            setShowForm(false);
                            setSelectedService(null);
                            loadServices();
                        }}
                    />
                </div>
            )}

            <div className={styles.grid}>
                {services.map(service => (
                    <ServiceCard 
                        key={service.id} 
                        service={service} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                        canManage={user?.role !== "CLIENT"}
                    />
                ))}
            </div>
        </div>
    );
}