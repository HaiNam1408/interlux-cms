import React from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Order } from '@/types/order';

interface OrderHeaderProps {
    order: Order | null;
    loading: boolean;
    onUpdateStatus: () => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ order, loading, onUpdateStatus }) => {
    const router = useRouter();

    return (
        <div className="flex align-items-center justify-content-between mb-3">
            <Button 
                icon="pi pi-arrow-left" 
                label="Back to Orders" 
                className="p-button-text" 
                onClick={() => router.push('/pages/order')} 
            />
            {!loading && order && (
                <Button 
                    icon="pi pi-sync" 
                    label="Update Status" 
                    onClick={onUpdateStatus} 
                />
            )}
        </div>
    );
};

export default OrderHeader;
