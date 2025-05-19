'use client';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Post } from '@/types/blog';

interface DeletePostDialogProps {
    post: Post | null;
    visible: boolean;
    onHide: () => void;
    onDelete: () => void;
}

export const DeletePostDialog = (props: DeletePostDialogProps) => {
    const { post, visible, onHide, onDelete } = props;

    const deletePostDialogFooter = (
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
            footer={deletePostDialogFooter}
            onHide={onHide}
        >
            <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {post && (
                    <span>
                        Are you sure you want to delete <b>{post.title}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    );
};
