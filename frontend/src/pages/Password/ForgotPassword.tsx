import { useState } from "react";
import { toast } from "sonner";
import { forgotPass } from "../../api/resetPass";
import { Link } from "react-router-dom";
import styles from './forgot.module.css'

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            forgotPass(email)
            toast.success("E-mail de recuperação enviado com sucesso!");
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao solicitar recuperação");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Recuperar senha</h1>
                    <p className={styles.subtitle}>
                        Informe o e-mail cadastrado para receber as instruções de redefinição.
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>E-mail</label>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="seu@email.com"
                        />
                    </div>

                    <button type="submit" className={styles.button}>
                        Enviar e-mail
                    </button>
                </form>

                <Link to="/login" className={styles.backToLogin}>
                    Voltar para o login
                </Link>
            </div>
        </div>
    );
}