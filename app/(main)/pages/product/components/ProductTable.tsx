import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Product, ProductStatus } from '@/types/product';

interface ProductTableProps {
    products: Product[];
    selectedProducts: Product[];
    onSelectionChange: (e: any) => void;
    loading: boolean;
    totalRecords: number;
    first: number;
    rows: number;
    onPage: (e: any) => void;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    dt: React.RefObject<any>;
    exportCSV: () => void;
}

const ProductTable = (props: ProductTableProps) => {
    const {
        products,
        selectedProducts,
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

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const idBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const titleBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Title</span>
                {rowData.title}
            </>
        );
    };

    const slugBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Slug</span>
                {rowData.slug}
            </>
        );
    };

    const priceBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category ? rowData.category.name : ''}
            </>
        );
    };

    const statusBodyTemplate = (rowData: Product) => {
        // Ensure status is available and convert to string if needed
        const status = rowData.status ? rowData.status.toString() : 'UNKNOWN';
        
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${status.toLowerCase()}`}>
                    {status}
                </span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Product) => {
        return (
            <div className="flex">
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => onDelete(rowData)} />
            </div>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={() => onEdit(null as any)} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={() => onDelete(null as any)} disabled={!selectedProducts || selectedProducts.length === 0} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <DataTable
            ref={dt}
            value={products}
            selection={selectedProducts}
            onSelectionChange={onSelectionChange}
            selectionMode="multiple"
            dataKey="id"
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            totalRecords={totalRecords}
            lazy
            first={first}
            onPage={onPage}
            loading={loading}
            globalFilter={globalFilter}
            emptyMessage="No products found."
            header={header}
        >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
            <Column field="title" header="Title" sortable body={titleBodyTemplate} headerStyle={{ minWidth: '14rem' }}></Column>
            <Column field="slug" header="Slug" sortable body={slugBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="price" header="Price" sortable body={priceBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
            <Column field="categoryId" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="status" header="Status" sortable body={statusBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
        </DataTable>
    );
};

export default ProductTable;
