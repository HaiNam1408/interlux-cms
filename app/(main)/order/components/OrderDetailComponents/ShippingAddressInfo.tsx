import React from 'react';
import { Order } from '@/types/order';

interface ShippingAddressInfoProps {
    shippingAddress: any;
}

const ShippingAddressInfo: React.FC<ShippingAddressInfoProps> = ({ shippingAddress }) => {
    // Handle different formats of shipping address
    const renderShippingAddress = () => {
        if (typeof shippingAddress === 'string') {
            return <p>{shippingAddress}</p>;
        }
        
        if (typeof shippingAddress === 'object' && shippingAddress !== null) {
            const { fullName, address, city, district, ward, zipCode, phone } = shippingAddress;
            return (
                <div className="flex flex-column gap-2">
                    {fullName && (
                        <div>
                            <span className="font-semibold">Full Name:</span> {fullName}
                        </div>
                    )}
                    {address && (
                        <div>
                            <span className="font-semibold">Address:</span> {address}
                        </div>
                    )}
                    {district && (
                        <div>
                            <span className="font-semibold">District:</span> {district}
                        </div>
                    )}
                    {ward && (
                        <div>
                            <span className="font-semibold">Ward:</span> {ward}
                        </div>
                    )}
                    {city && (
                        <div>
                            <span className="font-semibold">City:</span> {city}
                        </div>
                    )}
                    {zipCode && (
                        <div>
                            <span className="font-semibold">Zip Code:</span> {zipCode}
                        </div>
                    )}
                    {phone && (
                        <div>
                            <span className="font-semibold">Phone:</span> {phone}
                        </div>
                    )}
                </div>
            );
        }
        
        return <p>No shipping address provided</p>;
    };

    return (
        <div>
            <h4>Shipping Address</h4>
            {renderShippingAddress()}
        </div>
    );
};

export default ShippingAddressInfo;
