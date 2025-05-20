import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';
import { Product } from '@/types/product';

interface ProductModelUploadProps {
    product: Product;
    onDeleteModel: () => void;
}

const ProductModelUpload: React.FC<ProductModelUploadProps> = ({ product, onDeleteModel }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            // Check file type
            const validExtensions = ['.glb', '.gltf'];
            const validMimeTypes = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

            if (!validExtensions.includes(fileExtension) && !validMimeTypes.includes(file.type)) {
                setFileError('Invalid file type. Please upload a .glb or .gltf file.');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            if (file.size > 20 * 1024 * 1024) {
                setFileError('File is too large. Maximum size is 10MB.');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            setSelectedFile(file);
            setFileError(null);
        }
    };

    const handleDeleteClick = () => {
        if (window.confirm('Are you sure you want to delete this 3D model?')) {
            onDeleteModel();
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setSelectedFile(null);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
    };

    return (
        <div className="product-model-upload">
            <Card title="3D Model" className="mb-3">
                <div className="p-fluid">
                    {product.model ? (
                        <div className="existing-model mb-3">
                            <div className="flex align-items-center">
                                <i className="pi pi-cube mr-2" style={{ fontSize: '1.5rem' }}></i>
                                <div className="flex-grow-1">
                                    <div className="font-medium">{product.model.fileName}</div>
                                    <div className="text-sm text-500">
                                        Type: {product.model.type || 'Unknown'}
                                    </div>
                                </div>
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-danger p-button-text"
                                    onClick={handleDeleteClick}
                                    tooltip="Delete 3D Model"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="no-model mb-3">
                            <Message severity="info" text="No 3D model has been uploaded for this product." />
                        </div>
                    )}

                    <div className="model-upload">
                        <label htmlFor="model3d" className="block font-medium mb-2">
                            {product.model ? 'Replace 3D Model' : 'Upload 3D Model'}
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="model3d"
                            name="model3d"
                            accept=".glb,.gltf"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <div className="p-inputgroup">
                            <Button
                                label="Choose File"
                                icon="pi pi-upload"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-button-outlined"
                            />
                            <span className="p-inputgroup-addon">
                                {selectedFile ? selectedFile.name : 'No file chosen'}
                            </span>
                        </div>

                        {fileError && (
                            <small className="p-error block mt-2">{fileError}</small>
                        )}

                        {selectedFile && !fileError && (
                            <div className="mt-3">
                                <div className="flex justify-content-between mb-2">
                                    <span>File Size: {formatFileSize(selectedFile.size)}</span>
                                    <span>Type: {selectedFile.type || 'Unknown'}</span>
                                </div>
                                <ProgressBar value={100} showValue={false} />
                            </div>
                        )}

                        <small className="text-500 block mt-2">
                            Supported formats: .glb, .gltf (max 10MB)<br />
                            The 3D model will be displayed on the product detail page.
                        </small>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProductModelUpload;
