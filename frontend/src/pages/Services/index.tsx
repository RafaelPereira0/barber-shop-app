import {  useState } from "react";
import type { ServiceType } from "../../types/service";
import { deleteService, getServices } from "../../api/services.api";
import ServiceCard from "../../components/ServiceCard";
import { useAuth } from "../../hooks/useAuth";
import ServiceForm from "../../components/ServiceForm";
import styles from "./services.module.css";
import { showConfirmModal } from "../../utils/confirmModal";
import { useQuery } from "@tanstack/react-query";

export default function Services() {
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

    const {
        data: services = [],
        isLoading,
        isError
    } = useQuery<ServiceType[]>({
        queryKey:["services"],
        queryFn: getServices
    })

    async function handleDelete(id: number) {
        const confirmed = await showConfirmModal({
            title: "Deseja remover este serviço?",
            text: "O serviço será permanentemente excluído do sistema",
            confirmButtonText: "Excluir"
        })

        if (!confirmed) return

        try {
            await deleteService(id);
        } catch (err) {
            console.log(err);
        }
    }

    function handleEdit(service: ServiceType) {
        setSelectedService(service);
        setShowForm(true);
    }

    if (isLoading) return <div className={styles.loading}>Carregando serviços...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Serviços</h1>
                {(user?.role !== "CLIENT") && (
                    <button
                        className={showForm ? styles.btnCancel : styles.btnNew}
                        onClick={() => { setSelectedService(null); setShowForm(!showForm) }}
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
                        canManage={user?.role === "ADMIN"}
                    />
                ))}
            </div>
        </div>
    );
}