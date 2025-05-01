import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { VariationOption } from '@/demo/service/VariationApiService';

interface DeleteVariationOptionDialogProps {
    visible: boolean;
    onHide: () => void;
    option: VariationOption;
    onDelete: () => void;
}

const DeleteVariationOptionDialog = (props: DeleteVariationOptionDialogProps) => {
    const { visible, onHide, option, onDelete } = props;

    const deleteOptionDialogFooter = (
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
            footer={deleteOptionDialogFooter}
            onHide={onHide}
        >
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {option && (
                    <span>
                        Are you sure you want to delete <b>{option.name}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    );
};

export default DeleteVariationOptionDialog;
