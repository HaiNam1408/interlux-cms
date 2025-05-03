import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Customer } from '@/types/customer';
import { FilterMatchMode } from 'primereact/api';

interface CustomerTableProps {
    customers: Customer[];
    selectedCustomers: Customer[];
    loading: boolean;
    globalFilter: string;
    totalRecords: number;
    first: number;
    rows: number;
    dt: React.RefObject<DataTable<Customer[]>>;
    onSelectionChange: (e: { value: Customer[] }) => void;
    onPage: (event: any) => void;
    onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editCustomer: (customer: Customer) => void;
    confirmDeleteCustomer: (customer: Customer) => void;
    viewCustomerOrders: (customer: Customer) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
    customers,
    selectedCustomers,
    loading,
    globalFilter,
    totalRecords,
    first,
    rows,
    dt,
    onSelectionChange,
    onPage,
    onGlobalFilterChange,
    editCustomer,
    confirmDeleteCustomer,
    viewCustomerOrders
}) => {
    const idBodyTemplate = (rowData: Customer) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const usernameBodyTemplate = (rowData: Customer) => {
        return (
            <>
                <span className="p-column-title">Username</span>
                {rowData.username}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Customer) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    const phoneBodyTemplate = (rowData: Customer) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    };

    const addressBodyTemplate = (rowData: Customer) => {
        return (
            <>
                <span className="p-column-title">Address</span>
                {rowData.address || '-'}
            </>
        );
    };

    const avatarBodyTemplate = (rowData: Customer) => {
        console.log(rowData);
        return (
            <>
                <span className="p-column-title">Avatar</span>
                {rowData.avatar ? (
                    <img 
                        src={rowData.avatar.filePath} 
                        alt={rowData.username} 
                        className="shadow-2 border-round" 
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }} 
                    />
                ) : (
                    <div 
                        className="flex align-items-center justify-content-center border-circle bg-primary" 
                        style={{ width: '32px', height: '32px' }}
                    >
                        <span className="text-white font-bold">{rowData.username.charAt(0).toUpperCase()}</span>
                    </div>
                )}
            </>
        );
    };

    const createdAtBodyTemplate = (rowData: Customer) => {
        return (
            <>
                <span className="p-column-title">Created At</span>
                {new Date(rowData.createdAt).toLocaleDateString()}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Customer) => {
        return (
            <div className="flex gap-1 justify-content-center">
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    outlined 
                    className="mr-2" 
                    onClick={() => editCustomer(rowData)} 
                    tooltip="Edit" 
                    tooltipOptions={{ position: 'bottom' }}
                />
                <Button 
                    icon="pi pi-shopping-cart" 
                    rounded 
                    outlined 
                    severity="info" 
                    className="mr-2" 
                    onClick={() => viewCustomerOrders(rowData)} 
                    tooltip="View Orders" 
                    tooltipOptions={{ position: 'bottom' }}
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    outlined 
                    severity="danger" 
                    onClick={() => confirmDeleteCustomer(rowData)} 
                    tooltip="Delete" 
                    tooltipOptions={{ position: 'bottom' }}
                />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Customers</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
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
            ref={dt}
            selectionMode="multiple"
            value={customers}
            selection={selectedCustomers}
            onSelectionChange={onSelectionChange}
            dataKey="id"
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
            globalFilter={globalFilter}
            emptyMessage="No customers found."
            header={header}
            loading={loading}
            totalRecords={totalRecords}
            lazy
            first={first}
            onPage={onPage}
        >
            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
            <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
            <Column field="avatar" header="Avatar" body={avatarBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
            <Column field="username" header="Username" sortable body={usernameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
            <Column field="phone" header="Phone" sortable body={phoneBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="address" header="Address" body={addressBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
            <Column field="createdAt" header="Created At" sortable body={createdAtBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
        </DataTable>
    );
};

export default CustomerTable;
