import Note from "../../Note";
import {Suspense} from "react";

export default function NotePage({params}: { params: { id: string } }) {

    return <Note selectedId={params.id} isEditing/>
}