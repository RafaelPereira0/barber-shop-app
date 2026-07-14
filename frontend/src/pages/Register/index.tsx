import { useState } from "react";
import { useForm } from "react-hook-form";
import { type RegisterFormData, registerSchema } from "../../schema/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "../../api/user.api";
import { toast } from "sonner";
import styles from './register.module.css'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Register() {
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })

    async function handleRegister(data: RegisterFormData) {
        try {
            setLoading(true)
            const response = await createUser(data)
            toast.success(response.message || "Usuário criado com sucesso!")
            console.log(response)
            await login(data.email, data.password)
            navigate('/')
        } catch (err: any) {
            if(err.response){
                console.log(err)
                toast.error(err.response.data.error || "Erro ao cadastrar usuário")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.registerContainer}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Crie sua conta!</h3>
                    <h4 className={styles.subtitle}>Cadastre-se para agendar seus horários!</h4>
                </div>

                <form onSubmit={handleSubmit(handleRegister)} className={styles.form}>
                    <div className={styles.field}>
                        <label>Nome Completo</label>
                        <input type="text" placeholder="Digite seu nome" {...register("name")} />
                        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
                    </div>

                    <div className={styles.field}>
                        <label>E-mail</label>
                        <input type="text" placeholder="exemplo@email.com" {...register("email")} />
                        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                    </div>

                    <div className={styles.field}>
                        <label>Senha</label>
                        <input type="password" placeholder="Mínimo 6 caracteres" {...register("password")} />
                        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
                    </div>

                    <button type="submit" className={styles.btnSubmit} disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Já possui uma conta?</p>
                    <Link to="/login" className={styles.btnLogin}>
                        Entrar!
                    </Link>
                </div>
            </div>
        </div>
    );
}