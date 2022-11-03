"use client"

import styles from '../notes.module.css'
import Link from "next/link";

export default function Error() {
    return <div className={styles.page}><h1 className={styles.error}>An error occurred loading your note, please try again later.</h1>
        <Link
            className={styles.notesLink}
            href={'/notes'}>Visit your notes</Link></div>
}