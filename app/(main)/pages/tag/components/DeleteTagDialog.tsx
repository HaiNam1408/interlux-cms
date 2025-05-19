'use client';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Tag } from '@/types/blog';

interface DeleteTagDialogProps {
    tag: Tag | null;
    visible: boolean;
    onHide: () => void;
    onDelete: () => void;
}

export const DeleteTagDialog = (props: DeleteTagDialogProps) => {
    const { tag, visible, onHide, onDelete } = props;

    const deleteTagDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={onDelete} />
        </React.Fragment>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteTagDialogFooter}
            onHide={onHide}
        >
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {tag && (
                    <span>
                        Are you sure you want to delete <b>{tag.name}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    );
};
