import { useForm } from "react-hook-form"
import { ServiceSchema, type ServiceFormData } from "../../schema/service.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { createService, updateService } from "../../api/services.api"
import type { ServiceType } from "../../types/service";
import { useEffect } from "react";
import styles from "./serviceForm.module.css";

interface Props {
    service?: ServiceType | null;
    onSuccess: () => void;
}

export default function ServiceForm({ service, onSuccess }: Props) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ServiceFormData>({ resolver: zodResolver(ServiceSchema) })

    async function onSubmit(data: ServiceFormData) {
        try {
            if (service) {
                await updateService(service.id, data)
            } else {
                await createService(data)
            }

            onSuccess()
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (service) {
            reset({
                name: service.name,
                duration: service.duration,
                price: service.price
            })
        } else {
            reset({ name: "", duration: undefined, price: undefined }) // Limpa o form ao clicar em Novo
        }
    }, [service, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h2 className={styles.title}>
                {service ? "Editar Serviço" : "Cadastrar Novo Serviço"}
            </h2>

            <div className={styles.field}>
                <label>Nome do Serviço</label>
                <input placeholder="Ex: Corte de Cabelo Degradê" {...register("name")} />
                {errors.name?.message && <p className={styles.error}>{errors.name?.message}</p>}
            </div>

            <div className={styles.field}>
                <label>Valor (R$)</label>
                <input type="number" step="0.01" placeholder="Ex: 45.00" {...register("price", { valueAsNumber: true })} />
                {errors.price?.message && <p className={styles.error}>{errors.price?.message}</p>}
            </div>

            <div className={styles.field}>
                <label>Duração (em minutos)</label>
                <input type="number" placeholder="Ex: 30" {...register("duration", { valueAsNumber: true })} />
                {errors.duration?.message && <p className={styles.error}>{errors.duration?.message}</p>}
            </div>

            <button type="submit" className={styles.btnSubmit}>
                {service ? "Salvar Alterações" : "Criar Serviço"}
            </button>
        </form>
    )
}