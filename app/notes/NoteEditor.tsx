"use client"

import {useState, useTransition} from 'react';

import NotePreview from './NotePreview';
import {useSearchParams, useRouter} from "next/navigation";
import endpoint from "../../utils/endpoint";

interface NoteEditorProps {
    noteId?: string | null,
    initialTitle?: string,
    initialBody?: string
}

export default function NoteEditor({noteId, initialTitle, initialBody}: NoteEditorProps) {
    const router = useRouter();
    const searchParams = useSearchParams()
    const [isNavigating, startNavigating] = useTransition();
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);
    const [isSaving, saveNote] = useMutation({
        endpoint: noteId !== null ? `${endpoint}/notes/${noteId}` : `${endpoint}/notes`,
        method: noteId !== null ? 'PUT' : 'POST',
    });
    const [isDeleting, deleteNote] = useMutation({
        endpoint: `${endpoint}/notes/${noteId}`,
        method: 'DELETE',
    });

    async function handleSave() {
        const payload = {title, body};
        const response = await saveNote(payload);
        if(!noteId) {
            startNavigating(()=>{
                setTitle(initialTitle)
                setBody(initialBody)
                router.refresh()
            })
        }
        else {
            startNavigating(() => {
                router.refresh()
                router.replace(`/notes/${noteId}`)
            })
        }
    }

    async function handleDelete() {
        const payload = {};
        const response = await deleteNote(payload);
        startNavigating(() => {
            // router.replace('/notes', {forceOptimisticNavigation: false}) // settings forceOptimisticNavigation to true refreshes the page on redirect
            router.refresh()
        })
    }

    const isDraft = noteId === null;
    return (
        <div className="note-editor">
            <form
                className="note-editor-form"
                autoComplete="off"
                onSubmit={(e) => e.preventDefault()}>
                <label className="offscreen" htmlFor="note-title-input">
                    Enter a title for your note
                </label>
                <input
                    id="note-title-input"
                    type="text"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />
                <label className="offscreen" htmlFor="note-body-input">
                    Enter the body for your note
                </label>
                <textarea
                    id="note-body-input"
                    value={body}
                    onChange={(e) => {
                        setBody(e.target.value);
                    }}
                />
            </form>
            <div className="note-editor-preview">
                <div className="note-editor-menu" role="menubar">
                    <button
                        className="note-editor-done"
                        disabled={isSaving}
                        onClick={() => handleSave()}
                        role="menuitem">
                        <img
                            src="/checkmark.svg"
                            width="14px"
                            height="10px"
                            alt=""
                            role="presentation"
                        />
                        Done
                    </button>
                    {!isDraft && (
                        <button
                            className="note-editor-delete"
                            disabled={isDeleting}
                            onClick={() => handleDelete()}
                            role="menuitem">
                            <img
                                src="/cross.svg"
                                width="10px"
                                height="10px"
                                alt=""
                                role="presentation"
                            />
                            Delete
                        </button>
                    )}
                </div>
                <div className="label label--preview" role="status">
                    Preview
                </div>
                <h1 className="note-title">{title}</h1>
                <NotePreview body={body}/>
            </div>
        </div>
    );
}

function useMutation({
                         endpoint,
                         method
                     }: { endpoint: string, method: string }): [boolean, (payload: Object) => void] {
    const [isSaving, setIsSaving] = useState(false);
    const [didError, setDidError] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    if (didError) {
        // Let the nearest error boundary handle errors while saving.
        throw error;
    }

    async function performMutation(payload: Object) {
        setIsSaving(true);
        try {
            const response = await fetch(
                `${endpoint}`,
                {
                    method,
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error(await response.text());
            }
            return response;
        } catch (e) {
            setDidError(true);
            setError(e as Error);
        } finally {
            setIsSaving(false);
        }
    }

    return [isSaving, performMutation];
}
