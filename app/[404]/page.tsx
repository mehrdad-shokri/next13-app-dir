import styles from './notfound.module.css'
import Link from "next/link";

export default function NotFound() {
    return <div className={styles.page}><h1>The page you were looking for could not be found</h1>
        <Link
            className={styles.notesLink}
            href={'/notes'}>Visit your notes</Link></div>
}