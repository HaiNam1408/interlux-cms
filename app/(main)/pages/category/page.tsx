'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import React, { useEffect, useRef, useState } from 'react';
import { CategoryService } from '../../../../demo/service/CategoryService';
import { Demo } from '@/types';
import { Category as CategoryType } from '@/types/category';
import { PaginatedData } from '@/types/response';

const Category = () => {
    let emptyCategory: CategoryType = {
        id: 0,
        name: '',
        slug: '',
        sort: 0,
        parentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [expandedRows, setExpandedRows] = useState<any>({});
    const [parentCategories, setParentCategories] = useState<Demo.Category[]>([]);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
    const [category, setCategory] = useState<Demo.Category>(emptyCategory);
    const [selectedCategories, setSelectedCategories] = useState<Demo.Category[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    // Pagination state
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, [currentPage, rows]);

    const loadCategories = () => {
        setLoading(true);
        CategoryService.getCategories(currentPage, rows)
            .then((response: PaginatedData<CategoryType | null> | null) => {
                setCategories((response?.data ?? []).filter((category): category is CategoryType => category !== null));
                setTotalRecords(response?.meta.total ?? 0);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error loading categories:', error);
                setLoading(false);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load categories',
                    life: 3000
                });
            });

        CategoryService.getParentCategories().then((data) => {
            setParentCategories(data);
        });
    };

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setCategoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    };

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    };

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const saveCategory = () => {
        setSubmitted(true);

        if (category.name.trim()) {
            let _category = { ...category };

            // Generate slug if empty
            if (!_category.slug) {
                _category.slug = generateSlug(_category.name);
            }

            if (_category.id) {
                // Update existing category
                CategoryService.updateCategory(_category.id, _category)
                    .then(() => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Category Updated',
                            life: 3000
                        });
                        loadCategories();
                    })
                    .catch((error) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to update category: ${error.message}`,
                            life: 3000
                        });
                    });
            } else {
                // Create new category
                const newCategory = {
                    name: _category.name,
                    slug: _category.slug,
                    sort: _category.sort,
                    parentId: _category.parentId
                };

                CategoryService.createCategory(newCategory)
                    .then(() => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Category Created',
                            life: 3000
                        });
                        loadCategories();
                    })
                    .catch((error) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to create category: ${error.message}`,
                            life: 3000
                        });
                    });
            }

            setCategoryDialog(false);
            setCategory(emptyCategory);
        }
    };

    const editCategory = (category: CategoryType) => {
        setCategory({ ...category });
        setCategoryDialog(true);
    };

    const confirmDeleteCategory = (category: CategoryType) => {
        setCategory(category);
        setDeleteCategoryDialog(true);
    };

    const deleteCategory = () => {
        CategoryService.deleteCategory(category.id)
            .then(() => {
                setDeleteCategoryDialog(false);
                setCategory(emptyCategory);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Category Deleted',
                    life: 3000
                });
                loadCategories();
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to delete category: ${error.message}`,
                    life: 3000
                });
            });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteCategoriesDialog(true);
    };

    const deleteSelectedCategories = () => {
        if (!selectedCategories || selectedCategories.length === 0) return;

        const deletePromises = selectedCategories.map((category) => CategoryService.deleteCategory(category.id));

        Promise.all(deletePromises)
            .then(() => {
                loadCategories();
                setDeleteCategoriesDialog(false);
                setSelectedCategories([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Categories Deleted',
                    life: 3000
                });
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to delete categories: ${error.message}`,
                    life: 3000
                });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _category = { ...category };
        _category[name as keyof Demo.Category] = val as never;

        // Auto-generate slug when name changes
        if (name === 'name' && !_category.slug) {
            _category.slug = generateSlug(val);
        }

        setCategory(_category);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value ?? 0;
        let _category = { ...category };
        _category[name as keyof Demo.Category] = val as never;

        setCategory(_category);
    };

    const onParentChange = (e: { value: number | null }) => {
        let _category = { ...category };
        _category.parentId = e.value;
        setCategory(_category);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || selectedCategories.length === 0} />
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

    const idBodyTemplate = (rowData: CategoryType) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: CategoryType) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const slugBodyTemplate = (rowData: CategoryType) => {
        return (
            <>
                <span className="p-column-title">Slug</span>
                {rowData.slug}
            </>
        );
    };

    const sortBodyTemplate = (rowData: CategoryType) => {
        return (
            <>
                <span className="p-column-title">Sort Order</span>
                {rowData.sort}
            </>
        );
    };

    const actionBodyTemplate = (rowData: CategoryType) => {
        return (
            <div className="flex">
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editCategory(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteCategory(rowData)} />
            </div>
        );
    };

    const expandedRowTemplate = (data: CategoryType) => {
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
                                                                <div className="flex">
                                                                    <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editChildCategory(child)} />
                                                                    <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteCategory(child as Demo.Category)} />
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

    const editChildCategory = (child: CategoryType) => {
        const fullChild = {
            ...child,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setCategory(fullChild);
        setCategoryDialog(true);
    };

    const onDragEnd = (result: DropResult, parentId: number) => {
        if (!result.destination) {
            return;
        }

        // Find the parent category
        const parentCategory = categories.find((cat) => cat.id === parentId);
        if (!parentCategory || !parentCategory.children) {
            return;
        }

        // Clone the children array
        const childrenCopy = [...parentCategory.children];

        // Get the moved item
        const [reorderedItem] = childrenCopy.splice(result.source.index, 1);

        // Insert it at the new position
        childrenCopy.splice(result.destination.index, 0, reorderedItem);

        // Update the sort order
        const updatedChildren = childrenCopy.map((child, index) => ({
            ...child,
            sort: index + 1
        }));

        // Create update promises
        const updatePromises = updatedChildren.map((child) => CategoryService.updateCategory(child.id, { ...child, sort: child.sort }));

        // Execute all updates
        Promise.all(updatePromises)
            .then(() => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Category Order Updated',
                    life: 3000
                });
                loadCategories();
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to update category order: ${error.message}`,
                    life: 3000
                });
            });
    };

    const onParentDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        // Clone the categories array
        const categoriesCopy = [...categories];

        // Get the moved item
        const [reorderedItem] = categoriesCopy.splice(result.source.index, 1);

        // Insert it at the new position
        categoriesCopy.splice(result.destination.index, 0, reorderedItem);

        // Update the sort order
        const updatedCategories = categoriesCopy.map((cat, index) => ({
            ...cat,
            sort: index + 1
        }));

        // Create update promises
        const updatePromises = updatedCategories.map((cat) => CategoryService.updateCategory(cat.id, { ...cat, sort: cat.sort }));

        // Execute all updates
        Promise.all(updatePromises)
            .then(() => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Category Order Updated',
                    life: 3000
                });
                loadCategories();
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to update category order: ${error.message}`,
                    life: 3000
                });
            });
    };

    // Handle pagination change
    const onPage = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(Math.floor(event.first / event.rows) + 1);
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Categories</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const categoryDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveCategory} />
        </>
    );

    const deleteCategoryDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCategoryDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteCategory} />
        </>
    );

    const deleteCategoriesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCategoriesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedCategories} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-3" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DragDropContext onDragEnd={onParentDragEnd}>
                        <Droppable droppableId="droppable-parent">
                            {(provided: any) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    <DataTable
                                        ref={dt}
                                        value={categories}
                                        expandedRows={expandedRows}
                                        onRowToggle={(e) => setExpandedRows(e.data)}
                                        rowExpansionTemplate={expandedRowTemplate}
                                        selection={selectedCategories}
                                        onSelectionChange={(e) => setSelectedCategories(e.value)}
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
                                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                    </DataTable>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <Dialog visible={categoryDialog} style={{ width: '450px' }} header="Category Details" modal className="p-fluid" footer={categoryDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={category.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !category.name
                                })}
                            />
                            {submitted && !category.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="slug">Slug</label>
                            <InputText id="slug" value={category.slug} onChange={(e) => onInputChange(e, 'slug')} />
                            <small className="text-muted">Leave empty to auto-generate from name</small>
                        </div>

                        <div className="field">
                            <label htmlFor="parent">Parent Category</label>
                            <Dropdown
                                id="parent"
                                value={category.parentId}
                                options={parentCategories.map((c) => ({ label: c.name, value: c.id })) || []}
                                onChange={onParentChange}
                                placeholder="Select a Parent Category"
                                optionLabel="label"
                                showClear
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="sort">Sort Order</label>
                            <InputNumber id="sort" value={category.sort} onValueChange={(e) => onInputNumberChange(e, 'sort')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCategoryDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {category && (
                                <span>
                                    Are you sure you want to delete <b>{category.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCategoriesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCategoriesDialogFooter} onHide={hideDeleteCategoriesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Are you sure you want to delete the selected categories?</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Category;
