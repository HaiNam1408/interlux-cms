import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Category } from '@/types/category';

interface DeleteDialogsProps {
    deleteCategoryDialog: boolean;
    deleteCategoriesDialog: boolean;
    category: Category;
    hideDeleteCategoryDialog: () => void;
    hideDeleteCategoriesDialog: () => void;
    deleteCategory: () => void;
    deleteSelectedCategories: () => void;
}

const DeleteDialogs: React.FC<DeleteDialogsProps> = ({
    deleteCategoryDialog,
    deleteCategoriesDialog,
    category,
    hideDeleteCategoryDialog,
    hideDeleteCategoriesDialog,
    deleteCategory,
    deleteSelectedCategories
}) => {
    const deleteCategoryDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCategoryDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteCategory} />
        </>
    );

    const deleteCategoriesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCategoriesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedCategories} />
        </>
    );

    return (
        <>
            <Dialog 
                visible={deleteCategoryDialog} 
                style={{ width: '450px' }} 
                header="Confirm" 
                modal 
                footer={deleteCategoryDialogFooter} 
                onHide={hideDeleteCategoryDialog}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {category && (
                        <span>
                            Are you sure you want to delete <b>{category.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog 
                visible={deleteCategoriesDialog} 
                style={{ width: '450px' }} 
                header="Confirm" 
                modal 
                footer={deleteCategoriesDialogFooter} 
                onHide={hideDeleteCategoriesDialog}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>Are you sure you want to delete the selected categories?</span>
                </div>
            </Dialog>
        </>
    );
};

export default DeleteDialogs;
