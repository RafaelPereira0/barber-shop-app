import { Outlet } from "react-router-dom"
import SideBar from "../SideBar"
import styles from './layout.module.css'

export default function Layout(){
    return(
        <div className={styles.container}>
            <SideBar/>

            <main className={styles.main}>
                <div className={styles.content}>
                    <Outlet/>
                </div>
            </main>
        </div>
    )
}