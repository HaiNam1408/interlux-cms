import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Category } from '@/types/category';

interface CategoryListProps {
    categories: Category[];
    selectedCategories: Category[];
    expandedRows: any;
    loading: boolean;
    globalFilter: string;
    totalRecords: number;
    first: number;
    rows: number;
    dt: React.RefObject<DataTable<any>>;
    onSelectionChange: (e: any) => void;
    onRowToggle: (e: any) => void;
    onPage: (e: any) => void;
    onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editCategory: (category: Category) => void;
    confirmDeleteCategory: (category: Category) => void;
    editChildCategory: (child: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    selectedCategories,
    expandedRows,
    loading,
    globalFilter,
    totalRecords,
    first,
    rows,
    dt,
    onSelectionChange,
    onRowToggle,
    onPage,
    onGlobalFilterChange,
    editCategory,
    confirmDeleteCategory,
    editChildCategory
}) => {
    const idBodyTemplate = (rowData: Category) => (
        <>
            <span className="p-column-title">ID</span>
            {rowData.id}
        </>
    );

    const nameBodyTemplate = (rowData: Category) => (
        <>
            <span className="p-column-title">Name</span>
            {rowData.name}
        </>
    );

    const slugBodyTemplate = (rowData: Category) => (
        <>
            <span className="p-column-title">Slug</span>
            {rowData.slug}
        </>
    );

    const sortBodyTemplate = (rowData: Category) => (
        <>
            <span className="p-column-title">Sort Order</span>
            {rowData.sort}
        </>
    );

    const imageBodyTemplate = (rowData: Category) => (
        <>
            <span className="p-column-title">Image</span>
            {rowData.image?.filePath ? <img src={rowData.image.filePath} alt={rowData.name} className="w-3rem h-3rem object-fit-cover border-round" /> : <span className="text-muted">No image</span>}
        </>
    );

    const actionBodyTemplate = (rowData: Category) => (
        <div className="flex">
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editCategory(rowData)} />
            <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteCategory(rowData)} />
        </div>
    );

    const expandedRowTemplate = (data: Category) => (
        <div className="p-3">
            <div className="p-datatable p-component">
                <table className="p-datatable-table">
                    <thead className="p-datatable-thead">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Sort Order</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="p-datatable-tbody">
                        {data.children?.map((child, index) => (
                            <tr key={child.id} className="p-datatable-row">
                                <td>{child.id}</td>
                                <td>{child.name}</td>
                                <td>{child.slug}</td>
                                <td>{child.sort || index + 1}</td>
                                <td>{child.image?.filePath ? <img src={child.image.filePath} alt={child.name} className="w-3rem h-3rem object-fit-cover border-round" /> : <span className="text-muted">No image</span>}</td>
                                <td>
                                    <div className="flex">
                                        <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editChildCategory(child)} />
                                        <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteCategory(child)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Categories</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={onGlobalFilterChange} placeholder="Search..." value={globalFilter} />
            </span>
        </div>
    );

    return (
        <DataTable
            ref={dt}
            value={categories}
            expandedRows={expandedRows}
            onRowToggle={onRowToggle}
            rowExpansionTemplate={expandedRowTemplate}
            selection={selectedCategories}
            onSelectionChange={onSelectionChange}
            dataKey="id"
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories"
            totalRecords={totalRecords}
            lazy
            first={first}
            onPage={onPage}
            loading={loading}
            globalFilter={globalFilter}
            emptyMessage="No categories found."
            header={header}
            responsiveLayout="scroll"
        >
            <Column expander={(props) => props.children?.length} style={{ width: '3rem' }} />
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }} />
            <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '14rem' }} />
            <Column field="slug" header="Slug" sortable body={slugBodyTemplate} headerStyle={{ minWidth: '14rem' }} />
            <Column field="sort" header="Sort Order" sortable body={sortBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
            <Column field="image" header="Image" body={imageBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
        </DataTable>
    );
};

export default CategoryList;
