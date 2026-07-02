import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import styles from "./profile.module.css";

export default function Profile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Exemplo de estados para os inputs
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    function handleToggleEdit() {
        if (isEditing) {
            // Aqui você chamaria sua função de salvar na API
            console.log("Salvando:", { name, email });
        }
        setIsEditing(!isEditing);
    }

    return (
        <div className={styles.container}>
            <h1>Meu Perfil</h1>

            <div className={styles.formGroup}>
                <label>Nome:</label>
                {isEditing ? (
                    <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                ) : (
                    <p>{name}</p>
                )}
            </div>

            <div className={styles.formGroup}>
                <label>Email:</label>
                {isEditing ? (
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                ) : (
                    <p>{email}</p>
                )}
            </div>

            <button className={styles.btnEdit} onClick={handleToggleEdit}>
                {isEditing ? "Salvar Alterações" : "Editar Perfil"}
            </button>
        </div>
    );
}