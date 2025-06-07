import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Order } from '@/types/order';
import OrderStatusBadge from './OrderStatusBadge';
import { useRouter } from 'next/navigation';

interface OrderTableProps {
    orders: Order[];
    loading: boolean;
    globalFilter: string;
    totalRecords: number;
    first: number;
    rows: number;
    onPage: (event: any) => void;
    onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStatusChange?: (order: Order) => void;
    title?: string;
}

const OrderTable: React.FC<OrderTableProps> = ({
    orders,
    loading,
    globalFilter,
    totalRecords,
    first,
    rows,
    onPage,
    onGlobalFilterChange,
    onStatusChange,
    title = 'Manage Orders'
}) => {
    const router = useRouter();

    const viewOrder = (order: Order) => {
        router.push(`/order/${order.id}`);
    };

    const orderNumberTemplate = (order: Order) => {
        return (
            <>
                <span className="p-column-title">Order Number</span>
                {order.orderNumber}
            </>
        );
    };

    const customerTemplate = (order: Order) => {
        return (
            <>
                <span className="p-column-title">Customer</span>
                <div className="flex flex-column">
                    <span>{order.user.username}</span>
                    <span className="text-sm text-500">{order.user.email}</span>
                </div>
            </>
        );
    };

    const dateTemplate = (order: Order) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {new Date(order.createdAt).toLocaleDateString()}
            </>
        );
    };

    const totalTemplate = (order: Order) => {
        return (
            <>
                <span className="p-column-title">Total</span>
                ${order.total.toFixed(2)}
            </>
        );
    };

    const statusTemplate = (order: Order) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <OrderStatusBadge status={order.status} />
            </>
        );
    };

    const actionTemplate = (order: Order) => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-center">
                <Button 
                    icon="pi pi-eye" 
                    rounded 
                    outlined 
                    className="mr-2" 
                    onClick={() => viewOrder(order)} 
                    tooltip="View Details" 
                    tooltipOptions={{ position: 'bottom' }}
                />
                {onStatusChange && (
                    <Button 
                        icon="pi pi-sync" 
                        rounded 
                        outlined 
                        severity="info" 
                        onClick={() => onStatusChange(order)} 
                        tooltip="Update Status" 
                        tooltipOptions={{ position: 'bottom' }}
                    />
                )}
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{title}</h5>
            <span className="block mt-2 md:mt-0">
                <InputText
                    type="search"
                    onInput={onGlobalFilterChange}
                    placeholder="Search..."
                    value={globalFilter}
                    className="w-full sm:w-auto"
                />
            </span>
        </div>
    );

    return (
        <DataTable
            value={orders}
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 25]}
            dataKey="id"
            rowHover
            loading={loading}
            responsiveLayout="scroll"
            emptyMessage="No orders found."
            header={header}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
            globalFilter={globalFilter}
            totalRecords={totalRecords}
            lazy
            first={first}
            onPage={onPage}
        >
            <Column field="orderNumber" header="Order Number" body={orderNumberTemplate} sortable style={{ minWidth: '12rem' }}></Column>
            <Column field="user.username" header="Customer" body={customerTemplate} sortable style={{ minWidth: '14rem' }}></Column>
            <Column field="createdAt" header="Date" body={dateTemplate} sortable style={{ minWidth: '10rem' }}></Column>
            <Column field="total" header="Total" body={totalTemplate} sortable style={{ minWidth: '8rem' }}></Column>
            <Column field="status" header="Status" body={statusTemplate} sortable style={{ minWidth: '10rem' }}></Column>
            <Column body={actionTemplate} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
    );
};

export default OrderTable;
