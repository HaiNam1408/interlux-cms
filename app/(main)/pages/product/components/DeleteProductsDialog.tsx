import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface DeleteProductsDialogProps {
    visible: boolean;
    onHide: () => void;
    onDeleteSelected: () => void;
}

const DeleteProductsDialog = ({ visible, onHide, onDeleteSelected }: DeleteProductsDialogProps) => {
    const footer = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={onHide} />
            <Button label="Yes" icon="pi pi-check" text onClick={onDeleteSelected} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Confirm" modal footer={footer} onHide={onHide}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>Are you sure you want to delete the selected products?</span>
            </div>
        </Dialog>
    );
};

export default DeleteProductsDialog;
