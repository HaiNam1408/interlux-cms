'use client';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { DropResult } from 'react-beautiful-dnd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CategoryService } from '../../../service/CategoryService';
import { Category as CategoryType } from '@/types/category';
import { PaginatedData } from '@/types/response';
import {
    CategoryDialog,
    CategoryList,
    CategoryToolbar,
    DeleteDialogs
} from './components';
import { DataTable } from 'primereact/datatable';
import slugify from 'slugify';

const Category = () => {
    const emptyCategory: CategoryType = {
        id: 0,
        name: '',
        slug: '',
        sort: 0,
        parentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // State for categories and UI
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [expandedRows, setExpandedRows] = useState<any>({});
    const [parentCategories, setParentCategories] = useState<CategoryType[]>([]);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
    const [category, setCategory] = useState<CategoryType>(emptyCategory);
    const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');

    // Refs
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    // Pagination state
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Image handling state
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageAction, setImageAction] = useState<'none' | 'upload' | 'delete'>('none');

    const loadCategories = useCallback(() => {
        setLoading(true);
        CategoryService.getCategories(currentPage, rows)
            .then((response: PaginatedData<CategoryType | null> | null) => {
                setCategories((response?.data ?? []).filter((category): category is CategoryType => category !== null));
                setTotalRecords(response?.meta.total ?? 0);
                setLoading(false);
            })
            .catch((error) => {
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
    }, [currentPage, rows]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setSelectedImage(null);
        setImageAction('none');
        setCategoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
        setSelectedImage(null);
        setImageAction('none');
    };

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    };

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    };

    const generateSlug = (name: string) => {
        const withoutAccents = name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');

        return slugify(withoutAccents, {
            lower: true,
            strict: true,
            trim: true
        });
    };

    const handleImageUpload = (file: File) => {
        setSelectedImage(file);
        setImageAction('upload');
    };

    const handleImageDelete = () => {
        setSelectedImage(null);
        setImageAction('delete');
    };

    const saveCategory = () => {
        setSubmitted(true);

        if (category.name.trim()) {
            let _category = { ...category };

            if (!_category.slug) {
                _category.slug = generateSlug(_category.name);
            }

            if (_category.id) {
                const updateData: any = {
                    name: _category.name,
                    slug: _category.slug,
                    sort: _category.sort,
                    parentId: _category.parentId
                };

                if (imageAction === 'upload' && selectedImage) {
                    updateData.image = selectedImage;
                } else if (imageAction === 'delete') {
                    updateData.image = '';
                }

                CategoryService.updateCategory(_category.id, updateData)
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
                const newCategory: any = {
                    name: _category.name,
                    slug: _category.slug,
                    sort: _category.sort,
                    parentId: _category.parentId
                };

                // Add image if selected
                if (imageAction === 'upload' && selectedImage) {
                    newCategory.image = selectedImage;
                }

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
            setSelectedImage(null);
            setImageAction('none');
        }
    };

    const editCategory = (category: CategoryType) => {
        setCategory({ ...category });
        setSelectedImage(null);
        setImageAction('none');
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
        let _category = { ...category } as any;
        _category[name] = val;

        // Auto-generate slug when name changes
        if (name === 'name') {
            _category.slug = generateSlug(val);
        }

        setCategory(_category);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value ?? 0;
        let _category = { ...category } as any;
        _category[name] = val;

        setCategory(_category);
    };

    const onParentChange = (e: { value: number | null }) => {
        let _category = { ...category };
        _category.parentId = e.value;
        setCategory(_category);
    };



    const editChildCategory = (child: CategoryType) => {
        const fullChild = {
            ...child,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setCategory(fullChild);
        setSelectedImage(null);
        setImageAction('none');
        setCategoryDialog(true);
    };

    const onPage = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(Math.floor(event.first / event.rows) + 1);
    };



    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <CategoryToolbar
                        selectedCategories={selectedCategories}
                        openNew={openNew}
                        confirmDeleteSelected={confirmDeleteSelected}
                        exportCSV={exportCSV}
                    />

                    <CategoryList
                        categories={categories}
                        selectedCategories={selectedCategories}
                        expandedRows={expandedRows}
                        loading={loading}
                        globalFilter={globalFilter}
                        totalRecords={totalRecords}
                        first={first}
                        rows={rows}
                        dt={dt}
                        onSelectionChange={(e) => setSelectedCategories(e.value)}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        onPage={onPage}
                        onGlobalFilterChange={(e) => setGlobalFilter(e.target.value)}
                        editCategory={editCategory}
                        confirmDeleteCategory={confirmDeleteCategory}
                        editChildCategory={editChildCategory}
                    />

                    <CategoryDialog
                        visible={categoryDialog}
                        category={category}
                        parentCategories={parentCategories}
                        submitted={submitted}
                        onHide={hideDialog}
                        onSave={saveCategory}
                        onInputChange={onInputChange}
                        onInputNumberChange={onInputNumberChange}
                        onParentChange={onParentChange}
                        onImageUpload={handleImageUpload}
                        onImageDelete={handleImageDelete}
                        selectedImage={selectedImage}
                    />

                    <DeleteDialogs
                        deleteCategoryDialog={deleteCategoryDialog}
                        deleteCategoriesDialog={deleteCategoriesDialog}
                        category={category}
                        hideDeleteCategoryDialog={hideDeleteCategoryDialog}
                        hideDeleteCategoriesDialog={hideDeleteCategoriesDialog}
                        deleteCategory={deleteCategory}
                        deleteSelectedCategories={deleteSelectedCategories}
                    />
                </div>
            </div>
        </div>
    );
};

export default Category;
