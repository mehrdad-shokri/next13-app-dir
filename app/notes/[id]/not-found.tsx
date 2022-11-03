import styles from '../notes.module.css'
import Link from "next/link";

export default function NotFound() {
    return <div className={styles.page}><h1>The Note you were looking for could not be found</h1></div>
}