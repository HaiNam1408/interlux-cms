import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

const OrderNotFound: React.FC = () => {
    const router = useRouter();
    
    return (
        <Card>
            <div className="p-5 text-center">
                <i className="pi pi-exclamation-triangle text-5xl text-yellow-500 mb-3"></i>
                <h3>Order Not Found</h3>
                <p>The order you are looking for does not exist or has been removed.</p>
                <Button 
                    label="Go Back to Orders" 
                    icon="pi pi-arrow-left" 
                    className="mt-3" 
                    onClick={() => router.push('/order')} 
                />
            </div>
        </Card>
    );
};

export default OrderNotFound;
