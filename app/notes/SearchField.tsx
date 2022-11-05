"use client"

import {useCallback, useEffect, useMemo, useState, useTransition} from 'react';

import Spinner from './Spinner';
import {useSearchParams, useRouter, usePathname} from "next/navigation";
import Cookies from 'js-cookie'

const debounce = require("lodash.debounce");

export default function SearchField() {
    const [text, setText] = useState('');
    const [isSearching, startSearching] = useTransition();
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const router = useRouter()
    const searchNotes = useMemo(() => debounce((newText: string) => {
        startSearching(() => {
            const expireDate = new Date()
            expireDate.setSeconds(expireDate.getSeconds() + 3)
            Cookies.set('searchTerm', newText,{expires: expireDate})
            router.refresh()
        })
    }, 150), [])
    return (
        <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
            <label className="offscreen" htmlFor="sidebar-search-input">
                Search for a note by title
            </label>
            <input
                id="sidebar-search-input"
                placeholder="Search"
                value={text}
                onChange={(e) => {
                    // router.replace(`${pathName}`, {})
                    const newText = e.target.value;
                    setText(newText);
                    searchNotes(newText)
                }}
            />
            <Spinner active={isSearching}/>
        </form>
    );
}
