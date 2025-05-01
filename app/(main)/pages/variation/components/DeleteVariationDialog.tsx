import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Variation } from '@/demo/service/VariationApiService';

interface DeleteVariationDialogProps {
    visible: boolean;
    onHide: () => void;
    variation: Variation;
    onDelete: () => void;
}

const DeleteVariationDialog = (props: DeleteVariationDialogProps) => {
    const { visible, onHide, variation, onDelete } = props;

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
                {variation && (
                    <span>
                        Are you sure you want to delete <b>{variation.name}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    );
};

export default DeleteVariationDialog;
