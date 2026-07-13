import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { getAppointments } from "../../api/appointment.api"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import styles from "./dashboard.module.css"
import type { AnalyticsData, FinancialSummary } from "../../types/financial"


const getLocalDateString = (date: Date) => {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date)
}

const getAnalytics = (finalizadosMes: any[]): AnalyticsData => {
    const contagemPorHora: Record<number, number> = {}
    finalizadosMes.forEach((app) => {
        const hora = Number(
            new Date(app.date).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                hour: "2-digit",
                hour12: false,
            })
        )
        contagemPorHora[hora] = (contagemPorHora[hora] ?? 0) + 1
    })

    const horariosPico = Object.entries(contagemPorHora)
        .map(([hora, total]) => ({ hora: `${hora.padStart(2, "0")}h`, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 3)

    const contagemPorServico: Record<string, number> = {}
    finalizadosMes.forEach((app) => {
        const nome = app.service?.name ?? "Desconhecido"
        contagemPorServico[nome] = (contagemPorServico[nome] ?? 0) + 1
    })

    const servicosOrdenados = Object.entries(contagemPorServico)
        .map(([nome, total]) => ({ nome, total }))
        .sort((a, b) => b.total - a.total)

    const faturamentoPorBarbeiro: Record<string, number> = {}
    finalizadosMes.forEach((app) => {
        const nome = app.barber?.name ?? "Desconhecido"
        const price = Number(app.service?.price ?? 0)
        faturamentoPorBarbeiro[nome] = (faturamentoPorBarbeiro[nome] ?? 0) + price
    })

    const rankingBarbeiros = Object.entries(faturamentoPorBarbeiro)
        .map(([nome, faturamento]) => ({ nome, faturamento }))
        .sort((a, b) => b.faturamento - a.faturamento)

    return {
        horariosPico,
        servicoMaisVendido: servicosOrdenados[0] ?? null,
        rankingBarbeiros,
    }
}

const exportarPDF = (summary: FinancialSummary, analytics: AnalyticsData) => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("Relatório Financeiro - Barbearia", 14, 18)
    doc.setFontSize(10)
    doc.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, 14, 25)

    autoTable(doc, {
        startY: 32,
        head: [["Indicador", "Valor"]],
        body: [
            ["Faturamento Hoje", formatBRL(summary.faturamentoHoje)],
            ["Faturamento do Mês", formatBRL(summary.faturamentoMes)],
            ["Ticket Médio", formatBRL(summary.ticketMedio)],
            ["Finalizados no Mês", String(summary.totalFinalizados)],
            ["Cancelados no Mês", String(summary.totalCancelados)],
            ["Taxa de Cancelamento", `${summary.taxaCancelamento.toFixed(1)}%`],
        ],
    })

    autoTable(doc, {
        head: [["Barbeiro", "Faturamento"]],
        body: analytics.rankingBarbeiros.map((b) => [b.nome, formatBRL(b.faturamento)]),
    })

    doc.save(`relatorio-financeiro-${getLocalDateString(new Date())}.pdf`)
}

