import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Order } from '@/types/order';
import OrderStatusBadge from './OrderStatusBadge';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { formatCurrency } from '@/lib/utils';

interface RecentOrdersPanelProps {
    orders: Order[];
    loading: boolean;
}

const RecentOrdersPanel: React.FC<RecentOrdersPanelProps> = ({ orders, loading }) => {
    const router = useRouter();

    const viewOrder = (order: Order) => {
        router.push(`/order/${order.id}`);
    };

    const orderNumberTemplate = (order: Order) => {
        return (
            <span className="font-medium">{order.orderNumber}</span>
        );
    };

    const customerTemplate = (order: Order) => {
        return (
            <div className="flex flex-column">
                <span>{order.user.username}</span>
                <span className="text-sm text-500">{order.user.email}</span>
            </div>
        );
    };

    const dateTemplate = (order: Order) => {
        return new Date(order.createdAt).toLocaleDateString();
    };

    const totalTemplate = (order: Order) => {
        return (
            <span className="font-semibold">{formatCurrency(order.total)}</span>
        );
    };

    const statusTemplate = (order: Order) => {
        return <OrderStatusBadge status={order.status} />;
    };

    const actionTemplate = (order: Order) => {
        return (
            <Button 
                icon="pi pi-eye" 
                rounded 
                outlined 
                onClick={() => viewOrder(order)} 
                tooltip="View Details" 
                tooltipOptions={{ position: 'bottom' }}
            />
        );
    };

    const header = (
        <div className="flex justify-content-between align-items-center">
            <h5 className="m-0">Recent Orders</h5>
            <Button 
                label="View All" 
                icon="pi pi-arrow-right" 
                link 
                onClick={() => router.push('/order')}
            />
        </div>
    );

    return (
        <Card className="mt-3">
            {loading ? (
                <div>
                    <Skeleton width="100%" height="2rem" className="mb-2"></Skeleton>
                    <Skeleton width="100%" height="10rem"></Skeleton>
                </div>
            ) : (
                <DataTable 
                    value={orders} 
                    header={header}
                    rows={5}
                    paginator={false}
                    rowHover
                    emptyMessage="No recent orders"
                    dataKey="id"
                    responsiveLayout="scroll"
                >
                    <Column field="orderNumber" header="Order #" body={orderNumberTemplate} style={{ minWidth: '8rem' }}></Column>
                    <Column field="user.username" header="Customer" body={customerTemplate} style={{ minWidth: '12rem' }}></Column>
                    <Column field="createdAt" header="Date" body={dateTemplate} style={{ minWidth: '8rem' }}></Column>
                    <Column field="total" header="Total" body={totalTemplate} style={{ minWidth: '6rem' }}></Column>
                    <Column field="status" header="Status" body={statusTemplate} style={{ minWidth: '8rem' }}></Column>
                    <Column body={actionTemplate} style={{ minWidth: '4rem' }}></Column>
                </DataTable>
            )}
        </Card>
    );
};

export default RecentOrdersPanel;
