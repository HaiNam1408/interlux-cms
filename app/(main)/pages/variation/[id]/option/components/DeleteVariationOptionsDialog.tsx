import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface DeleteVariationOptionsDialogProps {
    visible: boolean;
    onHide: () => void;
    onDeleteSelected: () => void;
}

const DeleteVariationOptionsDialog = (props: DeleteVariationOptionsDialogProps) => {
    const { visible, onHide, onDeleteSelected } = props;

    const deleteOptionsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button label="Yes" icon="pi pi-check" className="p-button-danger" onClick={onDeleteSelected} />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteOptionsDialogFooter}
            onHide={onHide}
        >
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>Are you sure you want to delete the selected variation options?</span>
            </div>
        </Dialog>
    );
};

export default DeleteVariationOptionsDialog;