const exportarExcel = (summary: FinancialSummary, analytics: AnalyticsData) => {
    const resumoSheet = XLSX.utils.json_to_sheet([
        { Indicador: "Faturamento Hoje", Valor: summary.faturamentoHoje },
        { Indicador: "Faturamento do Mês", Valor: summary.faturamentoMes },
        { Indicador: "Ticket Médio", Valor: summary.ticketMedio },
        { Indicador: "Finalizados no Mês", Valor: summary.totalFinalizados },
        { Indicador: "Cancelados no Mês", Valor: summary.totalCancelados },
        { Indicador: "Taxa de Cancelamento (%)", Valor: Number(summary.taxaCancelamento.toFixed(1)) },
    ])

    const rankingSheet = XLSX.utils.json_to_sheet(
        analytics.rankingBarbeiros.map((b) => ({ Barbeiro: b.nome, Faturamento: b.faturamento }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, resumoSheet, "Resumo")
    XLSX.utils.book_append_sheet(workbook, rankingSheet, "Ranking Barbeiros")

    XLSX.writeFile(workbook, `relatorio-financeiro-${getLocalDateString(new Date())}.xlsx`)
}

const formatBRL = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export default function Dashboard() {
    const { user } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const toastDisparado = useRef(false)

    const [summary, setSummary] = useState<FinancialSummary | null>(null)
    const [loading, setLoading] = useState(false)
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [preset, setPreset] = useState<PeriodoPreset>("ESTE_MES")
    const [inicioCustom, setInicioCustom] = useState(getLocalDateString(new Date()))
    const [fimCustom, setFimCustom] = useState(getLocalDateString(new Date()))


    type PeriodoPreset = "HOJE" | "ESTE_MES" | "MES_PASSADO" | "PERSONALIZADO"

    const getRangeFromPreset = (preset: PeriodoPreset, inicioCustom?: string, fimCustom?: string) => {
        const now = new Date()

        if (preset === "HOJE") {
            const hoje = getLocalDateString(now)
            return { inicio: hoje, fim: hoje }
        }

        if (preset === "ESTE_MES") {
            const primeiroDia = new Date(now.getFullYear(), now.getMonth(), 1)
            return { inicio: getLocalDateString(primeiroDia), fim: getLocalDateString(now) }
        }

        if (preset === "MES_PASSADO") {
            const primeiroDiaMesPassado = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const ultimoDiaMesPassado = new Date(now.getFullYear(), now.getMonth(), 0)
            return { inicio: getLocalDateString(primeiroDiaMesPassado), fim: getLocalDateString(ultimoDiaMesPassado) }
        }

        return { inicio: inicioCustom ?? getLocalDateString(now), fim: fimCustom ?? getLocalDateString(now) }
    }

    const podeVerFinanceiro = user?.role === "ADMIN"

    useEffect(() => {
        const { message, type } = (location.state as any) || {}
        if (message && !toastDisparado.current) {
            toastDisparado.current = true
            if (type === 'success') {
                toast.success(message, { duration: 3000 })
            } else {
                toast.info(message, { duration: 4000 })
            }
            navigate(location.pathname, { replace: true, state: null })
        }
    }, [location, navigate])

    useEffect(() => {
        if (!podeVerFinanceiro) return

        const { inicio, fim } = getRangeFromPreset(preset, inicioCustom, fimCustom)

        const fetchFinanceiro = async () => {
            setLoading(true)
            try {
                const response = await getAppointments()
                const appointments = response

                const now = new Date()
                const hojeString = getLocalDateString(now)

                const doPeriodo = appointments.filter((app: any) => {
                    const appDateString = getLocalDateString(new Date(app.date))
                    return appDateString >= inicio && appDateString <= fim
                })
                console.log("Agendamentos filtrados que entraram no mês:",
                    doPeriodo.map(app => ({
                        data: app.date,
                        status: app.status,
                        price: app.service?.price
                    }))
                )

                const finalizadosMes = doPeriodo.filter((app: any) => app.status === "FINISHED")
                const canceladosMes = doPeriodo.filter((app: any) => app.status === "CANCELED")

                let faturamentoHoje = 0
                let faturamentoMes = 0

                finalizadosMes.forEach((app: any) => {
                    const price = Number(app.service?.price ?? 0)
                    faturamentoMes += price

                    const appDataString = getLocalDateString(new Date(app.date))
                    if (appDataString === hojeString) {
                        faturamentoHoje += price
                    }
                })

                const ticketMedio = finalizadosMes.length > 0
                    ? faturamentoMes / finalizadosMes.length
                    : 0

                const totalComDesfecho = finalizadosMes.length + canceladosMes.length
                const taxaCancelamento = totalComDesfecho > 0
                    ? (canceladosMes.length / totalComDesfecho) * 100
                    : 0

                setSummary({
                    faturamentoHoje,
                    faturamentoMes,
                    ticketMedio,
                    totalFinalizados: finalizadosMes.length,
                    totalCancelados: canceladosMes.length,
                    taxaCancelamento,
                })

                if (podeVerFinanceiro) {
                    setAnalytics(getAnalytics(finalizadosMes))
                }
            } catch (error) {
                console.error("Erro detalhado:", error)
                toast.error("Erro ao carregar dados financeiros")
            } finally {
                setLoading(false)
            }
        }

        fetchFinanceiro()

    }, [podeVerFinanceiro, preset, inicioCustom, fimCustom])

    return (
        <>
            <h2>Bem Vindo {user?.name}</h2>

            {podeVerFinanceiro && (
                <section className={styles.ledger}>
                    <div className={styles.ledgerHeader}>
                        <span className={styles.ledgerEyebrow}>Resumo Financeiro</span>
                        <span className={styles.ledgerDate}>
                            {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                    </div>

                    {loading && <p className={styles.ledgerLoading}>Carregando dados financeiros...</p>}

                    {!loading && summary && (
                        <>
                            <div className={styles.filterBar}>
                                <button
                                    className={`${styles.filterBtn} ${preset === "HOJE" ? styles.filterBtnActive : ""}`}
                                    onClick={() => setPreset("HOJE")}
                                >
                                    Hoje
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${preset === "ESTE_MES" ? styles.filterBtnActive : ""}`}
                                    onClick={() => setPreset("ESTE_MES")}
                                >
                                    Este Mês
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${preset === "MES_PASSADO" ? styles.filterBtnActive : ""}`}
                                    onClick={() => setPreset("MES_PASSADO")}
                                >
                                    Mês Passado
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${preset === "PERSONALIZADO" ? styles.filterBtnActive : ""}`}
                                    onClick={() => setPreset("PERSONALIZADO")}
                                >
                                    Personalizado
                                </button>

                                {preset === "PERSONALIZADO" && (
                                    <div className={styles.customRange}>
                                        <input
                                            type="date"
                                            value={inicioCustom}
                                            onChange={(e) => setInicioCustom(e.target.value)}
                                            className={styles.dateInput}
                                        />
                                        <span>até</span>
                                        <input
                                            type="date"
                                            value={fimCustom}
                                            onChange={(e) => setFimCustom(e.target.value)}
                                            className={styles.dateInput}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={styles.ledgerGrid}>
                                <div className={styles.ticket}>
                                    <span className={styles.ticketLabel}>Faturamento Hoje</span>
                                    <span className={styles.ticketValue}>{formatBRL(summary.faturamentoHoje)}</span>
                                </div>
                                {preset !== "HOJE" && (
                                    <div className={styles.ticket}>
                                        <span className={styles.ticketLabel}>Faturamento do Mês</span>
                                        <span className={styles.ticketValue}>{formatBRL(summary.faturamentoMes)}</span>
                                    </div>
                                )}

                                <div className={styles.ticket}>
                                    <span className={styles.ticketLabel}>Ticket Médio</span>
                                    <span className={styles.ticketValue}>{formatBRL(summary.ticketMedio)}</span>
                                </div>
                                <div className={styles.ticket}>
                                    <span className={styles.ticketLabel}>Finalizados no Mês</span>
                                    <span className={styles.ticketValue}>{summary.totalFinalizados}</span>
                                </div>
                                <div className={`${styles.ticket} ${styles.ticketNegative}`}>
                                    <span className={styles.ticketLabel}>Cancelados no Mês</span>
                                    <span className={styles.ticketValue}>{summary.totalCancelados}</span>
                                </div>
                                <div className={`${styles.ticket} ${styles.ticketNegative}`}>
                                    <span className={styles.ticketLabel}>Taxa de Cancelamento</span>
                                    <span className={styles.ticketValue}>{summary.taxaCancelamento.toFixed(1)}%</span>
                                </div>
                            </div>
                        </>

                    )}

                    {podeVerFinanceiro && !loading && summary && analytics && (
                        <div className={styles.analyticsBlock}>
                            <div className={styles.analyticsRow}>
                                <div className={styles.analyticsCard}>
                                    <span className={styles.ticketLabel}>Serviço Mais Vendido</span>
                                    <span className={styles.analyticsValue}>
                                        {analytics.servicoMaisVendido?.nome ?? "—"}
                                    </span>
                                    <span className={styles.analyticsSub}>
                                        {analytics.servicoMaisVendido?.total ?? ""}
                                    </span>
                                </div>

                                <div className={styles.analyticsCard}>
                                    <span className={styles.ticketLabel}>Horários de Pico</span>
                                    <ul className={styles.picoList}>
                                        {analytics.horariosPico.map((h) => (
                                            <li key={h.hora}>
                                                <span>{h.hora}</span>
                                                <span>{h.total} atend.</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className={styles.rankingSection}>
                                <span className={styles.ledgerEyebrow}>Ranking de Barbeiros</span>
                                <ol className={styles.rankingList}>
                                    {analytics.rankingBarbeiros.map((b, i) => (
                                        <li key={b.nome} className={styles.rankingItem}>
                                            <span className={styles.rankingPos}>{i + 1}º</span>
                                            <span className={styles.rankingNome}>{b.nome}</span>
                                            <span className={styles.rankingValor}>{formatBRL(b.faturamento)}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className={styles.exportButtons}>
                                <button onClick={() => exportarPDF(summary, analytics)} className={styles.exportBtnPdf}>
                                    Exportar PDF
                                </button>
                                <button onClick={() => exportarExcel(summary, analytics)} className={styles.exportBtnExcel}>
                                    Exportar Excel
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </>
    )
}