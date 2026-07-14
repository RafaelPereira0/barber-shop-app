import { useForm } from "react-hook-form";
import type {  UserFormData, UserType } from "../../types/user";
import { createBarber, updateUser } from "../../api/user.api";
import styles from './barberForm.module.css'
import { useEffect } from "react";
import { toast } from "sonner";

interface props {
    barber?: UserType | null,
    onSuccess: () => void
}

export default function BarberForm({ barber, onSuccess }: props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UserFormData>()

    async function onSubmit(data: UserFormData) {
        try {
            if (barber) {
                const payload: Partial<UserFormData> = { ...data };

                if (!payload.password || payload.password.trim() === "") {
                    delete payload.password;
                }

                await updateUser(barber.id, payload);
            } else {
                await createBarber(data)
            }
            reset(),
                onSuccess()
        } catch (err: any) {
            toast.error(err.response.data.error || "Ocorreu um erro!");
        }
    }

    useEffect(() => {
        if (barber) {
            reset({
                name: barber.name,
                email: barber.email,
                password: ""
            })
        } else {
            reset({ name: "", email: "", password: "" })
        }
    }, [barber, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h2 className={styles.title}>
                {barber ? `Editar Profissional ${barber.name}` : "Cadastrar Profissional"}
            </h2>

            <div className={styles.field}>
                <label>Nome do Profissional</label>
                <input placeholder="Ex: Lucas Silva" {...register("name", { required: "Nome é obrigatório" })} />
                {errors.name && <p className={styles.error}>{errors.name.message}</p>}
            </div>

            <div className={styles.field}>
                <label>E-mail de Acesso</label>
                <input type="email" placeholder="Ex: barbeiro@email.com" {...register("email", { required: "E-mail é obrigatório" })} />
                {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>

            {!barber && (
                <div className={styles.field}>
                    <label>Senha de Acesso</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        {...register("password", {
                            required: "A senha é obrigatória",
                            minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres" }
                        })}
                    />
                    {errors.password && <p className={styles.error}>{errors.password.message}</p>}
                </div>
            )}

            <button type="submit" className={styles.btnSubmit}>
                {barber ? "Editar" : "Cadastrar"}
            </button>
        </form>
    )
}