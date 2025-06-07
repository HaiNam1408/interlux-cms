import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { classNames } from 'primereact/utils';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { ProductVariation, ProductAttribute } from '@/types/product';
import { AttributeQuickManager } from '.';

interface ProductVariationFormProps {
    visible: boolean;
    onHide: () => void;
    productVariation: ProductVariation;
    submitted: boolean;
    statusOptions: { label: string; value: string }[];
    productAttributes: ProductAttribute[];
    onSave: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => void;
    onInputNumberChange: (e: any, name: string) => void;
    onStatusChange: (e: any) => void;
    onDefaultChange: (e: any) => void;
    onAttributeValueChange: (attributeId: number, valueId: number) => void;
    onImageDelete: (image: { fileName: string; url: string }) => void;
    fileUploadRef: React.RefObject<FileUpload>;
    onAttributesChange?: () => void; // Optional callback when attributes change
    product?: any; // Product information for generating SKU
}

const ProductVariationForm = (props: ProductVariationFormProps) => {
    const { visible, onHide, productVariation, submitted, statusOptions, productAttributes, onSave, onInputChange, onInputNumberChange, onStatusChange, onDefaultChange, onAttributeValueChange, onImageDelete, fileUploadRef, product } = props;

    const [selectedAttributeValues, setSelectedAttributeValues] = useState<Record<number, number>>({});
    const [attributeManagerVisible, setAttributeManagerVisible] = useState(false);
    const toast = React.useRef<Toast>(null);

    const generateSku = () => {
        if (!product) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Product information not available',
                life: 3000
            });
            return;
        }

        let productPrefix = 'PRD';
        if (product.title) {
            const cleanTitle = product.title.replace(/[^a-zA-Z0-9]/g, '');
            productPrefix = cleanTitle.substring(0, 3).toUpperCase();
        }

        // Add attribute values
        let attributeParts = '';
        if (Object.keys(selectedAttributeValues).length > 0) {
            const sortedAttributes = Object.keys(selectedAttributeValues)
                .map(Number)
                .sort((a, b) => a - b);

            for (const attrId of sortedAttributes) {
                const valueId = selectedAttributeValues[attrId];
                const attribute = productAttributes.find((attr) => attr.id === attrId);
                const value = attribute?.values?.find((val) => val.id === valueId);

                if (value) {
                    const cleanValue = value.name.replace(/[^a-zA-Z0-9]/g, '');
                    attributeParts += cleanValue.substring(0, 2).toUpperCase();
                }
            }
        }

        const timestamp = new Date().getTime().toString().slice(-4);
        const sku = `${productPrefix}-${attributeParts}-${timestamp}`;
        const e = {
            target: { value: sku }
        } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(e, 'sku');

        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'SKU generated successfully',
            life: 3000
        });
    };

    useEffect(() => {
        const initialSelectedValues: Record<number, number> = {};

        if (productVariation.attributeValues && productVariation.attributeValues.length > 0) {
            productVariation.attributeValues.forEach((av) => {
                if (av.attributeValue && av.attributeValue.attributeId) {
                    initialSelectedValues[av.attributeValue.attributeId] = av.attributeValueId;
                } else {
                    for (const attr of productAttributes) {
                        if (attr.values) {
                            const matchingValue = attr.values.find((val) => val.id === av.attributeValueId);
                            if (matchingValue) {
                                initialSelectedValues[attr.id] = av.attributeValueId;
                                break;
                            }
                        }
                    }
                }
            });
        }

        setSelectedAttributeValues(initialSelectedValues);
    }, [productVariation, productAttributes]);

    // Check if we have any attributes with values
    const hasAttributes = productAttributes && productAttributes.length > 0 && productAttributes.some((attr) => attr.values && attr.values.length > 0);

    // Handle attribute value selection
    const handleAttributeValueChange = (attributeId: number, valueId: number) => {
        // Update the selected value for this attribute
        const newSelectedValues = { ...selectedAttributeValues, [attributeId]: valueId };
        setSelectedAttributeValues(newSelectedValues);
        onAttributeValueChange(attributeId, valueId);
    };

    const getImageUrl = (image: any) => {
        if (typeof image === 'string') {
            return image;
        } else if (image && typeof image === 'object') {
            return image.filePath || image.url || '';
        }
        return '';
    };

    const getImageFileName = (image: any) => {
        if (typeof image === 'string') {
            const parts = image.split('/');
            return parts[parts.length - 1];
        } else if (image && typeof image === 'object') {
            return image.fileName || '';
        }
        return '';
    };

    const dialogFooter = (
        <div className="flex justify-content-end">
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onHide} />
            <Button label="Save" icon="pi pi-check" onClick={onSave} />
        </div>
    );

    return (
        <Dialog visible={visible} onHide={onHide} style={{ width: '80vw', maxWidth: '1200px' }} header={productVariation.id ? 'Edit Product Variation' : 'Create Product Variation'} modal className="p-fluid" footer={dialogFooter} maximizable>
            <div className="formgrid grid">
                <div className="field col-12">
                    <div className="flex justify-content-between align-items-center">
                        <label htmlFor="sku">SKU</label>
                        <Button type="button" label="Generate SKU" icon="pi pi-refresh" size="small" outlined onClick={generateSku} className="w-auto mb-2" />
                    </div>
                    <InputText id="sku" value={productVariation.sku} onChange={(e) => onInputChange(e, 'sku')} required autoFocus className={classNames({ 'p-invalid': submitted && !productVariation.sku })} />
                    {submitted && !productVariation.sku && <small className="p-error">SKU is required.</small>}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="price">Price</label>
                    <InputNumber id="price" value={productVariation.price} onValueChange={(e: any) => onInputNumberChange(e, 'price')} mode="currency" currency="VND" locale="vi-VN" min={0} />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="percentOff">Discount (%)</label>
                    <InputNumber id="percentOff" value={productVariation.percentOff} onValueChange={(e: any) => onInputNumberChange(e, 'percentOff')} suffix="%" min={0} max={100} />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="inventory">Inventory</label>
                    <InputNumber id="inventory" value={productVariation.inventory} onValueChange={(e: any) => onInputNumberChange(e, 'inventory')} min={0} />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="status">Status</label>
                    <Dropdown id="status" value={productVariation.status} options={statusOptions} onChange={onStatusChange} placeholder="Select a Status" />
                </div>

                <div className="field col-12 md:col-6 flex align-items-center">
                    <Checkbox inputId="isDefault" checked={productVariation.isDefault} onChange={(e: any) => onDefaultChange(e)} />
                    <label htmlFor="isDefault" className="ml-2">
                        Set as Default Variation
                    </label>
                </div>

                {!productVariation.id ? (
                    <div className="field col-12">
                        <div className="flex justify-content-between align-items-center">
                            <label>Attribute Values</label>
                            <Button className="w-auto" label="Manage Attributes" icon="pi pi-cog" size="small" outlined onClick={() => setAttributeManagerVisible(true)} />
                        </div>
                        {hasAttributes ? (
                            <div className={classNames('p-fluid', { 'p-invalid': submitted && Object.keys(selectedAttributeValues).length === 0 })}>
                                {productAttributes.map((attribute) => {
                                    // Only render if attribute has values
                                    if (attribute.values && attribute.values.length > 0) {
                                        return (
                                            <div key={attribute.id} className="field mb-4">
                                                <h5>{attribute.name}</h5>
                                                <div className="grid">
                                                    {attribute.values.map((attrValue) => (
                                                        <div key={attrValue.id} className="col-12 md:col-4 mb-2">
                                                            <div className="field-radiobutton">
                                                                <RadioButton
                                                                    inputId={`value_${attrValue.id}`}
                                                                    name={`attribute_${attribute.id}`}
                                                                    value={attrValue.id}
                                                                    onChange={() => {
                                                                        handleAttributeValueChange(attribute.id, attrValue.id);
                                                                    }}
                                                                    checked={selectedAttributeValues[attribute.id] === attrValue.id}
                                                                />
                                                                <label htmlFor={`value_${attrValue.id}`} className="ml-2">
                                                                    {attrValue.name}
                                                                    {attrValue.value && <span className="text-500 ml-1">({attrValue.value})</span>}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                                {submitted && Object.keys(selectedAttributeValues).length === 0 && <small className="p-error">Please select at least one option for each attribute.</small>}
                            </div>
                        ) : (
                            <div className="p-3 border-1 border-yellow-500 bg-yellow-50 text-yellow-700 border-round mb-3">
                                <i className="pi pi-exclamation-triangle mr-2"></i>
                                <span>No attributes available. Click &quot;Manage Attributes&quot; to add attributes and values.</span>
                            </div>
                        )}

                        {/* Attribute Quick Manager Dialog */}
                        <Toast ref={toast} />
                        <AttributeQuickManager
                            visible={attributeManagerVisible}
                            onHide={() => setAttributeManagerVisible(false)}
                            productId={productVariation.productId}
                            onAttributesChange={() => {
                                if (props.onAttributesChange) {
                                    props.onAttributesChange();
                                }
                            }}
                            toast={toast}
                        />
                    </div>
                ) : null}

                <div className="field col-12">
                    <label htmlFor="images">Images</label>
                    <FileUpload
                        ref={fileUploadRef}
                        name="images"
                        multiple
                        accept="image/*"
                        maxFileSize={1000000}
                        auto={true}
                        mode="advanced"
                        chooseLabel="Choose Images"
                        cancelLabel="Cancel"
                        uploadLabel=" "
                        className="hide-upload-button"
                        customUpload={true}
                        emptyTemplate={<p className="m-0">Drop images here to upload.</p>}
                    />
                </div>

                {productVariation.images && productVariation.images.length > 0 && (
                    <div className="field col-12">
                        <label>Current Images</label>
                        <div className="grid">
                            {productVariation.images.map((image, i) => (
                                <div key={i} className="col-3 mb-3 relative">
                                    <img src={getImageUrl(image)} alt={`Product Variation ${i}`} className="w-full shadow-2 border-round" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-rounded p-button-danger absolute"
                                        style={{ top: '0.5rem', right: '0.5rem' }}
                                        onClick={() =>
                                            onImageDelete({
                                                fileName: getImageFileName(image),
                                                url: getImageUrl(image)
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default ProductVariationForm;
