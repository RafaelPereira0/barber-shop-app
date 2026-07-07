import { useEffect, useState } from "react"
import type { ServiceType } from "../../types/service"
import type { Barber } from "../../types/user"
import { getServices } from "../../api/services.api"
import { getBarbers } from "../../api/user.api"
import type { TimeSlot } from "../../types/appointment"
import { createAppointment, getAvailableSlots } from "../../api/appointment.api"
import { useNavigate } from "react-router-dom"
import styles from './newappointments.module.css'

export default function NewAppointments() {

    const [services, setServices] = useState<ServiceType[]>([])
    const [barbers, setBarbers] = useState<Barber[]>([])
    const [slots, setSlots] = useState<TimeSlot[]>([])

    const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
    const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [selectedTime, setSelectedTime] = useState<string>("")

    const [loadingSlots, setLoadingSlots] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        async function initialData() {
            try {
                const serviceData = await getServices()
                const barbersData = await getBarbers()

                setServices(serviceData)
                setBarbers(barbersData)
            } catch (err) {
                setError("Erro ao carregar dados iniciais.");
            }
        }

        initialData()
    }, [])

    useEffect(() => {
        async function fetchSlot() {
            if (!selectedBarber || !selectedDate || !selectedDate) {
                setSlots([])
                return
            }

            setLoadingSlots(true)
            setSelectedTime("")

            try {
                const availableSlots = await getAvailableSlots({
                    barberId: selectedBarber.id,
                    serviceId: Number(selectedService?.id),
                    date: selectedDate
                }) as any

                if (availableSlots && availableSlots.result) {
                    setSlots(availableSlots.result);
                } else {
                    setSlots([]);
                }

            } catch (err) {
                setError("Erro ao buscar horários disponíveis.");
            } finally {
                setLoadingSlots(false)
            }
        }
        fetchSlot()
    }, [selectedBarber, selectedDate, selectedService])


    async function handleConfirmAppointment() {
        if (!selectedBarber || !selectedDate || !selectedService) return

        const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}:00`)
        setSubmitting(true);

        try {
            await createAppointment({
                serviceId: selectedService?.id,
                barberId: selectedBarber.id,
                date: appointmentDateTime.toISOString()
            })

            navigate('/', {
                state: {
                    message: 'Agendamento realizado com sucesso!',
                    type: 'success'
                }
            });
        } catch (err: any) {
            setError(err.response?.data?.error || "Erro ao criar agendamento.");
        } finally {
            setSubmitting(false);
        }
    }

    const todayStr = new Date().toISOString().split("T")[0];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Agendar um Horário</h1>

            {error && <div className={styles.errorBox}>{error}</div>}

            <section className={styles.section}>
                <h2>1. Escolha o Serviço</h2>
                <div className={styles.grid}>
                    {services.map(service => (
                        <button
                            key={service.id}
                            className={`${styles.card} ${selectedService?.id === service.id ? styles.cardActive : ""}`}
                            onClick={() => setSelectedService(service)}
                        >
                            <h3>{service.name}</h3>
                            <p>{service.duration} min • R$ {Number(service.price).toFixed(2)}</p>
                        </button>
                    ))}
                </div>
            </section>

            {selectedService && (
                <section className={styles.section}>
                    <h2>2. Escolha o Profissional</h2>
                    <div className={styles.grid}>
                        {barbers.map(barber => (
                            <button
                                key={barber.id}
                                className={`${styles.card} ${selectedBarber?.id === barber.id ? styles.cardActive : ""}`}
                                onClick={() => setSelectedBarber(barber)}
                            >
                                <h3>{barber.name}</h3>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {selectedBarber && (
                <section className={styles.section}>
                    <h2>3. Selecione a Data</h2>
                    <input
                        type="date"
                        min={todayStr}
                        value={selectedDate}
                        className={styles.dateInput}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </section>
            )}

            {selectedDate && (
                <section className={styles.section}>
                    <h2>4. Horários Disponíveis para {selectedDate.split("-").reverse().join("/")}</h2>

                    {loadingSlots ? (
                        <p>Consultando agenda do barbeiro...</p>
                    ) : slots.length === 0 ? (
                        <p className={styles.warningText}>O barbeiro não atende nesta data ou não há mais horários livres.</p>
                    ) : (
                        <div className={styles.slotsGrid}>
                            {Array.isArray(slots) && slots.map(slot => (
                                <button
                                    key={slot.time}
                                    disabled={!slot.available}
                                    className={`${styles.slotButton} ${selectedTime === slot.time ? styles.slotActive : ""}`}
                                    onClick={() => setSelectedTime(slot.time)}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {selectedTime && (
                <div className={styles.footer}>
                    <div className={styles.summary}>
                        <p><strong>Resumo:</strong> {selectedService?.name} com {selectedBarber?.name}</p>
                        <p>Dia {selectedDate.split("-").reverse().join("/")} às {selectedTime}</p>
                    </div>
                    <button
                        disabled={submitting}
                        className={styles.btnConfirm}
                        onClick={handleConfirmAppointment}
                    >
                        {submitting ? "Agendando..." : "Confirmar Agendamento"}
                    </button>
                </div>
            )}
        </div>
    )
}