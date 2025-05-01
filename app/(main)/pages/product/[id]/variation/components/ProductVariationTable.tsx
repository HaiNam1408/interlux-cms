import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProductVariation } from '@/demo/service/VariationApiService';

interface ProductVariationTableProps {
    productVariations: ProductVariation[];
    selectedVariations: ProductVariation[];
    onSelectionChange: (e: any) => void;
    loading: boolean;
    totalRecords: number;
    first: number;
    rows: number;
    onPage: (e: any) => void;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    onEdit: (variation: ProductVariation) => void;
    onDelete: (variation: ProductVariation) => void;
    dt: React.RefObject<DataTable<any>>;
    exportCSV: () => void;
}

const ProductVariationTable = (props: ProductVariationTableProps) => {
    const {
        productVariations,
        selectedVariations,
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
            <h5 className="m-0">Manage Product Variations</h5>
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

    const actionBodyTemplate = (rowData: ProductVariation) => {
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

    const statusBodyTemplate = (rowData: ProductVariation) => {
        return (
            <span className={`product-badge status-${rowData.status.toLowerCase()}`}>
                {rowData.status}
            </span>
        );
    };

    const priceBodyTemplate = (rowData: ProductVariation) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(rowData.price || 0);
    };

    const defaultBodyTemplate = (rowData: ProductVariation) => {
        return rowData.isDefault ? 'Yes' : 'No';
    };

    const optionsBodyTemplate = (rowData: ProductVariation) => {
        if (!rowData.options || rowData.options.length === 0) {
            return <span>No options</span>;
        }

        return (
            <div className="flex flex-wrap gap-1">
                {rowData.options.map((option, index) => (
                    <span key={index} className="product-option-badge">
                        {option.variationOption?.name || `Option ${option.variationOptionId}`}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <DataTable
            ref={dt}
            value={productVariations}
            selection={selectedVariations}
            onSelectionChange={onSelectionChange}
            dataKey="id"
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} variations"
            globalFilter={globalFilter}
            emptyMessage="No product variations found."
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
            <Column field="sku" header="SKU" sortable headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="price" header="Price" body={priceBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }}></Column>
            <Column field="inventory" header="Inventory" sortable headerStyle={{ minWidth: '8rem' }}></Column>
            <Column field="isDefault" header="Default" body={defaultBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }}></Column>
            <Column field="options" header="Options" body={optionsBodyTemplate} headerStyle={{ minWidth: '14rem' }}></Column>
            <Column field="status" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '8rem' }}></Column>
            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
        </DataTable>
    );
};

export default ProductVariationTable;
