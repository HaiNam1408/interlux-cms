'use client';
import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from '@/types/blog';

interface TagTableProps {
    tags: Tag[];
    selectedTags: Tag[];
    onSelectionChange: (tags: Tag[]) => void;
    onEditTag: (tag: Tag) => void;
    onDeleteTag: (tag: Tag) => void;
    globalFilter: string;
    onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    totalRecords: number;
    rows: number;
    first: number;
    onPage: (event: any) => void;
}

export const TagTable = (props: TagTableProps) => {
    const {
        tags,
        selectedTags,
        onSelectionChange,
        onEditTag,
        onDeleteTag,
        globalFilter,
        onGlobalFilterChange,
        loading,
        totalRecords,
        rows,
        first,
        onPage
    } = props;

    const dt = useRef<DataTable<Tag[]>>(null);

    const nameBodyTemplate = (rowData: Tag) => {
        return <span>{rowData.name}</span>;
    };

    const slugBodyTemplate = (rowData: Tag) => {
        return <span>{rowData.slug}</span>;
    };

    const createdAtBodyTemplate = (rowData: Tag) => {
        return <span>{new Date(rowData.createdAt).toLocaleDateString()}</span>;
    };

    const actionBodyTemplate = (rowData: Tag) => {
        return (
            <div className="flex gap-2 justify-content-end">
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => onEditTag(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => onDeleteTag(rowData)}
                />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Tags</h4>
            <span>
                <InputText
                    type="search"
                    value={globalFilter}
                    onChange={onGlobalFilterChange}
                    placeholder="Search..."
                />
            </span>
        </div>
    );

    return (
        <DataTable
            ref={dt}
            value={tags}
            selection={selectedTags}
            selectionMode="multiple"
            onSelectionChange={(e) => onSelectionChange(e.value as Tag[])}
            dataKey="id"
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tags"
            globalFilter={globalFilter}
            emptyMessage="No tags found."
            header={header}
            responsiveLayout="scroll"
            loading={loading}
            totalRecords={totalRecords}
            lazy
            first={first}
            onPage={onPage}
        >
            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
            <Column field="name" header="Name" body={nameBodyTemplate} sortable style={{ minWidth: '14rem' }}></Column>
            <Column field="slug" header="Slug" body={slugBodyTemplate} sortable style={{ minWidth: '14rem' }}></Column>
            <Column field="createdAt" header="Created At" body={createdAtBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
            <Column body={actionBodyTemplate} headerStyle={{ width: '10rem', textAlign: 'right' }} bodyStyle={{ textAlign: 'right' }}></Column>
        </DataTable>
    );
};
