import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
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
    onParentDragEnd: (result: DropResult) => void;
    onDragEnd: (result: DropResult, parentId: number) => void;
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
    onParentDragEnd,
    onDragEnd,
    editChildCategory
}) => {
    const idBodyTemplate = (rowData: Category) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Category) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const slugBodyTemplate = (rowData: Category) => {
        return (
            <>
                <span className="p-column-title">Slug</span>
                {rowData.slug}
            </>
        );
    };

    const sortBodyTemplate = (rowData: Category) => {
        return (
            <>
                <span className="p-column-title">Sort Order</span>
                {rowData.sort}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Category) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                {rowData.image && rowData.image.filePath ? (
                    <img 
                        src={rowData.image.filePath} 
                        alt={rowData.name} 
                        className="w-3rem h-3rem object-fit-cover border-round"
                    />
                ) : (
                    <span className="text-muted">No image</span>
                )}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Category) => {
        return (
            <div className="flex">
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    severity="success" 
                    className="mr-2" 
                    onClick={() => editCategory(rowData)} 
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    severity="warning" 
                    onClick={() => confirmDeleteCategory(rowData)} 
                />
            </div>
        );
    };

    const expandedRowTemplate = (data: Category) => {
        return (
            <div className="p-3">
                <DragDropContext onDragEnd={(result: DropResult) => onDragEnd(result, data.id)}>
                    <Droppable droppableId={`droppable-${data.id}`}>
                        {(provided: any) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="p-datatable p-component">
                                <table className="p-datatable-table">
                                    <thead className="p-datatable-thead">
                                        <tr>
                                            <th style={{ width: '4rem' }}></th>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Slug</th>
                                            <th>Sort Order</th>
                                            <th>Image</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="p-datatable-tbody">
                                        {data.children &&
                                            data.children.map((child, index) => (
                                                <Draggable key={child.id} draggableId={`child-${child.id}`} index={index}>
                                                    {(provided: any) => (
                                                        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-datatable-row">
                                                            <td>
                                                                <i className="pi pi-bars" style={{ cursor: 'move' }}></i>
                                                            </td>
                                                            <td>{child.id}</td>
                                                            <td>{child.name}</td>
                                                            <td>{child.slug}</td>
                                                            <td>{child.sort || index + 1}</td>
                                                            <td>
                                                                {child.image && child.image.filePath ? (
                                                                    <img 
                                                                        src={child.image.filePath} 
                                                                        alt={child.name} 
                                                                        className="w-3rem h-3rem object-fit-cover border-round"
                                                                    />
                                                                ) : (
                                                                    <span className="text-muted">No image</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="flex">
                                                                    <Button 
                                                                        icon="pi pi-pencil" 
                                                                        rounded 
                                                                        severity="success" 
                                                                        className="mr-2" 
                                                                        onClick={() => editChildCategory(child)} 
                                                                    />
                                                                    <Button 
                                                                        icon="pi pi-trash" 
                                                                        rounded 
                                                                        severity="warning" 
                                                                        onClick={() => confirmDeleteCategory(child)} 
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Categories</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText 
                    type="search" 
                    onInput={onGlobalFilterChange} 
                    placeholder="Search..." 
                    value={globalFilter}
                />
            </span>
        </div>
    );

    return (
        <DragDropContext onDragEnd={onParentDragEnd}>
            <Droppable droppableId="droppable-parent">
                {(provided: any) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
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
                            <Column
                                style={{ width: '3rem' }}
                                body={(data, props) => (
                                    <Draggable draggableId={`parent-${data.id}`} index={props.rowIndex}>
                                        {(provided: any) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <i className="pi pi-bars" style={{ cursor: 'move' }}></i>
                                            </div>
                                        )}
                                    </Draggable>
                                )}
                            />
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                            <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '14rem' }}></Column>
                            <Column field="slug" header="Slug" sortable body={slugBodyTemplate} headerStyle={{ minWidth: '14rem' }}></Column>
                            <Column field="sort" header="Sort Order" sortable body={sortBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="image" header="Image" body={imageBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default CategoryList;
