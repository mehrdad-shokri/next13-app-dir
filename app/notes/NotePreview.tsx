import TextWithMarkdown from './TextWithMarkdown';

export default function NotePreview({body}: { body?: string | null }) {
    return (
        <div className="note-preview">
            <TextWithMarkdown text={body}/>
        </div>
    );
}
