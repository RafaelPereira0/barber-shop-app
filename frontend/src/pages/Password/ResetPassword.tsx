import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { resetPass } from "../../api/resetPass";
import styles from './reset.module.css'

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return toast.error("Token de validação ausente!");

    setLoading(true);

    try {
      await resetPass(token, newPassword)
      toast.success("Senha alterada! Faça login com a nova senha.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erro ao redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Redefinir Senha</h1>
          <p className={styles.subtitle}>
            Escolha uma nova senha forte para acessar a sua conta.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nova Senha</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Digite a nova senha"
            />
          </div>

          <button type="submit" className={styles.button}>
            Salvar Nova Senha
          </button>
        </form>
      </div>
    </div>
  );
}