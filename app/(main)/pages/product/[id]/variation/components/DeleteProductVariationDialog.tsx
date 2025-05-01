import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ProductVariation } from '@/demo/service/VariationApiService';

interface DeleteProductVariationDialogProps {
    visible: boolean;
    onHide: () => void;
    productVariation: ProductVariation;
    onDelete: () => void;
}

const DeleteProductVariationDialog = (props: DeleteProductVariationDialogProps) => {
    const { visible, onHide, productVariation, onDelete } = props;

    const deleteVariationDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button label="Yes" icon="pi pi-check" className="p-button-danger" onClick={onDelete} />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteVariationDialogFooter}
            onHide={onHide}
        >
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {productVariation && (
                    <span>
                        Are you sure you want to delete the variation with SKU <b>{productVariation.sku}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    );
};

export default DeleteProductVariationDialog;
