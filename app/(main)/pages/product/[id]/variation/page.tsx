/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { ProductApiService } from '@/demo/service/ProductApiService';
import { VariationApiService, ProductVariation, Variation, VariationOption } from '@/demo/service/VariationApiService';
import { PaginatedData } from '@/types/response';
import { useParams, useRouter } from 'next/navigation';
import './styles.css';
import {
    ProductVariationTable,
    ProductVariationForm,
    DeleteProductVariationDialog,
    DeleteProductVariationsDialog
} from './components';

const ProductVariationPage = () => {
    const params = useParams();
    const router = useRouter();
    const productId = params.id ? parseInt(params.id as string) : 0;

    useEffect(() => {
        if (!productId) {
            console.error('No product ID provided');
        }
    }, [productId, router]);

    let emptyProductVariation: ProductVariation = {
        id: 0,
        productId: productId,
        sku: '',
        price: 0,
        percentOff: 0,
        inventory: 0,
        images: [],
        isDefault: false,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        options: []
    };

    const [product, setProduct] = useState<any>(null);
    const [variations, setVariations] = useState<Variation[]>([]);
    const [variationOptions, setVariationOptions] = useState<Record<number, VariationOption[]>>({});
    const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
    const [variationSidebar, setVariationSidebar] = useState(false);
    const [deleteVariationDialog, setDeleteVariationDialog] = useState(false);
    const [deleteVariationsDialog, setDeleteVariationsDialog] = useState(false);
    const [productVariation, setProductVariation] = useState<ProductVariation>(emptyProductVariation);
    const [selectedVariations, setSelectedVariations] = useState<ProductVariation[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const fileUploadRef = useRef<any>(null);

    // Pagination state
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [imagesToDelete, setImagesToDelete] = useState<{fileName: string, url: string}[]>([]);

    useEffect(() => {
        loadProduct();
        loadVariations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, rows]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await ProductApiService.getProductById(productId);
            if (data) {
                setProduct(data);
                setProductVariations(data.variations || []);
                setTotalRecords((data.variations || []).length);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load product',
                life: 3000
            });
        }
    };

    const loadVariations = async () => {
        try {
            const response = await VariationApiService.getVariations(1, 100);

            if (response) {
                const variations = response.data || [];
                setVariations(variations);

                const optionsPromises = variations.map((variation: Variation) =>
                    VariationApiService.getVariationOptions(variation.id, 1, 100)
                );

                const optionsResponses = await Promise.all(optionsPromises);

                const optionsMap: Record<number, VariationOption[]> = {};

                variations.forEach((variation: Variation, index: number) => {
                    if (optionsResponses[index]) {
                        const options = optionsResponses[index]?.data || [];
                        optionsMap[variation.id] = options;
                    }
                });

                setVariationOptions(optionsMap);
            } else {
                console.warn("No response from getVariations API");
                setVariations([]);
                setVariationOptions({});
            }
        } catch (error) {
            console.error('Error loading variations:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load variations',
                life: 3000
            });
        }
    };

    const openNew = () => {
        setProductVariation(emptyProductVariation);
        setImagesToDelete([]);
        setSubmitted(false);
        setVariationSidebar(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setVariationSidebar(false);
    };

    const hideDeleteVariationDialog = () => {
        setDeleteVariationDialog(false);
    };

    const hideDeleteVariationsDialog = () => {
        setDeleteVariationsDialog(false);
    };

    const saveProductVariation = () => {
        setSubmitted(true);

        if (productVariation.sku.trim()) {
            let _productVariation = { ...productVariation };

            const formData = new FormData();
            formData.append('sku', _productVariation.sku);
            formData.append('price', (_productVariation.price || 0).toString());
            formData.append('percentOff', (_productVariation.percentOff || 0).toString());
            formData.append('inventory', _productVariation.inventory.toString());
            formData.append('isDefault', _productVariation.isDefault.toString());
            formData.append('status', _productVariation.status);

            // Handle options
            if (_productVariation.options && _productVariation.options.length > 0) {
                console.log('Sending options:', _productVariation.options);
                formData.append('options', JSON.stringify(_productVariation.options.map(opt => ({
                    variationOptionId: opt.variationOptionId
                }))));
            }

            // Handle images
            if (fileUploadRef.current && fileUploadRef.current.getFiles().length > 0) {
                const files = fileUploadRef.current.getFiles();
                for (let i = 0; i < files.length; i++) {
                    formData.append('images', files[i]);
                }
            }

            // Handle images to delete when updating
            if (_productVariation.id && imagesToDelete.length > 0) {
                console.log('Sending imagesToDelete:', imagesToDelete);
                formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
            }

            if (_productVariation.id) {
                // Update existing product variation
                VariationApiService.updateProductVariation(productId, _productVariation.id, formData)
                    .then(() => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Variation Updated',
                            life: 3000
                        });
                        loadProduct();
                    })
                    .catch((error) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to update product variation: ${error.message}`,
                            life: 3000
                        });
                    });
            } else {
                // Create new product variation
                VariationApiService.createProductVariation(productId, formData)
                    .then(() => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Variation Created',
                            life: 3000
                        });
                        loadProduct();
                    })
                    .catch((error) => {
                        console.error('Failed to create product variation:', error);
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to create product variation: ${error.message || 'Unknown error'}`,
                            life: 3000
                        });
                    });
            }

            setVariationSidebar(false);
            setProductVariation(emptyProductVariation);
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
            setImagesToDelete([]);
        }
    };

    const editProductVariation = async (variation: ProductVariation) => {
        setImagesToDelete([]);

        if (variation.id) {
            setVariationSidebar(true);

            try {
                const fullVariation = await VariationApiService.getProductVariationById(productId, variation.id);
                if (fullVariation) {
                    setProductVariation(fullVariation);
                } else {
                    setProductVariation({ ...variation });
                }
            } catch (error) {
                console.error('Error fetching full product variation data:', error);
                setProductVariation({ ...variation });
            }
        } else {
            setProductVariation({ ...variation });
            setVariationSidebar(true);
        }
    };

    const confirmDeleteVariation = (variation: ProductVariation) => {
        setProductVariation(variation);
        setDeleteVariationDialog(true);
    };

    const deleteVariation = () => {
        VariationApiService.deleteProductVariation(productId, productVariation.id)
            .then(() => {
                setDeleteVariationDialog(false);
                setProductVariation(emptyProductVariation);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Variation Deleted',
                    life: 3000
                });
                loadProduct();
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to delete product variation: ${error.message}`,
                    life: 3000
                });
            });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteVariationsDialog(true);
    };

    const deleteSelectedVariations = () => {
        if (!selectedVariations || selectedVariations.length === 0) return;

        const deletePromises = selectedVariations.map((variation) =>
            VariationApiService.deleteProductVariation(productId, variation.id)
        );

        Promise.all(deletePromises)
            .then(() => {
                loadProduct();
                setDeleteVariationsDialog(false);
                setSelectedVariations([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Variations Deleted',
                    life: 3000
                });
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to delete product variations: ${error.message}`,
                    life: 3000
                });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _variation = { ...productVariation } as any;
        _variation[name] = val;
        setProductVariation(_variation);
    };

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value || 0;
        let _variation = { ...productVariation } as any;
        _variation[name] = val;
        setProductVariation(_variation);
    };

    const onStatusChange = (e: any) => {
        let _variation = { ...productVariation };
        _variation.status = e.value as 'ACTIVE' | 'INACTIVE' | 'DRAFT';
        setProductVariation(_variation);
    };

    const onDefaultChange = (e: any) => {
        let _variation = { ...productVariation };
        _variation.isDefault = e.checked;
        setProductVariation(_variation);
    };

    const onOptionsChange = (selectedOptions: { variationOptionId: number }[]) => {
        let _variation = { ...productVariation };
        // Convert to ProductVariationOption type
        _variation.options = selectedOptions.map(opt => ({
            id: 0,
            productVariationId: productVariation.id,
            variationOptionId: opt.variationOptionId
        }));
        setProductVariation(_variation);
    };

    const handleImageDelete = (image: {fileName: string, url: string}) => {
        setImagesToDelete([...imagesToDelete, image]);

        console.log('Adding image to delete:', image);
        console.log('Updated imagesToDelete:', [...imagesToDelete, image]);

        let _variation = { ...productVariation };
        if (Array.isArray(_variation.images)) {
            _variation.images = _variation.images.filter(img => {
                if (typeof img === 'string') {
                    return img !== image.url;
                } else if (img && typeof img === 'object') {
                    const imgPath = img.filePath || (img as any).url || '';
                    return imgPath !== image.url;
                }
                return true;
            });
            setProductVariation(_variation);
        }
    };

    // Handle pagination change
    const onPage = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(Math.floor(event.first / event.rows) + 1);
    };

    const statusOptions = [
        { label: 'ACTIVE', value: 'ACTIVE' },
        { label: 'INACTIVE', value: 'INACTIVE' },
        { label: 'DRAFT', value: 'DRAFT' }
    ];

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h3>
                            {product ? `Variations for Product: ${product.title}` : 'Loading product information...'}
                        </h3>
                        <Button
                            label="Back to Products"
                            icon="pi pi-arrow-left"
                            className="p-button-outlined"
                            onClick={() => router.push('/pages/product')}
                        />
                    </div>

                    <Toolbar
                        className="mb-3"
                        start={
                            <div className="my-2">
                                <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedVariations || selectedVariations.length === 0} />
                            </div>
                        }
                        end={
                            <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
                        }
                    />

                    <ProductVariationTable
                        productVariations={productVariations}
                        selectedVariations={selectedVariations}
                        onSelectionChange={(e) => setSelectedVariations(e.value)}
                        loading={loading}
                        totalRecords={totalRecords}
                        first={first}
                        rows={rows}
                        onPage={onPage}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        onEdit={editProductVariation}
                        onDelete={confirmDeleteVariation}
                        dt={dt}
                        exportCSV={exportCSV}
                    />

                    <ProductVariationForm
                        visible={variationSidebar}
                        onHide={hideDialog}
                        productVariation={productVariation}
                        submitted={submitted}
                        statusOptions={statusOptions}
                        variations={variations}
                        variationOptions={variationOptions}
                        onSave={saveProductVariation}
                        onInputChange={onInputChange}
                        onInputNumberChange={onInputNumberChange}
                        onStatusChange={onStatusChange}
                        onDefaultChange={onDefaultChange}
                        onOptionsChange={onOptionsChange}
                        onImageDelete={handleImageDelete}
                        fileUploadRef={fileUploadRef}
                    />

                    <DeleteProductVariationDialog
                        visible={deleteVariationDialog}
                        onHide={hideDeleteVariationDialog}
                        productVariation={productVariation}
                        onDelete={deleteVariation}
                    />

                    <DeleteProductVariationsDialog
                        visible={deleteVariationsDialog}
                        onHide={hideDeleteVariationsDialog}
                        onDeleteSelected={deleteSelectedVariations}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductVariationPage;
