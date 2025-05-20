'use client';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Post } from '@/types/blog';

interface DeletePostsDialogProps {
    visible: boolean;
    onHide: () => void;
    onDeleteSelected: () => void;
    selectedPosts: Post[];
}

export const DeletePostsDialog = (props: DeletePostsDialogProps) => {
    const { visible, onHide, onDeleteSelected, selectedPosts } = props;

    const deletePostsDialogFooter = (
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
            footer={deletePostsDialogFooter}
            onHide={onHide}
        >
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {selectedPosts && selectedPosts.length > 0 && (
                    <span>
                        Are you sure you want to delete the selected blog posts?
                    </span>
                )}
            </div>
        </Dialog>
    );
};
