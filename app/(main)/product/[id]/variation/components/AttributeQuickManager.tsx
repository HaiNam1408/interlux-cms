import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ProductAttribute, ProductAttributeValue, CommonStatus } from '@/types/product';
import { ProductAttributeApiService } from '@/service/ProductAttributeApiService';
import { Toast } from 'primereact/toast';

interface AttributeQuickManagerProps {
    visible: boolean;
    onHide: () => void;
    productId: number;
    onAttributesChange: () => void;
    toast: React.RefObject<Toast>;
}

const AttributeQuickManager = (props: AttributeQuickManagerProps) => {
    const { visible, onHide, productId, onAttributesChange, toast } = props;

    // State for attributes and their values
    const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
    const [selectedAttribute, setSelectedAttribute] = useState<ProductAttribute | null>(null);
    const [attributeValues, setAttributeValues] = useState<ProductAttributeValue[]>([]);
    const [newAttributeName, setNewAttributeName] = useState('');
    const [newValueName, setNewValueName] = useState('');
    const [newValueValue, setNewValueValue] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            loadAttributes();
        }
    }, [visible, productId]);

    useEffect(() => {
        if (selectedAttribute) {
            loadAttributeValues(selectedAttribute.id);
        } else {
            setAttributeValues([]);
        }
    }, [selectedAttribute]);

    const loadAttributes = async () => {
        try {
            setLoading(true);

            const response = await ProductAttributeApiService.getProductAttributes(productId);

            if (response && response.data) {
                setAttributes(response.data);

                if (response.data.length > 0 && !selectedAttribute) {
                    setSelectedAttribute(response.data[0]);
                }
            } else {
                setAttributes([]);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            setAttributes([]);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load attributes',
                life: 3000
            });
        }
    };

    const loadAttributeValues = async (attributeId: number) => {
        try {
            setLoading(true);
            const response = await ProductAttributeApiService.getAttributeValues(productId, attributeId);

            if (response && response.data) {
                setAttributeValues(response.data);
            } else {
                setAttributeValues([]);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            setAttributeValues([]);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load attribute values',
                life: 3000
            });
        }
    };

    const addAttribute = async () => {
        if (!newAttributeName.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Attribute name is required',
                life: 3000
            });
            return;
        }

        try {
            setLoading(true);
            await ProductAttributeApiService.createProductAttribute(productId, {
                name: newAttributeName,
                status: CommonStatus.ACTIVE
            });

            setNewAttributeName('');
            loadAttributes();
            onAttributesChange();

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Attribute added successfully',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add attribute',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const addAttributeValue = async () => {
        if (!selectedAttribute) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select an attribute first',
                life: 3000
            });
            return;
        }

        if (!newValueName.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Value name is required',
                life: 3000
            });
            return;
        }

        try {
            setLoading(true);
            await ProductAttributeApiService.createAttributeValue(
                productId,
                selectedAttribute.id,
                {
                    name: newValueName,
                    value: newValueValue,
                    status: CommonStatus.ACTIVE
                }
            );

            setNewValueName('');
            setNewValueValue('');
            loadAttributeValues(selectedAttribute.id);
            onAttributesChange();

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Value added successfully',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add value',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteAttributeValue = async (valueId: number) => {
        if (!selectedAttribute) return;

        try {
            setLoading(true);
            await ProductAttributeApiService.deleteAttributeValue(
                productId,
                selectedAttribute.id,
                valueId
            );

            loadAttributeValues(selectedAttribute.id);
            onAttributesChange();

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Value deleted successfully',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete value',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteAttribute = async (attributeId: number) => {
        try {
            setLoading(true);
            await ProductAttributeApiService.deleteProductAttribute(productId, attributeId);

            if (selectedAttribute && selectedAttribute.id === attributeId) {
                setSelectedAttribute(null);
            }

            loadAttributes();
            onAttributesChange();

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Attribute deleted successfully',
                life: 3000
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete attribute',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <div>
            <Button label="Close" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        </div>
    );

    return (
        <Dialog
            header="Manage Attributes"
            visible={visible}
            style={{ width: '80vw', maxWidth: '800px' }}
            onHide={onHide}
            footer={footer}
            modal
        >
            <div className="grid">
                {/* Add new attribute */}
                <div className="col-12 mb-4">
                    <div className="p-inputgroup">
                        <InputText
                            placeholder="New attribute name"
                            value={newAttributeName}
                            onChange={(e) => setNewAttributeName(e.target.value)}
                        />
                        <Button
                            label="Add Attribute"
                            icon="pi pi-plus"
                            onClick={addAttribute}
                            disabled={loading || !newAttributeName.trim()}
                        />
                    </div>
                </div>

                {/* Select attribute */}
                <div className="col-12 mb-4">
                    <Dropdown
                        value={selectedAttribute}
                        options={attributes}
                        onChange={(e) => setSelectedAttribute(e.value)}
                        optionLabel="name"
                        placeholder="Select an attribute"
                        className="w-full"
                        disabled={loading || attributes.length === 0}
                    />
                </div>

                {/* Add new attribute value */}
                {selectedAttribute && (
                    <div className="col-12 mb-4">
                        <h5>Add value for: {selectedAttribute.name}</h5>
                        <div className="grid">
                            <div className="col-5">
                                <InputText
                                    placeholder="Name"
                                    value={newValueName}
                                    onChange={(e) => setNewValueName(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="col-5">
                                <InputText
                                    placeholder="Value (optional)"
                                    value={newValueValue}
                                    onChange={(e) => setNewValueValue(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="col-2">
                                <Button
                                    icon="pi pi-plus"
                                    onClick={addAttributeValue}
                                    disabled={loading || !newValueName.trim()}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Attribute values list */}
                {selectedAttribute && attributeValues.length > 0 && (
                    <div className="col-12">
                        <h5>Values for: {selectedAttribute.name}</h5>
                        <div className="grid">
                            {attributeValues.map(value => (
                                <div key={value.id} className="col-12 mb-2 flex align-items-center">
                                    <div className="flex-grow-1">
                                        <span className="font-bold">{value.name}</span>
                                        {value.value && <span className="ml-2 text-500">({value.value})</span>}
                                    </div>
                                    <Button
                                        icon="pi pi-trash"
                                        severity="danger"
                                        outlined
                                        size="small"
                                        onClick={() => deleteAttributeValue(value.id)}
                                        disabled={loading}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Attributes list */}
                <div className="col-12 mt-4">
                    <h5>All Attributes</h5>
                    <div className="grid">
                        {attributes.map(attr => (
                            <div key={attr.id} className="col-12 mb-2 flex align-items-center">
                                <div className="flex-grow-1">
                                    <span className="font-bold">{attr.name}</span>
                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    outlined
                                    size="small"
                                    onClick={() => deleteAttribute(attr.id)}
                                    disabled={loading}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default AttributeQuickManager;
