'use client';
import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Post, PostStatus } from '@/types/blog';

interface BlogTableProps {
    posts: Post[];
    selectedPosts: Post[];
    onSelectionChange: (posts: Post[]) => void;
    onEditPost: (post: Post) => void;
    onDeletePost: (post: Post) => void;
    onViewPost: (post: Post) => void;
    globalFilter: string;
    onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    totalRecords: number;
    rows: number;
    first: number;
    onPage: (event: any) => void;
}

export const BlogTable = (props: BlogTableProps) => {
    const {
        posts,
        selectedPosts,
        onSelectionChange,
        onEditPost,
        onDeletePost,
        onViewPost,
        globalFilter,
        onGlobalFilterChange,
        loading,
        totalRecords,
        rows,
        first,
        onPage
    } = props;

    const dt = useRef<DataTable<Post[]>>(null);

    const titleBodyTemplate = (rowData: Post) => {
        return <span>{rowData.title}</span>;
    };

    const statusBodyTemplate = (rowData: Post) => {
        const statusSeverity = rowData.status === PostStatus.PUBLISHED ? 'success' : 'warning';
        return <Tag value={rowData.status} severity={statusSeverity} />;
    };

    const tagsBodyTemplate = (rowData: Post) => {
        return (
            <div className="flex flex-wrap gap-1">
                {rowData.tags && rowData.tags.map((tag) => (
                    <Tag key={tag.tag.id} value={tag.tag.name} />
                ))}
                {(!rowData.tags || rowData.tags.length === 0) && (
                    <span className="text-gray-500">No tags</span>
                )}
            </div>
        );
    };

    const thumbnailBodyTemplate = (rowData: Post) => {
        if (rowData.thumbnail) {
            return (
                <img 
                    src={rowData.thumbnail.filePath} 
                    alt={rowData.title} 
                    className="w-3rem h-3rem object-fit-cover border-round"
                />
            );
        }
        return <i className="pi pi-image text-gray-500" style={{ fontSize: '1.5rem' }}></i>;
    };

    const createdAtBodyTemplate = (rowData: Post) => {
        return <span>{new Date(rowData.createdAt).toLocaleDateString()}</span>;
    };

    const publishedAtBodyTemplate = (rowData: Post) => {
        if (rowData.publishedAt) {
            return <span>{new Date(rowData.publishedAt).toLocaleDateString()}</span>;
        }
        return <span className="text-gray-500">Not published</span>;
    };

    const actionBodyTemplate = (rowData: Post) => {
        return (
            <div className="flex gap-2 justify-content-end">
                <Button
                    icon="pi pi-eye"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => onViewPost(rowData)}
                />
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => onEditPost(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => onDeletePost(rowData)}
                />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Blog Posts</h4>
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
            selectionMode={"multiple"}
            ref={dt}
            value={posts}
            selection={selectedPosts}
            onSelectionChange={(e) => onSelectionChange(e.value as Post[])}
            dataKey="id"
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
            globalFilter={globalFilter}
            emptyMessage="No blog posts found."
            header={header}
            responsiveLayout="scroll"
            loading={loading}
            totalRecords={totalRecords}
            lazy
            first={first}
            onPage={onPage}
        >
            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
            <Column field="thumbnail" header="Thumbnail" body={thumbnailBodyTemplate} style={{ width: '5rem' }}></Column>
            <Column field="title" header="Title" body={titleBodyTemplate} sortable style={{ minWidth: '14rem' }}></Column>
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
            <Column field="tags" header="Tags" body={tagsBodyTemplate} style={{ minWidth: '12rem' }}></Column>
            <Column field="createdAt" header="Created At" body={createdAtBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
            <Column field="publishedAt" header="Published At" body={publishedAtBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
            <Column body={actionBodyTemplate} headerStyle={{ width: '10rem', textAlign: 'right' }} bodyStyle={{ textAlign: 'right' }}></Column>
        </DataTable>
    );
};
