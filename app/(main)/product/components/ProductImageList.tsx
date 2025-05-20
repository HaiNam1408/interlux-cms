import React from 'react';
import { Button } from 'primereact/button';
import { Product } from '@/types/product';

interface ProductImageListProps {
    product: Product;
    onImageDelete: (image: { fileName: string, url: string }) => void;
}

const ProductImageList = ({ product, onImageDelete }: ProductImageListProps) => {
    if (!product.id || !product.images || !Array.isArray(product.images) || product.images.length === 0) {
        return null;
    }

    return (
        <div className="field">
            <label>Current Images</label>
            <div className="grid">
                {product.images.map((image, index) => {
                    // Handle different image formats
                    let imagePath = '';
                    let fileName = '';

                    if (typeof image === 'string') {
                        imagePath = image;
                        fileName = `image${index}.jpg`;
                    } else if (image && typeof image === 'object') {
                        // Handle API response format with filePath
                        if (image.filePath) {
                            imagePath = image.filePath;
                            fileName = image.fileName || `image${index}.jpg`;
                        }
                        // Handle other object formats
                        else {
                            imagePath = (image as any).url || '';
                            fileName = (image as any).name || `image${index}.jpg`;
                        }
                    }

                    if (!imagePath) return null;

                    return (
                        <div key={index} className="col-6 relative">
                            <img src={imagePath} alt={`Product ${index}`} className="w-full shadow-2" />
                            <Button
                                icon="pi pi-times"
                                className="p-button-rounded p-button-danger absolute top-0 right-0"
                                onClick={() => onImageDelete({ fileName: fileName, url: imagePath })}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductImageList;
