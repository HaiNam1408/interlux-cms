'use client';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Coupon } from '@/types/coupon';

interface DeleteCouponsDialogProps {
    visible: boolean;
    coupons: Coupon[];
    onHide: () => void;
    onDelete: () => Promise<void>;
}

const DeleteCouponsDialog: React.FC<DeleteCouponsDialogProps> = ({ visible, coupons, onHide, onDelete }) => {
    const footer = (
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
            footer={footer}
            onHide={onHide}
        >
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>
                    Are you sure you want to delete the selected coupons?
                    <br />
                    <b>{coupons.length}</b> coupons will be permanently removed.
                </span>
            </div>
        </Dialog>
    );
};

export default DeleteCouponsDialog;
