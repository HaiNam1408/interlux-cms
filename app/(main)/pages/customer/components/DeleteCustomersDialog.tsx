import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Customer } from '@/types/customer';

interface DeleteCustomersDialogProps {
    visible: boolean;
    customers: Customer[];
    onHide: () => void;
    onDeleteSelected: () => void;
}

const DeleteCustomersDialog: React.FC<DeleteCustomersDialogProps> = ({ visible, customers, onHide, onDeleteSelected }) => {
    const deleteCustomersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={onDeleteSelected} />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteCustomersDialogFooter}
            onHide={onHide}
        >
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {customers && (
                    <span>
                        Are you sure you want to delete the selected customers?
                    </span>
                )}
            </div>
        </Dialog>
    );
};

export default DeleteCustomersDialog;
