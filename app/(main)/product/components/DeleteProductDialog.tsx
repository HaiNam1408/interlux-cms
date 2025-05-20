import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Product } from '@/types/product';

interface DeleteProductDialogProps {
    visible: boolean;
    onHide: () => void;
    product: Product;
    onDelete: () => void;
}

const DeleteProductDialog = ({ visible, onHide, product, onDelete }: DeleteProductDialogProps) => {
    const footer = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={onHide} />
            <Button label="Yes" icon="pi pi-check" text onClick={onDelete} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Confirm" modal footer={footer} onHide={onHide}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {product && (
                    <span>
                        Are you sure you want to delete <b>{product.title}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    );
};

export default DeleteProductDialog;
