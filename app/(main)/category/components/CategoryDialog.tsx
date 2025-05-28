import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Category } from '@/types/category';
import CategoryImageUpload from './CategoryImageUpload';

interface CategoryDialogProps {
    visible: boolean;
    category: Category;
    parentCategories: any[];
    submitted: boolean;
    onHide: () => void;
    onSave: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => void;
    onInputNumberChange: (e: InputNumberValueChangeEvent, name: string) => void;
    onParentChange: (e: { value: number | null }) => void;
    onImageUpload: (file: File) => void;
    onImageDelete: () => void;
    selectedImage?: File | null;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
    visible,
    category,
    parentCategories,
    submitted,
    onHide,
    onSave,
    onInputChange,
    onInputNumberChange,
    onParentChange,
    onImageUpload,
    onImageDelete,
    selectedImage
}) => {
    const categoryDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
            <Button label="Save" icon="pi pi-check" text onClick={onSave} />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Category Details"
            modal
            className="p-fluid"
            footer={categoryDialogFooter}
            onHide={onHide}
        >
            <div className="field">
                <label htmlFor="name">Name*</label>
                <InputText
                    id="name"
                    value={category.name}
                    onChange={(e) => onInputChange(e, 'name')}
                    required
                    autoFocus
                    className={classNames({
                        'p-invalid': submitted && !category.name
                    })}
                />
                {submitted && !category.name && <small className="p-invalid">Name is required.</small>}
            </div>

            <div className="field">
                <label htmlFor="slug">Slug</label>
                <InputText
                    id="slug"
                    value={category.slug}
                    onChange={(e) => onInputChange(e, 'slug')}
                />
                <small className="text-muted">Leave empty to auto-generate from name</small>
            </div>

            <div className="field">
                <label htmlFor="parent">Parent Category</label>
                <Dropdown
                    id="parent"
                    value={category.parentId}
                    options={parentCategories.map((c) => ({ label: c.name, value: c.id })) || []}
                    onChange={onParentChange}
                    placeholder="Select a Parent Category"
                    optionLabel="label"
                    showClear
                />
            </div>

            <div className="field">
                <label htmlFor="sort">Sort Order</label>
                <InputNumber
                    id="sort"
                    value={category.sort}
                    onValueChange={(e) => onInputNumberChange(e, 'sort')}
                />
            </div>

            <CategoryImageUpload
                category={category}
                onImageUpload={onImageUpload}
                onImageDelete={onImageDelete}
                selectedImage={selectedImage}
            />
        </Dialog>
    );
};

export default CategoryDialog;
