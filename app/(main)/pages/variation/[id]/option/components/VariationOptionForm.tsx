import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { VariationOption } from '@/demo/service/VariationApiService';

interface VariationOptionFormProps {
    visible: boolean;
    onHide: () => void;
    option: VariationOption;
    submitted: boolean;
    statusOptions: { label: string; value: string }[];
    onSave: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => void;
    onInputNumberChange: (e: any, name: string) => void;
    onStatusChange: (e: any) => void;
}

const VariationOptionForm = (props: VariationOptionFormProps) => {
    const {
        visible,
        onHide,
        option,
        submitted,
        statusOptions,
        onSave,
        onInputChange,
        onInputNumberChange,
        onStatusChange
    } = props;

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
            header={option.id ? 'Edit Variation Option' : 'Create Variation Option'}
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
                        value={option.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !option.name })}
                    />
                    {submitted && !option.name && <small className="p-error">Name is required.</small>}
                </div>

                <div className="field col-12">
                    <label htmlFor="slug">Slug</label>
                    <InputText
                        id="slug"
                        value={option.slug}
                        onChange={(e) => onInputChange(e, 'slug')}
                    />
                    <small className="text-muted">Leave empty to auto-generate from name</small>
                </div>

                <div className="field col-12">
                    <label htmlFor="value">Value</label>
                    <InputText
                        id="value"
                        value={option.value || ''}
                        onChange={(e) => onInputChange(e, 'value')}
                    />
                    <small className="text-muted">Optional value for this option (e.g. color code for a color)</small>
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="sort">Sort Order</label>
                    <InputNumber
                        id="sort"
                        value={option.sort}
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
                        value={option.status}
                        options={statusOptions}
                        onChange={onStatusChange}
                        placeholder="Select a Status"
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default VariationOptionForm;
