import { useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth"
import { LoginSchema, type LoginFormData } from "../../schema/login.schema"
import styles from "./login.module.css"; 

export default function Login(){
    const navigate = useNavigate()
    const { login } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema)
    })

    async function onSubmit(data: LoginFormData){
        try {
            await login(data.email, data.password)
            navigate('/')
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.loginContainer}>
                <div className={styles.header}>
                    <h1 className={styles.brand}>BarberApp</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.field}>
                        <label>E-mail</label>
                        <input placeholder="seu@email.com" {...register("email")}/>
                        {errors.email && (
                            <p className={styles.error}>{errors.email.message}</p>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label>Senha</label>
                        <input type="password" placeholder="••••••••" {...register("password")}/>
                        {errors.password && (
                            <p className={styles.error}>{errors.password.message}</p>
                        )}
                    </div>

                    <button type="submit" className={styles.btnSubmit}>
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    )
}