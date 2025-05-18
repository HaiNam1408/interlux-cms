'use client';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CustomerApiService } from '@/service/CustomerApiService';
import { Customer } from '@/types/customer';
import { PaginatedData } from '@/types/response';
import {
    CustomerTable,
    CustomerForm,
    DeleteCustomerDialog,
    DeleteCustomersDialog,
    CustomerOrdersDialog
} from './components';

const CustomerPage = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
    const [customerDialog, setCustomerDialog] = useState<boolean>(false);
    const [deleteCustomerDialog, setDeleteCustomerDialog] = useState<boolean>(false);
    const [deleteCustomersDialog, setDeleteCustomersDialog] = useState<boolean>(false);
    const [customerOrdersDialog, setCustomerOrdersDialog] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);
    const [first, setFirst] = useState<number>(0);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Customer[]>>(null);

    const loadCustomers = useCallback(() => {
        setLoading(true);
        CustomerApiService.getCustomers(currentPage, rows, globalFilter)
            .then((response: PaginatedData<Customer> | null) => {
                if (response) {
                    setCustomers(response.data);
                    setTotalRecords(response.meta.total);
                } else {
                    setCustomers([]);
                    setTotalRecords(0);
                }
                setLoading(false);
            })
            .catch((error: any) => {
                console.error('Error loading customers:', error);
                setLoading(false);

                // Display the specific error message if available
                const errorDetail = error.payload?.message || 'Failed to load customers';
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorDetail,
                    life: 3000
                });
            });
    }, [currentPage, rows, globalFilter]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    const openNew = () => {
        setCustomer(null);
        setCustomerDialog(true);
    };

    const hideDialog = () => {
        setCustomerDialog(false);
    };

    const hideDeleteCustomerDialog = () => {
        setDeleteCustomerDialog(false);
    };

    const hideDeleteCustomersDialog = () => {
        setDeleteCustomersDialog(false);
    };

    const hideCustomerOrdersDialog = () => {
        setCustomerOrdersDialog(false);
    };

    const saveCustomer = async (data: any, isNew: boolean) => {
        try {
            if (isNew) {
                await CustomerApiService.createCustomer(data);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Customer created successfully',
                    life: 3000
                });
                setCustomerDialog(false);
                loadCustomers();
            } else if (customer) {
                await CustomerApiService.updateCustomer(customer.id, data);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Customer updated successfully',
                    life: 3000
                });
                setCustomerDialog(false);
                loadCustomers();
            }
        } catch (error: any) {
            console.error('Error saving customer:', error);

            // If it's a validation error, we'll let the form component handle it
            if (error.status === 400 && error.payload) {
                // Re-throw the error so the form can handle it
                throw error;
            }
            // Handle conflict errors (e.g., email already exists)
            else if (error.status === 409 && error.payload) {
                const errorMessage = error.payload.message || 'A conflict occurred with existing data';
                toast.current?.show({
                    severity: 'error',
                    summary: 'Conflict Error',
                    detail: errorMessage,
                    life: 5000
                });
            }
            else {
                // For other errors, show a generic error message or the specific message if available
                const errorDetail = error.payload?.message || 'Failed to save customer';
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorDetail,
                    life: 3000
                });
            }
        }
    };

    const editCustomer = (customer: Customer) => {
        setCustomer({ ...customer });
        setCustomerDialog(true);
    };

    const confirmDeleteCustomer = (customer: Customer) => {
        setCustomer(customer);
        setDeleteCustomerDialog(true);
    };

    const deleteCustomer = async () => {
        try {
            if (customer) {
                await CustomerApiService.deleteCustomer(customer.id);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Customer deleted successfully',
                    life: 3000
                });
                setDeleteCustomerDialog(false);
                loadCustomers();
            }
        } catch (error: any) {
            console.error('Error deleting customer:', error);

            // Display the specific error message if available
            const errorDetail = error.payload?.message || 'Failed to delete customer';
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: errorDetail,
                life: 3000
            });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteCustomersDialog(true);
    };

    const deleteSelectedCustomers = async () => {
        try {
            const deletePromises = selectedCustomers.map(customer =>
                CustomerApiService.deleteCustomer(customer.id)
            );

            await Promise.all(deletePromises);

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Selected customers deleted successfully',
                life: 3000
            });

            setDeleteCustomersDialog(false);
            setSelectedCustomers([]);
            loadCustomers();
        } catch (error: any) {
            console.error('Error deleting selected customers:', error);

            // Display the specific error message if available
            const errorDetail = error.payload?.message || 'Failed to delete selected customers';
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: errorDetail,
                life: 3000
            });
        }
    };

    const viewCustomerOrders = (customer: Customer) => {
        setCustomer(customer);
        setCustomerOrdersDialog(true);
    };

    const onPage = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(Math.floor(event.first / event.rows) + 1);
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(e.target.value);
        setCurrentPage(1);
        setFirst(0);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCustomers || !selectedCustomers.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button label="Refresh" icon="pi pi-refresh" className="p-button-outlined" onClick={loadCustomers} />
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                <CustomerTable
                    customers={customers}
                    selectedCustomers={selectedCustomers}
                    loading={loading}
                    globalFilter={globalFilter}
                    totalRecords={totalRecords}
                    first={first}
                    rows={rows}
                    dt={dt}
                    onSelectionChange={(e) => setSelectedCustomers(e.value)}
                    onPage={onPage}
                    onGlobalFilterChange={onGlobalFilterChange}
                    editCustomer={editCustomer}
                    confirmDeleteCustomer={confirmDeleteCustomer}
                    viewCustomerOrders={viewCustomerOrders}
                />

                <CustomerForm
                    visible={customerDialog}
                    customer={customer}
                    onHide={hideDialog}
                    onSave={saveCustomer}
                />

                <DeleteCustomerDialog
                    visible={deleteCustomerDialog}
                    customer={customer}
                    onHide={hideDeleteCustomerDialog}
                    onDelete={deleteCustomer}
                />

                <DeleteCustomersDialog
                    visible={deleteCustomersDialog}
                    customers={selectedCustomers}
                    onHide={hideDeleteCustomersDialog}
                    onDeleteSelected={deleteSelectedCustomers}
                />

                <CustomerOrdersDialog
                    visible={customerOrdersDialog}
                    customer={customer}
                    onHide={hideCustomerOrdersDialog}
                />
            </div>
        </div>
    );
};

export default CustomerPage;
