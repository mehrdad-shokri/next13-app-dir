import SidebarNote from './SidebarNote';
import {asyncComponent} from "../../utils/async_component";

export default asyncComponent(async function NoteList({searchText}: { searchText?: String | null }) {
        let notes;
        if (searchText)
            notes = await (await fetch(`http://localhost:4000/notes?q=${searchText}`)).json();
        else notes = await (await fetch('http://localhost:4000/notes')).json()

        return notes.length > 0 ? (
            <ul className="notes-list">
                {notes.map((note: Note) => (
                    <li key={note.id}>
                        <SidebarNote note={note}/>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="notes-empty">
                {searchText
                    ? `Couldn't find any notes titled "${searchText}".`
                    : 'No notes created yet!'}{' '}
            </div>
        );
    }
)