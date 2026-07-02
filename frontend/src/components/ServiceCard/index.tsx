import type { ServiceType } from "../../types/service";
import styles from "./serviceCard.module.css";

interface ServiceCardProps {
    service: ServiceType;
    onEdit: (service: ServiceType) => void;
    onDelete: (id: number) => void;
    canManage: boolean;
}

export default function ServiceCard({ service, onEdit, onDelete, canManage }: ServiceCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <h3>{service.name}</h3>
                <p className={styles.description}>{service.duration} minutos</p>
                <span className={styles.price}>R$ {service.price}</span>
            </div>

            {canManage && (
                <div className={styles.actions}>
                    <button className={styles.btnEdit} onClick={() => onEdit(service)}>
                        Editar
                    </button>
                    <button className={styles.btnDelete} onClick={() => onDelete(service.id)}>
                        Excluir
                    </button>
                </div>
            )}
        </div>
    );
}