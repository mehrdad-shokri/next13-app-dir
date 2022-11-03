"use client"

import styles from '../notes.module.css'
import Link from "next/link";
import {redirect} from "next/navigation";

export default function Error() {
    return <div className={styles.page}><h1 className={styles.error}>An error occurred creating your note</h1>
        <Link
            className={styles.notesLink}
            href={'#'} onClick={e => {
            e.preventDefault()
            redirect('/notes/new')
        }}>Try again</Link></div>
        }