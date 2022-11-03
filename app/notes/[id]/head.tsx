export default async function Head({params}: { params: { id?: string } }) {
    const note = await (await fetch(`http://localhost:4000/notes/${params.id}`)).json();

    return (
        <>
            <title>`Note: ${note.title}`</title>
        </>
    )
}