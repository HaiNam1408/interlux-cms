'use client';
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Coupon, CouponType } from '@/types/coupon';
import { CommonStatus } from '@/types/product';
import { formatCurrency } from '@/lib/utils';

interface CouponTableProps {
    coupons: Coupon[];
    selectedCoupons: Coupon[];
    loading: boolean;
    globalFilter: string;
    totalRecords: number;
    first: number;
    rows: number;
    dt: React.RefObject<DataTable<Coupon[]>>;
    onSelectionChange: (e: { value: Coupon[] }) => void;
    onPage: (e: any) => void;
    onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editCoupon: (coupon: Coupon) => void;
    confirmDeleteCoupon: (coupon: Coupon) => void;
}

const CouponTable: React.FC<CouponTableProps> = ({
    coupons,
    selectedCoupons,
    loading,
    globalFilter,
    totalRecords,
    first,
    rows,
    dt,
    onSelectionChange,
    onPage,
    onGlobalFilterChange,
    editCoupon,
    confirmDeleteCoupon
}) => {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    const typeBodyTemplate = (rowData: Coupon) => {
        return (
            <span>
                {rowData.type === CouponType.PERCENTAGE ? 'Percentage' : 'Fixed Amount'}
            </span>
        );
    };

    const valueBodyTemplate = (rowData: Coupon) => {
        if (rowData.type === CouponType.PERCENTAGE) {
            return <span>{rowData.value}%</span>;
        } else {
            return <span>{formatCurrency(rowData.value)}</span>;
        }
    };

    const minPurchaseBodyTemplate = (rowData: Coupon) => {
        return rowData.minPurchase ? formatCurrency(rowData.minPurchase) : 'None';
    };

    const maxUsageBodyTemplate = (rowData: Coupon) => {
        return rowData.maxUsage ? rowData.maxUsage : 'Unlimited';
    };

    const dateRangeBodyTemplate = (rowData: Coupon) => {
        return (
            <div>
                <div>{formatDate(rowData.startDate)}</div>
                <div>to</div>
                <div>{formatDate(rowData.endDate)}</div>
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Coupon) => {
        const getSeverity = (status: CommonStatus) => {
            switch (status) {
                case CommonStatus.ACTIVE:
                    return 'success';
                case CommonStatus.INACTIVE:
                    return 'danger';
                default:
                    return 'info';
            }
        };

        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const actionBodyTemplate = (rowData: Coupon) => {
        return (
            <div className="flex justify-content-end">
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCoupon(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCoupon(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Coupons</h4>
            <span>
                <InputText
                    type="search"
                    value={globalFilter}
                    onChange={onGlobalFilterChange}
                    placeholder="Search..."
                />
            </span>
        </div>
    );

    return (
        <DataTable
            ref={dt}
            value={coupons}
            selection={selectedCoupons}
            selectionMode="multiple"
            onSelectionChange={onSelectionChange}
            dataKey="id"
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} coupons"
            globalFilter={globalFilter}
            header={header}
            loading={loading}
            emptyMessage="No coupons found."
            className="p-datatable-gridlines"
            showGridlines
            lazy
            totalRecords={totalRecords}
            first={first}
            onPage={onPage}
        >
            <Column selectionMode="multiple" exportable={false} style={{ width: '3rem' }}></Column>
            <Column field="code" header="Code" sortable style={{ minWidth: '12rem' }}></Column>
            <Column field="type" header="Type" body={typeBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
            <Column field="value" header="Value" body={valueBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
            <Column field="minPurchase" header="Min Purchase" body={minPurchaseBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
            <Column field="maxUsage" header="Max Usage" body={maxUsageBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
            <Column field="dateRange" header="Valid Period" body={dateRangeBodyTemplate} style={{ minWidth: '14rem' }}></Column>
            <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
    );
};

export default CouponTable;
