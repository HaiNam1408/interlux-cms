'use client';

import { InputText } from 'primereact/inputtext';
import { ChangeEvent } from 'react';

interface SearchInputProps {
    placeholder?: string;
    onChange: (value: string) => void;
}

export default function SearchInput({ placeholder = 'Search...', onChange }: SearchInputProps) {
    return (
        <div className="relative w-full md:w-80">
            <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <InputText type="search" className="pl-10 w-full" onInput={(e: ChangeEvent<HTMLInputElement>) => onChange(e.currentTarget.value)} placeholder={placeholder} />
        </div>
    );
}
