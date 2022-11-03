import {format, isToday} from 'date-fns';
import marked from 'marked';

import ClientSidebarNote from './SidebarNote.client';

export default function SidebarNote({note}: { note: Note }) {
    const updatedAt = new Date(note.updated_at);
    const lastUpdatedAt = isToday(updatedAt)
        ? format(updatedAt, 'h:mm bb')
        : format(updatedAt, 'M/d/yy');
    const summary = note.body;
    return (
        <ClientSidebarNote
            id={note.id}
            title={note.title}
            expandedChildren={
                <p className="sidebar-note-excerpt">{summary || <i>(No content)</i>}</p>
            }>
            <header className="sidebar-note-header">
                <strong>{note.title}</strong>
                <small>{lastUpdatedAt}</small>
            </header>
        </ClientSidebarNote>
    );
}
