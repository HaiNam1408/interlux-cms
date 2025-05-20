import React from 'react';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Category } from '@/types/category';

interface CategoryToolbarProps {
    selectedCategories: Category[];
    openNew: () => void;
    confirmDeleteSelected: () => void;
    exportCSV: () => void;
}

const CategoryToolbar: React.FC<CategoryToolbarProps> = ({
    selectedCategories,
    openNew,
    confirmDeleteSelected,
    exportCSV
}) => {
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button 
                        label="New" 
                        icon="pi pi-plus" 
                        severity="success" 
                        className="mr-2" 
                        onClick={openNew} 
                    />
                    <Button 
                        label="Delete" 
                        icon="pi pi-trash" 
                        severity="danger" 
                        onClick={confirmDeleteSelected} 
                        disabled={!selectedCategories || selectedCategories.length === 0} 
                    />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button 
                    label="Export" 
                    icon="pi pi-upload" 
                    severity="help" 
                    onClick={exportCSV} 
                />
            </React.Fragment>
        );
    };

    return (
        <Toolbar 
            className="mb-3" 
            left={leftToolbarTemplate} 
            right={rightToolbarTemplate}
        />
    );
};

export default CategoryToolbar;
