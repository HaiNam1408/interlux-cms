'use client';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Tag } from '@/types/blog';

interface DeleteTagsDialogProps {
    visible: boolean;
    onHide: () => void;
    onDeleteSelected: () => void;
    selectedTags: Tag[];
}

export const DeleteTagsDialog = (props: DeleteTagsDialogProps) => {
    const { visible, onHide, onDeleteSelected, selectedTags } = props;

    const deleteTagsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={onDeleteSelected} />
        </React.Fragment>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteTagsDialogFooter}
            onHide={onHide}
        >
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {selectedTags && selectedTags.length > 0 && (
                    <span>
                        Are you sure you want to delete the selected tags?
                    </span>
                )}
            </div>
        </Dialog>
    );
};
