import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Customer } from '@/types/customer';

interface DeleteCustomerDialogProps {
    visible: boolean;
    customer: Customer | null;
    onHide: () => void;
    onDelete: () => void;
}

const DeleteCustomerDialog: React.FC<DeleteCustomerDialogProps> = ({ visible, customer, onHide, onDelete }) => {
    const deleteCustomerDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={onDelete} />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteCustomerDialogFooter}
            onHide={onHide}
        >
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {customer && (
                    <span>
                        Are you sure you want to delete <b>{customer.username}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    );
};

export default DeleteCustomerDialog;
