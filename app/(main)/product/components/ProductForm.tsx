import React, { useRef, useEffect, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { FileUpload } from 'primereact/fileupload';
import { classNames } from 'primereact/utils';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import ProductImageList from './ProductImageList';
import ProductModelUpload from './ProductModelUpload';
import AttributeEditor from './AttributeEditor';
import { useRouter } from 'next/navigation';
import 'quill/dist/quill.snow.css';

interface ProductFormProps {
    visible: boolean;
    onHide: () => void;
    product: Product;
    submitted: boolean;
    categories: Category[];
    statusOptions: { label: string; value: string }[];
    onSave: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => void;
    onInputNumberChange: (e: InputNumberValueChangeEvent, name: string) => void;
    onEditorChange: (e: any, name: string) => void;
    onAttributesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCategoryChange: (e: { value: number }) => void;
    onStatusChange: (e: { value: string }) => void;
    onImageDelete: (image: { fileName: string, url: string }) => void;
    onDeleteModel: () => void;
    fileUploadRef: React.RefObject<FileUpload>;
}

const ProductForm = (props: ProductFormProps) => {
    const {
        visible,
        onHide,
        product,
        submitted,
        categories,
        statusOptions,
        onSave,
        onInputChange,
        onInputNumberChange,
        onEditorChange,
        onAttributesChange,
        onCategoryChange,
        onStatusChange,
        onImageDelete,
        onDeleteModel,
        fileUploadRef
    } = props;

    const editorRef = useRef<any>(null);

    return (
        <Sidebar visible={visible} onHide={onHide} fullScreen>
            <div className="p-fluid">
                <div className="flex justify-content-between align-items-center mb-4">
                    <h2 className="m-0">{product.id ? 'Edit Product' : 'New Product'}</h2>
                </div>

                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="title">Title</label>
                            <InputText
                                id="title"
                                value={product.title}
                                onChange={(e) => onInputChange(e, 'title')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.title
                                })}
                            />
                            {submitted && !product.title && <small className="p-invalid">Title is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="slug">Slug</label>
                            <InputText id="slug" value={product.slug} onChange={(e) => onInputChange(e, 'slug')} />
                            <small className="text-muted">Leave empty to auto-generate from title</small>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="VND" locale="vi-VN" />
                            </div>
                            <div className="field col">
                                <label htmlFor="percentOff">Discount (%)</label>
                                <InputNumber id="percentOff" value={product.percentOff} onValueChange={(e) => onInputNumberChange(e, 'percentOff')} suffix="%" />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="category">Category</label>
                                <Dropdown id="category" value={product.categoryId} options={categories.map((c) => ({ label: c.name, value: c.id }))} onChange={onCategoryChange} placeholder="Select a Category" optionLabel="label" />
                            </div>
                            <div className="field col">
                                <label htmlFor="status">Status</label>
                                <Dropdown id="status" value={product.status} options={statusOptions} onChange={onStatusChange} placeholder="Select Status" optionLabel="label" />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="sort">Sort Order</label>
                            <InputNumber id="sort" value={product.sort} onValueChange={(e) => onInputNumberChange(e, 'sort')} />
                        </div>

                        <div className="field">
                            <label htmlFor="attributes">Attributes</label>
                            {/* Debug info */}
                            <div className="mb-2">
                                <small className="text-muted">
                                    Attributes: {product.attributes ? 'Available' : 'Not available'} | Type: {typeof product.attributes} | Keys: {product.attributes ? Object.keys(product.attributes).join(', ') : 'None'}
                                </small>
                            </div>

                            <AttributeEditor
                                attributes={product.attributes || {}}
                                onChange={(newAttributes) => {
                                    // Use the onAttributesChange prop to update the product
                                    const e = {
                                        target: {
                                            value: JSON.stringify(newAttributes)
                                        }
                                    } as React.ChangeEvent<HTMLTextAreaElement>;
                                    onAttributesChange(e);
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <div className="quill-editor-container">
                                <Editor
                                    key={product.id ?? 'new'}
                                    ref={editorRef}
                                    id="description-editor"
                                    value={product.description}
                                    onTextChange={(e) => {
                                        onEditorChange(e.htmlValue, 'description');
                                    }}
                                    style={{ height: '320px' }}
                                    className="editor-with-content"
                                    placeholder="Enter product description here..."
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="images">Images</label>
                            <FileUpload
                                ref={fileUploadRef}
                                name="images"
                                multiple
                                accept="image/*"
                                maxFileSize={10000000}
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

                        <ProductImageList product={product} onImageDelete={onImageDelete} />

                        <div className="field">
                            <ProductModelUpload
                                product={product}
                                onDeleteModel={onDeleteModel}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-content-center my-3">
                    <Button label="Cancel" icon="pi pi-times" className="p-button-text w-8rem mr-2" onClick={onHide} />
                    <Button label="Save" icon="pi pi-check" className="w-8rem" onClick={onSave} />
                </div>
            </div>
        </Sidebar>
    );
};

export default ProductForm;
