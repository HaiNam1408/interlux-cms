import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { VariationOption } from '@/demo/service/VariationApiService';

interface VariationOptionTableProps {
    options: VariationOption[];
    selectedOptions: VariationOption[];
    onSelectionChange: (e: any) => void;
    loading: boolean;
    totalRecords: number;
    first: number;
    rows: number;
    onPage: (e: any) => void;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    onEdit: (option: VariationOption) => void;
    onDelete: (option: VariationOption) => void;
    dt: React.RefObject<DataTable<any>>;
    exportCSV: () => void;
}

const VariationOptionTable = (props: VariationOptionTableProps) => {
    const {
        options,
        selectedOptions,
        onSelectionChange,
        loading,
        totalRecords,
        first,
        rows,
        onPage,
        globalFilter,
        setGlobalFilter,
        onEdit,
        onDelete,
        dt,
        exportCSV
    } = props;

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Variation Options</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
                    placeholder="Search..."
                />
            </span>
        </div>
    );

    const actionBodyTemplate = (rowData: VariationOption) => {
        return (
            <div className="flex">
                <Button
                    icon="pi pi-pencil"
                    severity="success"
                    rounded
                    className="mr-2"
                    onClick={() => onEdit(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    onClick={() => onDelete(rowData)}
                />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: VariationOption) => {
        return (
            <span className={`variation-badge status-${rowData.status.toLowerCase()}`}>
                {rowData.status}
            </span>
        );
    };

    return (
        <DataTable
            ref={dt}
            value={options}
            selection={selectedOptions}
            onSelectionChange={onSelectionChange}
            dataKey="id"
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} options"
            globalFilter={globalFilter}
            emptyMessage="No variation options found."
            header={header}
            responsiveLayout="scroll"
            loading={loading}
            totalRecords={totalRecords}
            lazy
            first={first}
            onPage={onPage}
        >
            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
            <Column field="id" header="ID" sortable headerStyle={{ minWidth: '4rem' }}></Column>
            <Column field="name" header="Name" sortable headerStyle={{ minWidth: '14rem' }}></Column>
            <Column field="slug" header="Slug" sortable headerStyle={{ minWidth: '14rem' }}></Column>
            <Column field="value" header="Value" sortable headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="sort" header="Sort Order" sortable headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="status" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
        </DataTable>
    );
};

export default VariationOptionTable;
