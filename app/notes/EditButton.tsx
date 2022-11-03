"use client"

import React, {useTransition} from 'react';
import {useRouter} from "next/navigation";


export default function EditButton({noteId, children}: {noteId?: String, children: React.ReactNode}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()
  const isDraft = noteId == null;
  return (
    <button
      className={[
        'edit-button',
        isDraft ? 'edit-button--solid' : 'edit-button--outline',
      ].join(' ')}
      disabled={isPending}
      onClick={() => {
          if(isDraft)
              router.push(`/notes/new`)
          else
              router.push(`/notes/${noteId}/edit`)
      }}
      role="menuitem">
      {children}
    </button>
  );
}
