import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Customer, CustomerOrder } from '@/types/customer';
import { CustomerApiService } from '@/service/CustomerApiService';

interface CustomerOrdersDialogProps {
    visible: boolean;
    customer: Customer | null;
    onHide: () => void;
}

const CustomerOrdersDialog: React.FC<CustomerOrdersDialogProps> = ({ visible, customer, onHide }) => {
    const [orders, setOrders] = useState<CustomerOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);

    useEffect(() => {
        if (visible && customer) {
            loadOrders();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, customer, currentPage, rows]);

    const loadOrders = async () => {
        if (!customer) return;
        
        setLoading(true);
        try {
            const response = await CustomerApiService.getCustomerOrders(customer.id, currentPage, rows);
            if (response) {
                setOrders(response.data);
                setTotalRecords(response.meta.total);
            } else {
                setOrders([]);
                setTotalRecords(0);
            }
        } catch (error) {
            console.error('Error loading customer orders:', error);
            setOrders([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const onPage = (event: any) => {
        setCurrentPage(event.page + 1);
        setRows(event.rows);
    };

    const orderNumberTemplate = (order: CustomerOrder) => {
        return (
            <>
                <span className="p-column-title">Order Number</span>
                {order.orderNumber}
            </>
        );
    };

    const totalTemplate = (order: CustomerOrder) => {
        return (
            <>
                <span className="p-column-title">Total</span>
                ${order.total.toFixed(2)}
            </>
        );
    };

    const statusTemplate = (order: CustomerOrder) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`customer-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                </span>
            </>
        );
    };

    const dateTemplate = (order: CustomerOrder) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {new Date(order.createdAt).toLocaleDateString()}
            </>
        );
    };

    const actionTemplate = (order: CustomerOrder) => {
        return (
            <div className="flex flex-wrap justify-content-center gap-2">
                <Button 
                    icon="pi pi-eye" 
                    rounded 
                    outlined 
                    onClick={() => window.location.href = `/pages/orders/${order.id}`} 
                    tooltip="View Order" 
                    tooltipOptions={{ position: 'bottom' }}
                />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">
                Orders for {customer?.username}
            </h5>
        </div>
    );

    const footer = (
        <Button label="Close" icon="pi pi-times" onClick={onHide} />
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '80%', maxWidth: '1200px' }}
            header="Customer Orders"
            modal
            className="p-fluid"
            footer={footer}
            onHide={onHide}
        >
            <DataTable
                value={orders}
                paginator
                rows={rows}
                rowsPerPageOptions={[5, 10, 25]}
                dataKey="id"
                rowHover
                loading={loading}
                responsiveLayout="scroll"
                emptyMessage="No orders found"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                header={header}
                totalRecords={totalRecords}
                lazy
                first={(currentPage - 1) * rows}
                onPage={onPage}
            >
                <Column field="id" header="ID" style={{ width: '5%' }}></Column>
                <Column field="orderNumber" header="Order Number" body={orderNumberTemplate} style={{ width: '20%' }}></Column>
                <Column field="total" header="Total" body={totalTemplate} style={{ width: '15%' }}></Column>
                <Column field="status" header="Status" body={statusTemplate} style={{ width: '15%' }}></Column>
                <Column field="createdAt" header="Date" body={dateTemplate} style={{ width: '15%' }}></Column>
                <Column body={actionTemplate} style={{ width: '10%' }}></Column>
            </DataTable>
        </Dialog>
    );
};

export default CustomerOrdersDialog;
