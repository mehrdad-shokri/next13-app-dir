"use client"

import React, {useState, useRef, useEffect, useTransition} from 'react';
import {useRouter} from "next/navigation";


interface SidebarNoteProps {
    id: String,
    title: String,
    children: React.ReactNode,
    expandedChildren: React.ReactNode
}

export default function SidebarNote({id, title, children, expandedChildren}: SidebarNoteProps) {
    const [isPending, startTransition] = useTransition();
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter()
    const isActive = id === null;

    // Animate after title is edited.
    const itemRef = useRef<HTMLDivElement>(null);
    const prevTitleRef = useRef(title);
    useEffect(() => {
        if (title !== prevTitleRef.current) {
            prevTitleRef.current = title;
            itemRef.current?.classList.add('flash');
        }
    }, [title]);

    return (
        <div
            ref={itemRef}
            onAnimationEnd={() => {
                itemRef.current?.classList.remove('flash');
            }}
            className={[
                'sidebar-note-list-item',
                isExpanded ? 'note-expanded' : '',
            ].join(' ')}>
            {children}
            <button
                className="sidebar-note-open"
                style={{
                    backgroundColor: isPending
                        ? 'var(--gray-80)'
                        : isActive
                            ? 'var(--tertiary-blue)'
                            : undefined,
                    border: isActive
                        ? '1px solid var(--primary-border)'
                        : '1px solid transparent',
                }}
                onClick={() => {
                    startTransition(() => {
                        router.push(`/notes/${id}`);
                    });
                }}>
                Open note for preview
            </button>
            <button
                className="sidebar-note-toggle-expand"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}>
                {isExpanded ? (
                    <img
                        src="/chevron-down.svg"
                        width="10px"
                        height="10px"
                        alt="Collapse"
                    />
                ) : (
                    <img src="/chevron-up.svg" width="10px" height="10px" alt="Expand"/>
                )}
            </button>
            {isExpanded && expandedChildren}
        </div>
    );
}
