import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Order, OrderStatus, UpdateOrderStatusDto } from '@/types/order';
import OrderStatusBadge from './OrderStatusBadge';

interface UpdateOrderStatusDialogProps {
    visible: boolean;
    order: Order | null;
    onHide: () => void;
    onUpdateStatus: (orderId: number, data: UpdateOrderStatusDto) => Promise<void>;
}

const UpdateOrderStatusDialog: React.FC<UpdateOrderStatusDialogProps> = ({
    visible,
    order,
    onHide,
    onUpdateStatus
}) => {
    const [status, setStatus] = useState<OrderStatus | null>(null);
    const [note, setNote] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (order) {
            setStatus(order.status);
            setNote('');
        }
    }, [order, visible]);

    const statusOptions = Object.values(OrderStatus).map(status => ({
        label: status,
        value: status
    }));

    const handleSubmit = async () => {
        if (!order || !status) return;

        setSubmitting(true);
        try {
            await onUpdateStatus(order.id, {
                status,
                note: note.trim() || undefined
            });
            onHide();
        } catch (error) {
            console.error('Error updating order status:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={onHide} disabled={submitting} />
            <Button 
                label="Update" 
                icon="pi pi-check" 
                onClick={handleSubmit} 
                loading={submitting}
                disabled={!status || status === order?.status}
            />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Update Order Status"
            modal
            className="p-fluid"
            footer={dialogFooter}
            onHide={onHide}
        >
            {order && (
                <div>
                    <div className="field">
                        <label className="font-bold mb-2 block">Order Number</label>
                        <div className="text-lg">{order.orderNumber}</div>
                    </div>

                    <div className="field">
                        <label className="font-bold mb-2 block">Current Status</label>
                        <div>
                            <OrderStatusBadge status={order.status} />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="status" className="font-bold">New Status</label>
                        <Dropdown
                            id="status"
                            value={status}
                            options={statusOptions}
                            onChange={(e) => setStatus(e.value)}
                            placeholder="Select a status"
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="note" className="font-bold">Note (Optional)</label>
                        <InputTextarea
                            id="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            autoResize
                        />
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default UpdateOrderStatusDialog;
