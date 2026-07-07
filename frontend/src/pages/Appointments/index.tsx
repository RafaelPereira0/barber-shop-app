import { useEffect, useState } from "react";
import type { AppointmentType } from "../../types/appointment";
import { toast } from "sonner";
import { cancelAppointment, getAppointments, updateAppointmentStatus } from "../../api/appointment.api";
import styles from './appointments.module.css'
import { useAuth } from "../../hooks/useAuth";

export default function Appointments() {

    const { user } = useAuth();

    const [appointments, setAppointments] = useState<AppointmentType[]>([])
    const [loading, setLoading] = useState(true)

    const isBotaoDesabilitado = (dateString: string) => {
        if (user?.role !== "CLIENT") return false;

        const agora = new Date();
        const dataAgendamento = new Date(dateString);
        const diferencaEmHoras = (dataAgendamento.getTime() - agora.getTime()) / (1000 * 60 * 60);

        return diferencaEmHoras < 2;
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const response = await getAppointments() as any

            setAppointments(response.result)
        } catch (err) {
            toast.error("Erro ao carregar agendamentos")
        } finally {
            setLoading(false)
        }
    }

    const handelCancelAppointment = async (id: number) => {
        const toastId = toast.loading("Cancelando agendamento...")

        try {
            await cancelAppointment(id)

            setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: "CANCELED" } : app))
            toast.success("Agendamento cancelado com sucesso", { id: toastId })
        } catch (err: any) {
            toast.error(err.response.data.error || "Erro ao cancelar agendamento")
        }
    }

    const handleConfirmAppointment = async (id: number) => {
        const toastId = toast.loading("Confirmando agendamento...")

        try {
            await updateAppointmentStatus(id, "CONFIRMED")
            setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: "CONFIRMED" } : app))

            toast.success("Agendamento confirmado com sucesso", { id: toastId })
        } catch (err: any) {
            toast.error(err.response.data.error || "Erro ao confirmar agendamento")
        }
    }

    const handleFinishAppointment = async (id: number) => {
        const toastId = toast.loading("Finalizando atendimento...");

        try {
            await updateAppointmentStatus(id, "FINISHED");

            setAppointments(prev =>
                prev.map(app => app.id === id ? { ...app, status: "FINISHED" } : app)
            );

            toast.success("Atendimento finalizado com sucesso!", { id: toastId });
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Erro ao finalizar atendimento", { id: toastId });
        }
    };

    useEffect(() => {
        fetchAppointments()
    }, [])

    if (loading) return <p>Carregando seus agendamentos...</p>;

    return (
        <div className={styles.container}>
            <h1>Meus Agendamentos</h1>

            {user?.role === "CLIENT" && (
                <div className={styles.alertBanner}>
                    <span>
                        <strong>Atenção:</strong> Por políticas da barbearia, os agendamentos só podem ser cancelados com até <strong>2 horas de antecedência</strong>.
                    </span>
                </div>
            )}

            {appointments.length === 0 ? (
                <p>Você não possui nenhum agendamento marcado.</p>
            ) : (
                <div className={styles.tableResponsive}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Data / Hora</th>
                                <th>Serviço</th>
                                {(user?.role !== "BARBER") && <th>Barbeiro</th>}
                                {(user?.role !== "CLIENT") && <th>Cliente</th>}
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((app) => {
                                const bloqueadoPorTempo = isBotaoDesabilitado(app.date);
                                const isCancelado = app.status === "CANCELED";

                                return (
                                    <tr key={app.id}>
                                        <td>{new Date(app.date).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td>
                                        <td>{app.service?.name}</td>
                                        {(user?.role !== "BARBER") && (
                                            <td>{app.barber?.name}</td>
                                        )}
                                        {(user?.role !== "CLIENT") && (
                                            <td>{app.client?.name}</td>
                                        )}
                                        <td>
                                            <span className={`${styles.badge} ${styles[app.status.toLowerCase()]}`}>
                                                {app.status === "CONFIRMED" && "Confirmado"}
                                                {app.status === "PENDING" && "Pendente"}
                                                {app.status === "CANCELED" && "Cancelado"}
                                                {app.status === "FINISHED" && "Finalizado"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionsContainer}>
                                                {app.status === "CANCELED" && <span className={styles.disabledText}>Cancelado</span>}
                                                {app.status === "FINISHED" && <span className={styles.finishedText}>Concluído</span>}
                                                {app.status !== "CANCELED" && app.status !== "FINISHED" && (
                                                    <>
                                                        {(user?.role === "ADMIN" || user?.role === "BARBER") && (
                                                            <>
                                                                {app.status === "PENDING" && (
                                                                    <button
                                                                        className={styles.confirmBtn}
                                                                        onClick={() => handleConfirmAppointment(app.id)}
                                                                    >
                                                                        Confirmar
                                                                    </button>
                                                                )}
                                                                {app.status === "CONFIRMED" && (
                                                                    <button
                                                                        className={styles.finishBtn}
                                                                        onClick={() => handleFinishAppointment(app.id)}
                                                                    >
                                                                        Finalizar
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}

                                                        {user?.role === "CLIENT" && (
                                                            bloqueadoPorTempo ? (
                                                                <span className={styles.timeExpiredText} title="Prazo de 2h para cancelamento expirado">
                                                                    Fora do prazo de cancelamento
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    className={styles.cancelBtn}
                                                                    onClick={() => handelCancelAppointment(app.id)} 
                                                                >
                                                                    Cancelar
                                                                </button>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}