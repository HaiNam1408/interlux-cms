/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { ProductApiService } from '../../../service/ProductApiService';
import { CategoryService } from '../../../service/CategoryService';
import { Product, ProductStatus } from '@/types/product';
import { Category } from '@/types/category';
import { PaginatedData } from '@/types/response';

import {
    ProductTable,
    ProductForm,
    DeleteProductDialog,
    DeleteProductsDialog
} from './components';
import { generateSlug } from '@/lib/utils';
import { useDebounce } from 'use-debounce';

const ProductPage = () => {
    let emptyProduct: Product = {
        id: 0,
        title: '',
        slug: '',
        description: '',
        price: 0,
        percentOff: 0,
        sold: 0,
        attributes: {},
        categoryId: 0,
        images: [],
        model: undefined,
        sort: 0,
        status: 'DRAFT' as ProductStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productSidebar, setProductSidebar] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [searchText] = useDebounce(globalFilter, 300);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    // Pagination state
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [imagesToDelete, setImagesToDelete] = useState<{fileName: string, url: string}[]>([]);
    const [removeModel, setRemoveModel] = useState<boolean>(false);

    useEffect(() => {
        loadProducts(searchText.trim());
        loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, rows, searchText]);

    const loadProducts = (search?: string) => {
        setLoading(true);
        ProductApiService.getProducts(currentPage, rows, { search })
            .then((response: PaginatedData<Product> | null) => {
                if (response) {
                    setProducts(response.data);
                    setTotalRecords(response.meta.total);
                } else {
                    setProducts([]);
                    setTotalRecords(0);
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setProducts([]);
                setTotalRecords(0);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load products',
                    life: 3000
                });
            });
    };

    const loadCategories = () => {
        CategoryService.getAllCategories().then((data) => {
            setCategories(data);
        });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductSidebar(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductSidebar(false);
        setRemoveModel(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.title.trim()) {
            let _product = { ...product };

            if (!_product.slug) {
                _product.slug = generateSlug(_product.title);
            }

            const formData = new FormData();
            formData.append('title', _product.title);
            formData.append('slug', _product.slug || '');
            formData.append('description', _product.description || '');
            formData.append('price', _product.price.toString());
            formData.append('percentOff', (_product.percentOff || 0).toString());
            formData.append('categoryId', _product.categoryId.toString());
            formData.append('sort', (_product.sort || 0).toString());
            formData.append('status', _product.status);

            if (_product.attributes) {
                formData.append('attributes', JSON.stringify(_product.attributes));
            } else {
                formData.append('attributes', '{}');
            }

            // Handle images
            if (fileUploadRef.current && fileUploadRef.current.getFiles().length > 0) {
                const files = fileUploadRef.current.getFiles();
                for (let i = 0; i < files.length; i++) {
                    formData.append('images', files[i]);
                }
            }

            // Handle images to delete when updating
            if (_product.id && imagesToDelete.length > 0) {
                formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
            }

            // Handle 3D model file if present in the form
            const model3dFileInput = document.getElementById('model3d') as HTMLInputElement;
            if (model3dFileInput && model3dFileInput.files && model3dFileInput.files.length > 0) {
                formData.append('model3d', model3dFileInput.files[0]);
            }

            // Handle model deletion when updating
            if (_product.id && removeModel) {
                formData.append('removeModel', 'true');
            }

            if (_product.id) {
                ProductApiService.updateProduct(_product.id, formData)
                    .then(() => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Updated',
                            life: 3000
                        });
                        loadProducts();
                    })
                    .catch((error) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to update product: ${error.message}`,
                            life: 3000
                        });
                    });
            } else {
                ProductApiService.createProduct(formData)
                    .then((result) => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Created',
                            life: 3000
                        });
                        loadProducts();
                    })
                    .catch((error) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to create product: ${error.message || 'Unknown error'}`,
                            life: 3000
                        });
                    });
            }

            setProductSidebar(false);
            setProduct(emptyProduct);
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
            setImagesToDelete([]);
            setRemoveModel(false);
        }
    };

    const editProduct = (product: Product) => {
        setImagesToDelete([]);
        setRemoveModel(false);

        if (product.id) {
            setProductSidebar(true);
            ProductApiService.getProductById(product.id)
                .then((fullProduct) => {
                    if (fullProduct) {
                        setProduct(fullProduct);
                    } else {
                        setProduct({ ...product });
                    }
                })
                .catch((error) => {
                    setProduct({ ...product });
                });
        } else {
            setProduct({ ...product });
            setProductSidebar(true);
        }
    };

    const confirmDeleteProduct = (product: Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        ProductApiService.deleteProduct(product.id)
            .then(() => {
                setDeleteProductDialog(false);
                setProduct(emptyProduct);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
                loadProducts();
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to delete product: ${error.message}`,
                    life: 3000
                });
            });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        if (!selectedProducts || selectedProducts.length === 0) return;

        const deletePromises = selectedProducts.map((product) => ProductApiService.deleteProduct(product.id));

        Promise.all(deletePromises)
            .then(() => {
                loadProducts();
                setDeleteProductsDialog(false);
                setSelectedProducts([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to delete products: ${error.message}`,
                    life: 3000
                });
            });
    };

    const onCategoryChange = (e: { value: number }) => {
        let _product = { ...product };
        _product.categoryId = e.value;
        setProduct(_product);
    };

    const onStatusChange = (e: { value: string }) => {
        let _product = { ...product };
        _product.status = e.value as ProductStatus;
        setProduct(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product } as any;
        _product[name] = val;

        if (name === 'title' && !_product.slug) {
            _product.slug = generateSlug(val);
        }

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product } as any;
        _product[name] = val;

        setProduct(_product);
    };

    const onAttributesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            const attributesObj = e.target.value ? JSON.parse(e.target.value) : {};
            let _product = { ...product };
            _product.attributes = attributesObj;
            setProduct(_product);
        } catch (error) {
            console.error('Invalid JSON for attributes:', error);
        }
    };

    const onEditorChange = (val: string, name: string) => {
        let _product = { ...product } as any;
        _product[name] = val;

        setProduct(_product);
    };

    const handleImageDelete = (image: {fileName: string, url: string}) => {
        setImagesToDelete([...imagesToDelete, image]);

        let _product = { ...product };
        if (Array.isArray(_product.images)) {
            _product.images = _product.images.filter(img => {
                if (typeof img === 'string') {
                    return img !== image.url;
                } else if (img && typeof img === 'object') {
                    const imgPath = img.filePath || (img as any).url || '';
                    return imgPath !== image.url;
                }
                return true;
            });
            setProduct(_product);
        }
    };

    const handleDeleteModel = () => {
        setRemoveModel(true);

        let _product = { ...product };
        _product.model = undefined;
        setProduct(_product);
    };

    const onPage = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(Math.floor(event.first / event.rows) + 1);
    };

    const statusOptions = [
        { label: 'DRAFT', value: 'DRAFT' },
        { label: 'ACTIVE', value: 'ACTIVE' },
        { label: 'PUBLISHED', value: 'PUBLISHED' },
        { label: 'ARCHIVED', value: 'ARCHIVED' }
    ];

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar
                        className="mb-3"
                        start={
                            <div className="my-2">
                                <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || selectedProducts.length === 0} />
                            </div>
                        }
                        end={
                            <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
                        }
                    />

                    <ProductTable
                        products={products}
                        selectedProducts={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        loading={loading}
                        totalRecords={totalRecords}
                        first={first}
                        rows={rows}
                        onPage={onPage}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        onEdit={editProduct}
                        onDelete={confirmDeleteProduct}
                        dt={dt}
                        exportCSV={exportCSV}
                    />

                    <ProductForm
                        visible={productSidebar}
                        onHide={hideDialog}
                        product={product}
                        submitted={submitted}
                        categories={categories}
                        statusOptions={statusOptions}
                        onSave={saveProduct}
                        onInputChange={onInputChange}
                        onInputNumberChange={onInputNumberChange}
                        onEditorChange={onEditorChange}
                        onAttributesChange={onAttributesChange}
                        onCategoryChange={onCategoryChange}
                        onStatusChange={onStatusChange}
                        onImageDelete={handleImageDelete}
                        onDeleteModel={handleDeleteModel}
                        fileUploadRef={fileUploadRef}
                    />

                    <DeleteProductDialog
                        visible={deleteProductDialog}
                        onHide={hideDeleteProductDialog}
                        product={product}
                        onDelete={deleteProduct}
                    />

                    <DeleteProductsDialog
                        visible={deleteProductsDialog}
                        onHide={hideDeleteProductsDialog}
                        onDeleteSelected={deleteSelectedProducts}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
