import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Variation, VariationOption, VariationStatus } from '@/demo/service/VariationApiService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';

interface VariationFormProps {
    visible: boolean;
    onHide: () => void;
    variation: Variation;
    submitted: boolean;
    statusOptions: { label: string; value: string }[];
    onSave: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => void;
    onInputNumberChange: (e: any, name: string) => void;
    onStatusChange: (e: any) => void;
}

const VariationForm = (props: VariationFormProps) => {
    const {
        visible,
        onHide,
        variation,
        submitted,
        statusOptions,
        onSave,
        onInputChange,
        onInputNumberChange,
        onStatusChange
    } = props;

    const [options, setOptions] = useState<VariationOption[]>(variation.options || []);
    const [newOption, setNewOption] = useState<Partial<VariationOption>>({
        name: '',
        value: '',
        sort: 0,
        status: 'ACTIVE' as VariationStatus
    });
    const [optionSubmitted, setOptionSubmitted] = useState(false);

    // Update variation options
    useEffect(() => {
        // Update options when variation changes
        setOptions(variation.options || []);
    }, [variation]);

    // Handle option input change
    const onOptionInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const val = e.target.value;
        setNewOption(prev => ({ ...prev, [field]: val }));
    };

    // Handle option number input change
    const onOptionNumberChange = (e: any, field: string) => {
        const val = e.value || 0;
        setNewOption(prev => ({ ...prev, [field]: val }));
    };

    // Handle option status change
    const onOptionStatusChange = (e: any) => {
        setNewOption(prev => ({ ...prev, status: e.value }));
    };

    // Add new option
    const addOption = () => {
        setOptionSubmitted(true);

        if (newOption.name) {
            // Create a new option
            const option: VariationOption = {
                id: 0, // Will be assigned by the server
                name: newOption.name,
                slug: newOption.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                value: newOption.value || '',
                variationId: variation.id,
                sort: newOption.sort || 0,
                status: newOption.status as VariationStatus,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Add to options array
            const updatedOptions = [...options, option];
            setOptions(updatedOptions);

            // Update variation
            variation.options = updatedOptions;

            // Reset new option form
            setNewOption({
                name: '',
                value: '',
                sort: 0,
                status: 'ACTIVE' as VariationStatus
            });
            setOptionSubmitted(false);
        }
    };

    // Remove option
    const removeOption = (index: number) => {
        const updatedOptions = [...options];
        updatedOptions.splice(index, 1);
        setOptions(updatedOptions);

        // Update variation
        variation.options = updatedOptions;
    };

    const dialogFooter = (
        <div className="flex justify-content-end">
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={onHide}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                onClick={onSave}
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw', maxWidth: '800px' }}
            header={variation.id ? 'Edit Variation' : 'Create Variation'}
            modal
            className="p-fluid"
            footer={dialogFooter}
            maximizable
        >
            <div className="formgrid grid">
                <div className="field col-12">
                    <label htmlFor="name">Name</label>
                    <InputText
                        id="name"
                        value={variation.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !variation.name })}
                    />
                    {submitted && !variation.name && <small className="p-error">Name is required.</small>}
                </div>

                <div className="field col-12">
                    <label htmlFor="slug">Slug</label>
                    <InputText
                        id="slug"
                        value={variation.slug}
                        onChange={(e) => onInputChange(e, 'slug')}
                    />
                    <small className="text-muted">Leave empty to auto-generate from name</small>
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="sort">Sort Order</label>
                    <InputNumber
                        id="sort"
                        value={variation.sort}
                        onValueChange={(e) => onInputNumberChange(e, 'sort')}
                        mode="decimal"
                        showButtons
                        min={0}
                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="status">Status</label>
                    <Dropdown
                        id="status"
                        value={variation.status}
                        options={statusOptions}
                        onChange={onStatusChange}
                        placeholder="Select a Status"
                    />
                </div>

                {/* Variation Options Section */}
                <div className="field col-12">
                    <h4>Variation Options</h4>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="optionName">Option Name</label>
                            <InputText
                                id="optionName"
                                value={newOption.name}
                                onChange={(e) => onOptionInputChange(e, 'name')}
                                className={classNames({ 'p-invalid': optionSubmitted && !newOption.name })}
                            />
                            {optionSubmitted && !newOption.name && <small className="p-error">Option name is required.</small>}
                        </div>

                        <div className="field col-12 md:col-4">
                            <label htmlFor="optionValue">Option Value</label>
                            <InputText
                                id="optionValue"
                                value={newOption.value}
                                onChange={(e) => onOptionInputChange(e, 'value')}
                            />
                        </div>

                        <div className="field col-12 md:col-2">
                            <label htmlFor="optionSort">Sort Order</label>
                            <InputNumber
                                id="optionSort"
                                value={newOption.sort}
                                onValueChange={(e) => onOptionNumberChange(e, 'sort')}
                                showButtons
                                min={0}
                            />
                        </div>

                        <div className="field col-12 md:col-2">
                            <label htmlFor="optionStatus">Status</label>
                            <Dropdown
                                id="optionStatus"
                                value={newOption.status}
                                options={statusOptions}
                                onChange={onOptionStatusChange}
                                placeholder="Status"
                            />
                        </div>

                        <div className="field col-12 flex justify-content-end">
                            <Button
                                label="Add Option"
                                icon="pi pi-plus"
                                onClick={addOption}
                                className="p-button-success"
                            />
                        </div>
                    </div>

                    {/* Options Table */}
                    {options.length > 0 && (
                        <div className="field col-12">
                            <DataTable value={options} scrollable className="p-datatable-sm">
                                <Column field="name" header="Name" />
                                <Column field="value" header="Value" />
                                <Column field="sort" header="Sort Order" />
                                <Column field="status" header="Status" />
                                <Column
                                    body={(_, rowInfo) => (
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-danger p-button-sm"
                                            onClick={() => removeOption(rowInfo.rowIndex)}
                                        />
                                    )}
                                    style={{ width: '5rem', textAlign: 'center' }}
                                />
                            </DataTable>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default VariationForm;
