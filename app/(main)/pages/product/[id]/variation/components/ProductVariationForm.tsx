import React, { useRef, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { classNames } from 'primereact/utils';
import { FileUpload } from 'primereact/fileupload';
import { ProductVariation, Variation, VariationOption } from '@/demo/service/VariationApiService';

interface ProductVariationFormProps {
    visible: boolean;
    onHide: () => void;
    productVariation: ProductVariation;
    submitted: boolean;
    statusOptions: { label: string; value: string }[];
    variations: Variation[];
    variationOptions: Record<number, VariationOption[]>;
    onSave: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => void;
    onInputNumberChange: (e: any, name: string) => void;
    onStatusChange: (e: any) => void;
    onDefaultChange: (e: any) => void;
    onOptionsChange: (selectedOptions: { variationOptionId: number }[]) => void;
    onImageDelete: (image: {fileName: string, url: string}) => void;
    fileUploadRef: React.RefObject<FileUpload>;
}

const ProductVariationForm = (props: ProductVariationFormProps) => {
    const {
        visible,
        onHide,
        productVariation,
        submitted,
        statusOptions,
        variations,
        onSave,
        onInputChange,
        onInputNumberChange,
        onStatusChange,
        onDefaultChange,
        onOptionsChange,
        onImageDelete,
        fileUploadRef
    } = props;

    // Create a state to track selected option for each variation
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

    // Initialize selected options from productVariation
    useEffect(() => {
        const initialSelectedOptions: Record<number, number> = {};

        if (productVariation.options && productVariation.options.length > 0) {
            // For each option in the product variation
            productVariation.options.forEach(opt => {
                // Find the variation option to get its variation ID
                for (const variation of variations) {
                    const foundOption = variation.options.find(o => o.id === opt.variationOptionId);
                    if (foundOption) {
                        // Store the selected option ID for this variation
                        initialSelectedOptions[variation.id] = opt.variationOptionId;
                        break;
                    }
                }
            });
        }

        setSelectedOptions(initialSelectedOptions);
    }, [productVariation.options, variations]);

    // Check if we have any variations with options
    const hasOptions = variations.length > 0 && variations.some(v => v.options && v.options.length > 0);

    // Handle option selection
    const handleOptionChange = (variationId: number, optionId: number) => {
        // Update the selected option for this variation
        const newSelectedOptions = { ...selectedOptions, [variationId]: optionId };
        setSelectedOptions(newSelectedOptions);

        // Convert to array of options for the API
        const optionsArray = Object.entries(newSelectedOptions).map(([_, optionId]) => ({
            variationOptionId: Number(optionId)
        }));

        console.log('Selected options:', newSelectedOptions);
        console.log('Options array for API:', optionsArray);

        // Update the product variation
        onOptionsChange(optionsArray);
    };

    // Format images for display
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
                    <label htmlFor="sku">SKU</label>
                    <InputText id="sku" value={productVariation.sku} onChange={(e) => onInputChange(e, 'sku')} required autoFocus className={classNames({ 'p-invalid': submitted && !productVariation.sku })} />
                    {submitted && !productVariation.sku && <small className="p-error">SKU is required.</small>}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="price">Price</label>
                    <InputNumber id="price" value={productVariation.price} onValueChange={(e: any) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" min={0} />
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

                <div className="field col-12">
                    <label>Variation Options</label>
                    {hasOptions ? (
                        <div className={classNames('p-fluid', { 'p-invalid': submitted && Object.keys(selectedOptions).length === 0 })}>
                            {variations.map(variation => {
                                // Only render if variation has options
                                if (variation.options && variation.options.length > 0) {
                                    return (
                                        <div key={variation.id} className="field mb-4">
                                            <h5>{variation.name}</h5>
                                            <div className="grid">
                                                {variation.options.map(option => (
                                                    <div key={option.id} className="col-12 md:col-4 mb-2">
                                                        <div className="field-radiobutton">
                                                            <RadioButton
                                                                inputId={`option_${option.id}`}
                                                                name={`variation_${variation.id}`}
                                                                value={option.id}
                                                                onChange={() => handleOptionChange(variation.id, option.id)}
                                                                checked={selectedOptions[variation.id] === option.id}
                                                            />
                                                            <label htmlFor={`option_${option.id}`} className="ml-2">
                                                                {option.name}
                                                                {option.value && <span className="text-500 ml-1">({option.value})</span>}
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
                            {submitted && Object.keys(selectedOptions).length === 0 && (
                                <small className="p-error">Please select at least one option for each variation.</small>
                            )}
                        </div>
                    ) : (
                        <div className="p-3 border-1 border-yellow-500 bg-yellow-50 text-yellow-700 border-round mb-3">
                            <i className="pi pi-exclamation-triangle mr-2"></i>
                            <span>No variation options available. Please create variations and options first.</span>
                            <div className="mt-2">
                                <Button label="Go to Variations" icon="pi pi-external-link" className="p-button-sm p-button-text" onClick={() => window.open('/pages/variation', '_blank')} />
                            </div>
                        </div>
                    )}
                </div>

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
