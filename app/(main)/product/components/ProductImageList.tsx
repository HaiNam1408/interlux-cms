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
                    let imagePath = image.filePath;
                    let fileName = image.fileName;

                    if (!imagePath || !fileName) return null;

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
