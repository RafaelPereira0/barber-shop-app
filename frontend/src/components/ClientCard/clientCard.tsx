import { Trash2 } from "lucide-react"; 
import styles from "./clientCard.module.css"; 
import type { Client } from "../../types/user";


interface ClientCardProps {
    client: Client;
    onDelete: (id: number) => void;
    canManage: boolean;
}

export function ClientCard({ client, onDelete, canManage }: ClientCardProps) {
    const initials = client.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className={styles.clientCard}>
            <div className={styles.clientInfo}>
                <span className={styles.avatarClient}>
                    {initials}
                </span>
                <div className={styles.details}>
                    <h4>{client.name}</h4>
                    <p>{client.email}</p>
                </div>
            </div>  

            {canManage && (
                <div className={styles.actions}>
                    <button 
                        onClick={() => onDelete(client.id)} 
                        className={styles.btnDelete}
                        title="Excluir cliente"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}