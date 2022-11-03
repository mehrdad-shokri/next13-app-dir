import {format} from 'date-fns';

import NotePreview from './NotePreview';
import EditButton from './EditButton';
import NoteEditor from './NoteEditor';
import {asyncComponent} from "../../utils/async_component";
import endpoint from "../../utils/endpoint";
import {notFound} from "next/navigation";

interface NoteProps {
    selectedId?: string,
    isEditing?: boolean
}

export default asyncComponent(async function Note({selectedId, isEditing}: NoteProps) {
        let note;
        if (selectedId) {
                try{
                    note = await (await fetch(`${endpoint}/notes/${selectedId}`)).json()
                }
                catch (e){
                    notFound()
                }
        }
        if (!note) {
            if (isEditing) {
                return (
                    <NoteEditor noteId={null} initialTitle="Untitled" initialBody=""/>
                );
            } else {
                return (
                    <div className="note--empty-state">
          <span className="note-text--empty-state">
            Click a note on the left to view something! 🥺
          </span>
                    </div>
                );
            }
        }

        let {id, title, body, updated_at} = note;
        const updatedAt = new Date(updated_at);

        if (isEditing) {
            return <NoteEditor noteId={id} initialTitle={title} initialBody={body}/>;
        } else {
            return (
                <div className="note">
                    <div className="note-header">
                        <h1 className="note-title">{title}</h1>
                        <div className="note-menu" role="menubar">
                            <small className="note-updated-at" role="status">
                                Last updated on {format(updatedAt, "d MMM yyyy 'at' h:mm bb")}
                            </small>
                            <EditButton noteId={id}>Edit</EditButton>
                        </div>
                    </div>
                    <NotePreview body={body}/>
                </div>
            );
        }
    }
)