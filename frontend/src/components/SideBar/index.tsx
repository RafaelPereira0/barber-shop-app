import { NavLink } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import styles from "./sidebar.module.css"

export default function SideBar() {
    const { user, logout } = useAuth()

    return (
        <aside className={styles.sidebar}>
            <h2 className={styles.logo}>BarberApp</h2>

            <nav className={styles.nav}>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink to="/services" className={styles.link}>
                    Serviços
                </NavLink>

                {user?.role === "ADMIN" && (
                    <NavLink to="/users" className={styles.link}>
                        Equipe/Clientes
                    </NavLink>
                )}
                {user?.role === "CLIENT" && (
                    <NavLink to="/newappointment" className={styles.link}>
                        Novo Agendamento
                    </NavLink>
                )}

                <NavLink to="/appointments" className={styles.link}>
                    Agendamentos
                </NavLink>

                {user?.role === "BARBER" && (
                    <NavLink to="/agenda" className={styles.link}>
                        Sua Agenda
                    </NavLink>
                )}

                <NavLink to="/profile" className={styles.link}>
                    Perfil
                </NavLink>

                <button className={styles.logout} onClick={logout}>
                    Sair
                </button>
            </nav>
        </aside>
    )
}