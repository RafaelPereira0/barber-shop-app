import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import styles from "./manageSchedule.module.css";
import { getBarberAvailability, setBarberAvailability } from "../../api/availability.api";


const DAYS_OF_WEEK = [
    { id: 1, name: "Segunda-feira" },
    { id: 2, name: "Terça-feira" },
    { id: 3, name: "Quarta-feira" },
    { id: 4, name: "Quinta-feira" },
    { id: 5, name: "Sexta-feira" },
    { id: 6, name: "Sábado" },
    { id: 0, name: "Domingo" },
];

interface LocalSchedule {
    [key: number]: { startTime: string; endTime: string; isActive: boolean };
}

export default function ManageSchedule() {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState<LocalSchedule>({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function loadSchedule() {
        if (!user?.id) return;
        try {
            const data = await getBarberAvailability(user.id);
            

            const initialSchedule: LocalSchedule = {};
            DAYS_OF_WEEK.forEach(d => {
                initialSchedule[d.id] = { startTime: "09:00", endTime: "18:00", isActive: false };
            });


            data.forEach((item: any) => {
                initialSchedule[item.dayOfWeek] = {
                    startTime: item.startTime,
                    endTime: item.endTime,
                    isActive: true
                };
            });

            setSchedule(initialSchedule);
        } catch (err) {
            console.error("Erro ao carregar agenda", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSchedule();
    }, [user?.id]);


    function handleTimeChange(dayId: number, field: "startTime" | "endTime", value: string) {
        setSchedule(prev => ({
            ...prev,
            [dayId]: { ...prev[dayId], [field]: value }
        }));
    }


    async function handleSaveDay(dayId: number) {
        if (!user?.id) return;
        setMessage(null);

        try {
            const dayData = schedule[dayId];
            await setBarberAvailability(user.id, {
                dayOfWeek: dayId,
                startTime: dayData.startTime,
                endTime: dayData.endTime
            });
            

            setSchedule(prev => ({
                ...prev,
                [dayId]: { ...prev[dayId], isActive: true }
            }));

            setMessage({ type: "success", text: "Horário atualizado com sucesso!" });
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "Erro ao salvar horário.";
            setMessage({ type: "error", text: errorMsg });
        }
    }

    if (loading) return <div className={styles.loading}>Carregando configurações da agenda...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Minha Agenda de Atendimento</h1>
                <p>Configure os dias e horários que você estará disponível para receber agendamentos.</p>
            </div>

            {message && (
                <div className={message.type === "success" ? styles.successBox : styles.errorBox}>
                    {message.text}
                </div>
            )}

            <div className={styles.scheduleList}>
                {DAYS_OF_WEEK.map((day) => {
                    const dayConfig = schedule[day.id] || { startTime: "09:00", endTime: "18:00", isActive: false };
                    
                    return (
                        <div key={day.id} className={`${styles.dayRow} ${dayConfig.isActive ? styles.rowActive : ""}`}>
                            <div className={styles.dayInfo}>
                                <span className={styles.dayName}>{day.name}</span>

                            </div>

                            <div className={styles.timeInputs}>
                                <div className={styles.inputGroup}>
                                    <label>Início:</label>
                                    <input 
                                        type="time" 
                                        value={dayConfig.startTime}
                                        onChange={(e) => handleTimeChange(day.id, "startTime", e.target.value)}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Término:</label>
                                    <input 
                                        type="time" 
                                        value={dayConfig.endTime}
                                        onChange={(e) => handleTimeChange(day.id, "endTime", e.target.value)}
                                    />
                                </div>

                                <button 
                                    className={styles.btnSave}
                                    onClick={() => handleSaveDay(day.id)}
                                >
                                    Salvar Dia
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}