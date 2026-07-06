import ManageSchedule from "../../components/ManageSchedule";
import styles from "./schedule.module.css"; 

export default function Schedule() {
    return (
        <div className={styles.pageContainer}>
            <ManageSchedule />
        </div>
    );
}