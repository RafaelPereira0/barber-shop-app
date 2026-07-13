export interface FinancialSummary {
    faturamentoHoje: number
    faturamentoMes: number
    ticketMedio: number
    totalFinalizados: number
    totalCancelados: number
    taxaCancelamento: number
}

export interface AnalyticsData {
    horariosPico: { hora: string; total: number }[]
    servicoMaisVendido: { nome: string; total: number } | null
    rankingBarbeiros: { nome: string; faturamento: number }[]
}