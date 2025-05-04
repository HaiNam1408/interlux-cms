import React from 'react';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';

const OrderDetailSkeleton: React.FC = () => {
    return (
        <div className="grid">
            <div className="col-12 lg:col-8">
                <Card>
                    <Skeleton width="60%" height="2rem" className="mb-3"></Skeleton>
                    <Skeleton width="100%" height="10rem"></Skeleton>
                </Card>
            </div>
            <div className="col-12 lg:col-4">
                <Card>
                    <Skeleton width="40%" height="2rem" className="mb-3"></Skeleton>
                    <Skeleton width="100%" height="15rem"></Skeleton>
                </Card>
            </div>
        </div>
    );
};

export default OrderDetailSkeleton;
