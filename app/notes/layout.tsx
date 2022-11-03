import './globals.css'
import React, {Suspense} from "react";
import SearchField from './SearchField'
import EditButton from "./EditButton";
import NoteListSkeleton from "./NoteListSkeleton";
import NoteList from "./NoteList";
import {cookies} from 'next/headers';

interface NotesLayoutParams {
    children: React.ReactNode,
    params: {},
    searchParams: {}
}

export default async function NotesLayout({children, params, searchParams}: NotesLayoutParams) {
    const searchText: string | undefined  = cookies().get('searchTerm')?.value;

    return <div className="main">
        <section className="col sidebar">
            <section className="sidebar-header">
                <img
                    className="logo"
                    src="/logo.svg"
                    width="22px"
                    height="20px"
                    alt=""
                    role="presentation"
                />
                <strong>Next.js Notes</strong>
            </section>
            <section className="sidebar-menu" role="menubar">
                <SearchField/>
                <EditButton>New</EditButton>
            </section>
            <nav>
                <Suspense fallback={<NoteListSkeleton/>}>
                    <NoteList searchText={searchText}/>
                </Suspense>
            </nav>
        </section>
        <section className="col note-viewer">
            {children}
        </section>
    </div>
}