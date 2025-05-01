import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Variation } from '@/demo/service/VariationApiService';

interface VariationFormProps {
    visible: boolean;
    onHide: () => void;
    variation: Variation;
    submitted: boolean;
    statusOptions: { label: string; value: string }[];
    onSave: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => void;
    onInputNumberChange: (e: { value: number | null }, name: string) => void;
    onStatusChange: (e: { value: string }) => void;
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

    return (
        <Sidebar visible={visible} onHide={onHide} className="p-sidebar-lg">
            <div className="p-fluid">
                <div className="field">
                    <h3>{variation.id ? 'Edit Variation' : 'Create Variation'}</h3>
                </div>

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
                </div>

                <div className="flex justify-content-end mt-4">
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
            </div>
        </Sidebar>
    );
};

export default VariationForm;
