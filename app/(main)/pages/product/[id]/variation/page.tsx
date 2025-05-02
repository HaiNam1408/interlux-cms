/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { FileUpload } from 'primereact/fileupload';
import React, { useEffect, useRef, useState } from 'react';
import { ProductApiService } from '@/demo/service/ProductApiService';
import { ProductAttributeApiService } from '@/demo/service/ProductAttributeApiService';
import { ProductVariationApiService } from '@/demo/service/ProductVariationApiService';
import {
    Product,
    ProductAttribute,
    ProductVariation,
    CommonStatus
} from '@/types/product';
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
        status: CommonStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attributeValues: []
    };

    const [product, setProduct] = useState<Product | null>(null);
    const [productAttributes, setProductAttributes] = useState<ProductAttribute[]>([]);
    const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
    const [variationDialog, setVariationDialog] = useState(false);
    const [deleteVariationDialog, setDeleteVariationDialog] = useState(false);
    const [deleteVariationsDialog, setDeleteVariationsDialog] = useState(false);
    const [productVariation, setProductVariation] = useState<ProductVariation>(emptyProductVariation);
    const [selectedVariations, setSelectedVariations] = useState<ProductVariation[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
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

    useEffect(() => {
        loadProduct();
        loadProductAttributes();
        loadProductVariations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, rows]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await ProductApiService.getProductById(productId);
            if (data) {
                setProduct(data);
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

    const loadProductAttributes = async () => {
        try {
            setLoading(true);
            console.log('Loading product attributes for product ID:', productId);

            const response = await ProductAttributeApiService.getProductAttributes(productId);

            console.log('Product attributes response:', response);

            if (response && response.data) {
                const attributesWithValues = await Promise.all(
                    response.data.map(async (attr) => {
                        const valuesResponse = await ProductAttributeApiService.getAttributeValues(productId, attr.id);
                        const values = valuesResponse ? valuesResponse.data : [];

                        return {
                            ...attr,
                            values: values
                        };
                    })
                );
                ;
                setProductAttributes(attributesWithValues);
            } else {
                setProductAttributes([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error in loadProductAttributes:', error);
            setLoading(false);
            setProductAttributes([]);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load product attributes',
                life: 3000
            });
        }
    };

    const loadProductVariations = async () => {
        try {
            setLoading(true);
            const response = await ProductVariationApiService.getProductVariations(productId);

            console.log('Product variations response in page:', response);

            if (response && response.data) {
                setProductVariations(response.data);
                setTotalRecords(response.data.length);
            } else {
                setProductVariations([]);
                setTotalRecords(0);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error in loadProductVariations:', error);
            setLoading(false);
            setProductVariations([]);
            setTotalRecords(0);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load product variations',
                life: 3000
            });
        }
    };

    const openNew = () => {
        setProductVariation(emptyProductVariation);
        setImagesToDelete([]);
        setSubmitted(false);
        setVariationDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setVariationDialog(false);
    };

    const hideDeleteVariationDialog = () => {
        setDeleteVariationDialog(false);
    };

    const hideDeleteVariationsDialog = () => {
        setDeleteVariationsDialog(false);
    };

    const saveProductVariation = async () => {
        setSubmitted(true);

        console.log('Saving product variation:', productVariation);

        if (productVariation.sku && productVariation.sku.trim()) {
            try {
                let _productVariation = { ...productVariation };
                console.log('Prepared product variation for saving:', _productVariation);
                const formData = new FormData();

                formData.append('sku', _productVariation.sku || '');

                // Safely handle price (could be undefined or null)
                if (_productVariation.price !== undefined && _productVariation.price !== null) {
                    formData.append('price', _productVariation.price.toString());
                } else {
                    formData.append('price', '0');
                }

                // Safely handle percentOff (could be undefined or null)
                if (_productVariation.percentOff !== undefined && _productVariation.percentOff !== null) {
                    formData.append('percentOff', _productVariation.percentOff.toString());
                } else {
                    formData.append('percentOff', '0');
                }

                // Safely handle inventory (could be undefined or null)
                if (_productVariation.inventory !== undefined && _productVariation.inventory !== null) {
                    formData.append('inventory', _productVariation.inventory.toString());
                } else {
                    formData.append('inventory', '0');
                }

                // Safely handle isDefault (could be undefined or null)
                formData.append('isDefault', (_productVariation.isDefault === true).toString());

                // Safely handle status (could be undefined or null)
                formData.append('status', _productVariation.status || 'ACTIVE');

                // Handle attribute values
                if (_productVariation.attributeValues && _productVariation.attributeValues.length > 0) {
                    _productVariation.attributeValues.forEach(av => {
                        // Safely handle attributeValueId (could be undefined or null)
                        if (av && av.attributeValueId !== undefined && av.attributeValueId !== null) {
                            formData.append('attributeValues[]', av.attributeValueId.toString());
                        }
                    });
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
                    imagesToDelete.forEach((image, index) => {
                        formData.append(`imagesToDelete[${index}][fileName]`, image.fileName);
                        formData.append(`imagesToDelete[${index}][url]`, image.url);
                    });
                }

                if (_productVariation.id) {
                    // Update existing product variation
                    await ProductVariationApiService.updateProductVariation(productId, _productVariation.id, formData);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Variation Updated',
                        life: 3000
                    });
                } else {
                    // Create new product variation
                    await ProductVariationApiService.createProductVariation(productId, formData);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Variation Created',
                        life: 3000
                    });
                }

                setVariationDialog(false);
                setProductVariation(emptyProductVariation);
                if (fileUploadRef.current) {
                    fileUploadRef.current.clear();
                }
                setImagesToDelete([]);
                loadProductVariations();
            } catch (error: any) {
                console.error('Failed to save product variation:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to save product variation: ${error.message || 'Unknown error'}`,
                    life: 3000
                });
            }
        }
    };

    const editProductVariation = async (variation: ProductVariation) => {
        console.log('Editing variation:', variation);
        setImagesToDelete([]);

        if (variation.id) {
            try {
                console.log('Fetching full variation data for ID:', variation.id);
                const fullVariation = await ProductVariationApiService.getProductVariationById(productId, variation.id);

                if (fullVariation) {
                    console.log('Received full variation data:', fullVariation);

                    // Ensure attributeValues is properly initialized
                    if (!fullVariation.attributeValues) {
                        console.log('attributeValues is missing, initializing empty array');
                        fullVariation.attributeValues = [];
                    } else {
                        console.log('Variation has attributeValues:', fullVariation.attributeValues);
                    }

                    // If we don't have attributeValue objects with attributeId, try to find them
                    if (fullVariation.attributeValues.length > 0 && productAttributes.length > 0) {
                        console.log('Trying to enhance attributeValues with attributeValue objects');

                        fullVariation.attributeValues = fullVariation.attributeValues.map(av => {
                            // If we already have attributeValue with attributeId, keep it
                            if (av.attributeValue && av.attributeValue.attributeId) {
                                return av;
                            }

                            // Try to find the attribute this value belongs to
                            for (const attr of productAttributes) {
                                if (attr.values) {
                                    const matchingValue = attr.values.find(val => val.id === av.attributeValueId);
                                    if (matchingValue) {
                                        console.log(`Found matching attribute (${attr.id}) for value ${av.attributeValueId}`);
                                        return {
                                            ...av,
                                            attributeValue: {
                                                ...matchingValue,
                                                attributeId: attr.id
                                            }
                                        };
                                    }
                                }
                            }
                            return av;
                        });
                    }

                    setProductVariation(fullVariation);
                } else {
                    console.warn('No full variation data received, using row data');
                    // Make sure we have an attributeValues array
                    const variationWithDefaults = {
                        ...variation,
                        attributeValues: variation.attributeValues || []
                    };
                    setProductVariation(variationWithDefaults);
                }
            } catch (error) {
                console.error('Error fetching full product variation data:', error);
                // Make sure we have an attributeValues array
                const variationWithDefaults = {
                    ...variation,
                    attributeValues: variation.attributeValues || []
                };
                setProductVariation(variationWithDefaults);
            }

            // Set dialog visible after data is prepared
            setVariationDialog(true);
        } else {
            // Make sure we have an attributeValues array for new variations too
            const variationWithDefaults = {
                ...variation,
                attributeValues: []
            };
            setProductVariation(variationWithDefaults);
            setVariationDialog(true);
        }
    };

    const confirmDeleteVariation = (variation: ProductVariation) => {
        setProductVariation(variation);
        setDeleteVariationDialog(true);
    };

    const deleteVariation = async () => {
        try {
            await ProductVariationApiService.deleteProductVariation(productId, productVariation.id);
            setDeleteVariationDialog(false);
            setProductVariation(emptyProductVariation);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Variation Deleted',
                life: 3000
            });
            loadProductVariations();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to delete product variation: ${error.message || 'Unknown error'}`,
                life: 3000
            });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteVariationsDialog(true);
    };

    const deleteSelectedVariations = async () => {
        if (!selectedVariations || selectedVariations.length === 0) return;

        try {
            const deletePromises = selectedVariations.map((variation) =>
                ProductVariationApiService.deleteProductVariation(productId, variation.id)
            );

            await Promise.all(deletePromises);

            loadProductVariations();
            setDeleteVariationsDialog(false);
            setSelectedVariations([]);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Variations Deleted',
                life: 3000
            });
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to delete product variations: ${error.message || 'Unknown error'}`,
                life: 3000
            });
        }
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
        _variation.status = e.value as CommonStatus;
        setProductVariation(_variation);
    };

    const onDefaultChange = (e: any) => {
        let _variation = { ...productVariation };
        _variation.isDefault = e.checked;
        setProductVariation(_variation);
    };

    const onAttributeValueChange = (attributeId: number, valueId: number) => {
        console.log(`VariationPage - Changing attribute ${attributeId} to value ${valueId}`);
        console.log('Current productVariation:', productVariation);

        let _variation = { ...productVariation };

        // If attributeValues doesn't exist, initialize it
        if (!_variation.attributeValues) {
            console.log('Initializing empty attributeValues array');
            _variation.attributeValues = [];
        }

        // Ensure productAttributes is defined and has values
        if (!productAttributes || productAttributes.length === 0) {
            console.warn('productAttributes is empty or undefined');
            // Still add the value even without the full attribute info
            _variation.attributeValues.push({
                id: 0,
                productVariationId: _variation.id || 0,
                attributeValueId: valueId
            });
            setProductVariation(_variation);
            return;
        }

        // Find the attribute value in the productAttributes to get its details
        const attribute = productAttributes.find(attr => attr.id === attributeId);
        const attributeValue = attribute?.values?.find(val => val.id === valueId);

        if (attributeValue) {
            console.log('Found attribute value in productAttributes:', attributeValue);
        } else {
            console.warn(`Could not find attribute value for attributeId=${attributeId}, valueId=${valueId}`);
        }

        // Find if we already have a value for this attribute
        // We need to check both ways: by attributeValue.attributeId and by matching attributeValueId to values in productAttributes
        const existingIndex = _variation.attributeValues.findIndex(av => {
            if (!av) return false;

            // Check if we have the attributeValue object with attributeId
            if (av.attributeValue && av.attributeValue.attributeId === attributeId) {
                return true;
            }

            // If not, try to find a match by checking if this value belongs to the current attribute
            // by looking through productAttributes
            for (const attr of productAttributes) {
                if (attr.id === attributeId) {
                    // This is the attribute we're looking for
                    // Check if the current attributeValue belongs to this attribute
                    if (attr.values) {
                        const matchingValue = attr.values.find(val => val.id === av.attributeValueId);
                        if (matchingValue) {
                            return true;
                        }
                    }
                }
            }

            return false;
        });

        console.log('Existing index for attribute:', existingIndex);

        if (existingIndex >= 0) {
            // Update existing value
            console.log('Updating existing attribute value');
            _variation.attributeValues[existingIndex].attributeValueId = valueId;

            // Also update the attributeValue object if it exists
            if (_variation.attributeValues[existingIndex].attributeValue) {
                if (attributeValue) {
                    _variation.attributeValues[existingIndex].attributeValue = {
                        ...attributeValue,
                        attributeId: attributeId,
                        id: attributeValue.id || 0
                    };
                }
            } else {
                // Create attributeValue object if it doesn't exist
                if (attributeValue) {
                    _variation.attributeValues[existingIndex].attributeValue = {
                        ...attributeValue,
                        attributeId: attributeId,
                        id: attributeValue.id || 0
                    };
                }
            }
        } else {
            // Add new value
            console.log('Adding new attribute value');
            if (attributeValue) {
                _variation.attributeValues.push({
                    id: 0,
                    productVariationId: _variation.id || 0,
                    attributeValueId: valueId,
                    attributeValue: {
                        ...attributeValue,
                        attributeId: attributeId,
                        id: attributeValue.id || 0
                    }
                });
            } else {
                _variation.attributeValues.push({
                    id: 0,
                    productVariationId: _variation.id || 0,
                    attributeValueId: valueId
                });
            }
        }

        console.log('Updated variation attributeValues:', _variation.attributeValues);
        setProductVariation(_variation);
    };

    const handleImageDelete = (image: {fileName: string, url: string}) => {
        if (!image) {
            console.warn('Attempted to delete undefined image');
            return;
        }

        setImagesToDelete([...imagesToDelete, image]);

        console.log('Adding image to delete:', image);
        console.log('Updated imagesToDelete:', [...imagesToDelete, image]);

        let _variation = { ...productVariation };
        if (_variation.images && Array.isArray(_variation.images)) {
            _variation.images = _variation.images.filter(img => {
                if (!img) return false;

                if (typeof img === 'string') {
                    return img !== image.url;
                } else if (typeof img === 'object') {
                    const imgPath = img.filePath || (img as any).url || '';
                    return imgPath !== image.url;
                }
                return true;
            });
            setProductVariation(_variation);
        } else {
            console.warn('Product variation images is not an array:', _variation.images);
            // Initialize images array if it doesn't exist
            _variation.images = [];
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
        { label: 'Active', value: CommonStatus.ACTIVE },
        { label: 'Inactive', value: CommonStatus.INACTIVE }
    ];

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h3>
                            {product ? `Product Management: ${product.title}` : 'Loading product information...'}
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
                        visible={variationDialog}
                        onHide={hideDialog}
                        productVariation={productVariation}
                        submitted={submitted}
                        statusOptions={statusOptions}
                        productAttributes={productAttributes}
                        onSave={saveProductVariation}
                        onInputChange={onInputChange}
                        onInputNumberChange={onInputNumberChange}
                        onStatusChange={onStatusChange}
                        onDefaultChange={onDefaultChange}
                        onAttributeValueChange={onAttributeValueChange}
                        onImageDelete={handleImageDelete}
                        fileUploadRef={fileUploadRef}
                        onAttributesChange={loadProductAttributes}
                        product={product}
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
