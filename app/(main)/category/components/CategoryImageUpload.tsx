import React, { useEffect, useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Category } from '@/types/category';

interface CategoryImageUploadProps {
    category: Category;
    onImageUpload: (file: File) => void;
    onImageDelete: () => void;
    selectedImage?: File | null;
}

const CategoryImageUpload: React.FC<CategoryImageUploadProps> = ({
    category,
    onImageUpload,
    onImageDelete,
    selectedImage
}) => {
    const fileUploadRef = useRef<FileUpload>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Handle existing image from category
    useEffect(() => {
        if (category.image && category.image.filePath) {
            setPreviewUrl(category.image.filePath);
        } else {
            setPreviewUrl('');
        }
    }, [category.id, category.image]);

    // Handle newly selected image preview
    useEffect(() => {
        if (selectedImage) {
            const objectUrl = URL.createObjectURL(selectedImage);
            setPreviewUrl(objectUrl);

            // Free memory when this component is unmounted
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [selectedImage]);

    const onSelect = (e: any) => {
        if (e.files && e.files.length > 0) {
            onImageUpload(e.files[0]);
            // Clear the file input after selection
            if (fileUploadRef.current) {
                fileUploadRef.current.clear();
            }
        }
    };

    return (
        <div className="field">
            <label htmlFor="image">Image</label>
            <div className="flex flex-column">
                <FileUpload
                    ref={fileUploadRef}
                    name="image"
                    accept="image/*"
                    maxFileSize={1000000}
                    mode="basic"
                    auto
                    chooseLabel="Choose Image"
                    className="mb-2"
                    customUpload={true}
                    onSelect={onSelect}
                />

                {previewUrl && (
                    <div className="mt-2 flex flex-column">
                        <img
                            src={previewUrl}
                            alt={category.name || "Preview"}
                            className="w-12rem mb-2 object-fit-cover border-round"
                        />
                        <Button
                            icon="pi pi-trash"
                            className="p-button-danger p-button-sm w-8rem"
                            onClick={() => {
                                onImageDelete();
                                setPreviewUrl('');
                            }}
                            label="Remove"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryImageUpload;
