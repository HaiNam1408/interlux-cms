import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OrderItem } from '@/types/order';

interface OrderItemsTableProps {
    items: OrderItem[];
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
    console.log(items);
    const imageBodyTemplate = (item: OrderItem) => {
        return (
            <div className="flex align-items-center">
                {item.product.images && item.product.images.length > 0  ? (
                    <img 
                        src={item.product.images[0].filePath} 
                        alt={item.product.images[0].fileName} 
                        className="shadow-2 border-round" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                    />
                ) : (
                    <div 
                        className="flex align-items-center justify-content-center border-round bg-primary" 
                        style={{ width: '50px', height: '50px' }}
                    >
                        <i className="pi pi-box text-white text-xl"></i>
                    </div>
                )}
            </div>
        );
    };

    const productNameTemplate = (item: OrderItem) => {
        return (
            <div className="flex flex-column">
                <span className="font-medium">{item.product.title}</span>
                {item.variationOptions && <span className="text-sm text-500">{item.variationOptions}</span>}
            </div>
        );
    };

    const priceTemplate = (item: OrderItem) => {
        return `$${item.price.toFixed(2)}`;
    };

    const totalTemplate = (item: OrderItem) => {
        return `$${item.total.toFixed(2)}`;
    };

    return (
        <div>
            <h4>Order Items</h4>
            <DataTable value={items} responsiveLayout="scroll">
                <Column body={imageBodyTemplate} header="Image" style={{ width: '70px' }}></Column>
                <Column body={productNameTemplate} header="Product"></Column>
                <Column field="quantity" header="Quantity"></Column>
                <Column body={priceTemplate} header="Price"></Column>
                <Column body={totalTemplate} header="Total"></Column>
            </DataTable>
        </div>
    );
};

export default OrderItemsTable;
