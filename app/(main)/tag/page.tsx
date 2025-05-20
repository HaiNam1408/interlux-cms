'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Tag, CreateTagDto, UpdateTagDto } from '@/types/blog';
import { TagApiService } from '@/service/TagApiService';
import { TagTable } from './components/TagTable';
import { TagForm } from './components/TagForm';
import { DeleteTagDialog } from './components/DeleteTagDialog';
import { DeleteTagsDialog } from './components/DeleteTagsDialog';

const TagPage = () => {
    const toast = useRef<Toast>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [tagDialog, setTagDialog] = useState(false);
    const [deleteTagDialog, setDeleteTagDialog] = useState(false);
    const [deleteTagsDialog, setDeleteTagsDialog] = useState(false);
    const [tag, setTag] = useState<Tag | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        search: ''
    });

    const loadTags = useCallback(async () => {
        try {
            setLoading(true);
            const response = await TagApiService.getTags(
                lazyParams.page,
                lazyParams.rows,
                lazyParams.search
            );
            
            if (response) {
                setTags(response.data);
                setTotalRecords(response.meta.total);
            }
        } catch (error) {
            console.error('Error loading tags:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load tags', life: 3000 });
        } finally {
            setLoading(false);
        }
    }, [lazyParams]);

    useEffect(() => {
        loadTags();
    }, [loadTags]);

    const openNew = () => {
        setTag(null);
        setTagDialog(true);
    };

    const hideDialog = () => {
        setTagDialog(false);
    };

    const hideDeleteTagDialog = () => {
        setDeleteTagDialog(false);
    };

    const hideDeleteTagsDialog = () => {
        setDeleteTagsDialog(false);
    };

    const saveTag = async (tagData: CreateTagDto | UpdateTagDto) => {
        try {
            if (tag) {
                // Update existing tag
                await TagApiService.updateTag(tag.id, tagData as UpdateTagDto);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Tag updated', life: 3000 });
            } else {
                // Create new tag
                await TagApiService.createTag(tagData as CreateTagDto);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Tag created', life: 3000 });
            }
            
            setTagDialog(false);
            loadTags();
        } catch (error) {
            console.error('Error saving tag:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save tag', life: 3000 });
        }
    };

    const editTag = (tag: Tag) => {
        setTag(tag);
        setTagDialog(true);
    };

    const confirmDeleteTag = (tag: Tag) => {
        setTag(tag);
        setDeleteTagDialog(true);
    };

    const deleteTag = async () => {
        try {
            if (tag) {
                await TagApiService.deleteTag(tag.id);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Tag deleted', life: 3000 });
                setDeleteTagDialog(false);
                setTag(null);
                loadTags();
            }
        } catch (error) {
            console.error('Error deleting tag:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete tag', life: 3000 });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteTagsDialog(true);
    };

    const deleteSelectedTags = async () => {
        try {
            const deletePromises = selectedTags.map(tag => TagApiService.deleteTag(tag.id));
            await Promise.all(deletePromises);
            
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Tags deleted', life: 3000 });
            setDeleteTagsDialog(false);
            setSelectedTags([]);
            loadTags();
        } catch (error) {
            console.error('Error deleting selected tags:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete tags', life: 3000 });
        }
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilter(value);
        setLazyParams({
            ...lazyParams,
            page: 1,
            first: 0,
            search: value
        });
    };

    const onPage = (event: any) => {
        setLazyParams({
            ...lazyParams,
            page: event.page + 1,
            first: event.first,
            rows: event.rows
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button 
                    label="Delete" 
                    icon="pi pi-trash" 
                    severity="danger" 
                    onClick={confirmDeleteSelected} 
                    disabled={!selectedTags || selectedTags.length === 0} 
                />
            </div>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} />

                <TagTable
                    tags={tags}
                    selectedTags={selectedTags}
                    onSelectionChange={setSelectedTags}
                    onEditTag={editTag}
                    onDeleteTag={confirmDeleteTag}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={onGlobalFilterChange}
                    loading={loading}
                    totalRecords={totalRecords}
                    rows={lazyParams.rows}
                    first={lazyParams.first}
                    onPage={onPage}
                />
            </div>

            <TagForm
                tag={tag}
                visible={tagDialog}
                onHide={hideDialog}
                onSave={saveTag}
            />

            <DeleteTagDialog
                tag={tag}
                visible={deleteTagDialog}
                onHide={hideDeleteTagDialog}
                onDelete={deleteTag}
            />

            <DeleteTagsDialog
                visible={deleteTagsDialog}
                onHide={hideDeleteTagsDialog}
                onDeleteSelected={deleteSelectedTags}
                selectedTags={selectedTags}
            />
        </div>
    );
};

export default TagPage;
