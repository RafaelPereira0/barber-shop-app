import type { UserType } from "../../types/user";
import styles from './barberCard.module.css'

interface BarberCardProps{
    barber: UserType,
    onEdit: (barber: UserType) => void,
    onDelete: (id: number) => void,
    canManage: boolean
}

export default function BarberCard({barber, onEdit, canManage, onDelete}: BarberCardProps){
    return(
        <div className={styles.card}>
            <div className={styles.info}>
                <span className={styles.avatar}>
                    {barber.name.toUpperCase()}
                </span>

                <div>
                    <h4>{barber.name}</h4>
                    <p>{barber.email}</p>
                </div>
            </div>

            <div className={styles.rightSection}>
                <span className={`${styles.badge} ${barber.role === "ADMIN" ? styles.badgeAdmin : styles.badgeBarber}`}>
                    {barber.role}
                </span>

                {canManage && (
                    <div className={styles.actions}>
                        <button className={styles.btnEdit} onClick={() => onEdit(barber)}>
                            Editar
                        </button>
                        <button className={styles.btnDelete} onClick={() => onDelete(barber.id)}>
                            Excluir
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}