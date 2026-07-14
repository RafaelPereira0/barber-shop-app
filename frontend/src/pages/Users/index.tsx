import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import styles from "./users.module.css";
import { deleteUser, getUsers } from "../../api/user.api";
import type { UserType } from "../../types/user";
import BarberForm from "../../components/BarberForm/BarberForm";
import BarberCard from "../../components/BarberCard/barberCard";
import { toast } from "sonner";
import { ClientCard } from "../../components/ClientCard/clientCard";
import { showConfirmModal } from "../../utils/confirmModal";

export default function Users() {
    const { user } = useAuth();
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false)
    const [activeTab, setActiveTab] = useState<"barbers" | "clients">("barbers")
    const [selectedBarber,setSelectedBarber] = useState<UserType | null>(null)

    async function loadUsers() {
        try {
            const response = await getUsers();
            setUsers(response);
        } catch (err: any) {
            toast.error(err.response.data.error || "Ocorreu um erro!");
        } finally {
            setLoading(false);
        }
    }

    async function handleEdit(barber: UserType) {
        setSelectedBarber(barber)
        setShowForm(true)
    }

    async function handleDelete(id: number) {
        const confirmed = await showConfirmModal({
            title: "Deseja remover este usuário?",
            text: "O usuário será permanentemente excluído do sistema",
            confirmButtonText: "Excluir"
        })

        if(!confirmed) return
        try{
            const response = await deleteUser(id)
            toast.success(response.message || "Usuário deletado com sucesso!")
            loadUsers()
        }catch(err: any){
            toast.error(err.response.data.error || "Ocorreu um erro!");
        }
    }


    useEffect(() => {
        loadUsers();
    }, []);

    const barbers = users.filter((u) => u.role === "BARBER" || u.role === "ADMIN")
    const clients = users.filter((u) => u.role === "CLIENT")
  
    if (loading) return <div className={styles.loading}>Carregando serviços...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Usuários</h1>

                {user?.role !== "CLIENT" && (
                    <button className={showForm ? styles.btnCancel : styles.btnNew}
                        onClick={() => {setSelectedBarber(null); setShowForm(!showForm)}}
                    >
                        {showForm ? "Cancelar" : "Novo Barbeiro"}
                    </button>
                )}
            </div>

            {showForm && (
                <div className={styles.formContainer}>
                    <BarberForm
                        barber={selectedBarber}
                        onSuccess={() => { setShowForm(false); loadUsers(); setSelectedBarber(null) }}
                    />
                </div>
            )}

            <div className={styles.tabs}>
                <button className={activeTab === "barbers" ? styles.tabActive : styles.tab}
                    onClick={() => { setShowForm(false); setActiveTab("barbers"); }}>
                    Equipe / Barbeiros ({barbers.length})
                </button>
                <button className={activeTab === "clients" ? styles.tabActive : styles.tab}
                    onClick={() => { setShowForm(false); setActiveTab("clients"); }}>
                    Clientes ({clients.length})
                </button>
            </div>

            <div className={styles.grid}>
                {activeTab === "barbers" ? (
                    barbers.length === 0 ? (
                        <p className={styles.empty}>Nenhum barbeiro cadastrado</p>
                    ) : (
                        barbers.map((b) => (
                            <BarberCard
                                key={b.id}
                                barber={b}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                canManage={user?.role === "ADMIN"}
                            />
                        ))
                    )
                ) : (
                    clients.length === 0 ? (
                        <p className={styles.empty}>Nenhum cliente cadastrado</p>
                    ) : (
                        clients.map((c) => (
                            <ClientCard
                                key={c.id}
                                client={c}
                                onDelete={handleDelete}
                                canManage={user?.role === "ADMIN"}
                            />
                        ))
                    )
                )}
            </div>
        </div>
    );
}