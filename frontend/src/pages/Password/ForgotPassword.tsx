import { useState } from "react";
import { toast } from "sonner";
import { forgotPass } from "../../api/resetPass";
import { Link } from "react-router-dom";
import styles from "./forgot.module.css";
import axios from "axios";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email) {
            toast.error("Informe seu e-mail.");
            return;
        }

        setLoading(true);

        try {
            await forgotPass(email);

            toast.success("E-mail de recuperação enviado com sucesso!");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(
                    err.response?.data?.error ||
                    "Erro ao solicitar recuperação"
                );
            } else {
                toast.error("Erro ao solicitar recuperação");
            }
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
                        Informe o e-mail cadastrado para receber as instruções
                        de redefinição.
                    </p>
                </div>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            E-mail
                        </label>

                        <input
                            type="email"
                            className={styles.input}
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Enviar e-mail"}
                    </button>
                </form>

                <Link
                    to="/login"
                    className={styles.backToLogin}
                >
                    Voltar para o login
                </Link>
            </div>
        </div>
    );
}