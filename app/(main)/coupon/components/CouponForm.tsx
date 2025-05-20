'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Coupon, CouponType, CreateCouponDto, UpdateCouponDto } from '@/types/coupon';
import { CommonStatus } from '@/types/product';

interface CouponFormProps {
    visible: boolean;
    coupon: Coupon | null;
    onHide: () => void;
    onSave: (data: CreateCouponDto | UpdateCouponDto, isNew: boolean) => Promise<void>;
}

const CouponForm: React.FC<CouponFormProps> = ({ visible, coupon, onHide, onSave }) => {
    const isNew = !coupon?.id;
    const [submitted, setSubmitted] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const emptyCoupon = useMemo(() => ({
        code: '',
        type: CouponType.PERCENTAGE,
        value: 0,
        minPurchase: 0,
        maxUsage: 100,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        status: CommonStatus.ACTIVE
    } as CreateCouponDto), []);

    const [formData, setFormData] = useState<CreateCouponDto | UpdateCouponDto>(emptyCoupon);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (coupon) {
            setFormData({
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                minPurchase: coupon.minPurchase,
                maxUsage: coupon.maxUsage,
                startDate: coupon.startDate,
                endDate: coupon.endDate,
                status: coupon.status
            });
            setStartDate(coupon.startDate ? new Date(coupon.startDate) : null);
            setEndDate(coupon.endDate ? new Date(coupon.endDate) : null);
        } else {
            setFormData(emptyCoupon);
            setStartDate(new Date());
            setEndDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));
        }
        setSubmitted(false);
        setValidationErrors({});
    }, [coupon, visible, emptyCoupon]);

    const couponTypes = [
        { label: 'Percentage', value: CouponType.PERCENTAGE },
        { label: 'Fixed Amount', value: CouponType.FIXED_AMOUNT }
    ];

    const statusOptions = [
        { label: 'Active', value: CommonStatus.ACTIVE },
        { label: 'Inactive', value: CommonStatus.INACTIVE }
    ];

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = e.target.value;
        setFormData((prevState) => ({ ...prevState, [name]: val }));
    };

    const onInputNumberChange = (e: any, name: string) => {
        const val = e.value ?? 0;
        setFormData((prevState) => ({ ...prevState, [name]: val }));
    };

    const onDropdownChange = (e: { value: any }, name: string) => {
        const val = e.value;
        setFormData((prevState) => ({ ...prevState, [name]: val }));
    };

    const onStartDateChange = (e: any) => {
        const date = e.value;
        setStartDate(date);
        if (date) {
            setFormData((prevState) => ({ ...prevState, startDate: date.toISOString() }));
        }
    };

    const onEndDateChange = (e: any) => {
        const date = e.value;
        setEndDate(date);
        if (date) {
            setFormData((prevState) => ({ ...prevState, endDate: date.toISOString() }));
        }
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        setValidationErrors({});

        // Validation
        const errors: Record<string, string[]> = {};

        if (!formData.code) {
            errors.code = ['Code is required'];
        }

        if (formData.value === undefined || formData.value === null) {
            errors.value = ['Value is required'];
        } else if (formData.type === CouponType.PERCENTAGE && (formData.value < 0 || formData.value > 100)) {
            errors.value = ['Percentage value must be between 0 and 100'];
        } else if (formData.value < 0) {
            errors.value = ['Value cannot be negative'];
        }

        if (!formData.startDate) {
            errors.startDate = ['Start date is required'];
        }

        if (!formData.endDate) {
            errors.endDate = ['End date is required'];
        }

        if (startDate && endDate && startDate > endDate) {
            errors.endDate = ['End date must be after start date'];
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            await onSave(formData, isNew);
            onHide();
        } catch (error: any) {
            if (error.status === 400 && error.payload) {
                const errorData = error.payload;

                if (Array.isArray(errorData.message)) {
                    const errors: Record<string, string[]> = {};

                    errorData.message.forEach((msg: string) => {
                        const match = msg.match(/^([a-zA-Z]+) (.+)$/);
                        if (match) {
                            const field = match[1].toLowerCase();
                            const message = match[2];
                            if (!errors[field]) {
                                errors[field] = [];
                            }
                            errors[field].push(message);
                        } else {
                            if (!errors.general) {
                                errors.general = [];
                            }
                            errors.general.push(msg);
                        }
                    });

                    setValidationErrors(errors);
                } else if (typeof errorData.message === 'string') {
                    setValidationErrors({
                        general: [errorData.message]
                    });
                }
            }
        }
    };

    const couponDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header={isNew ? 'Create New Coupon' : 'Edit Coupon'}
            modal
            className="p-fluid"
            footer={couponDialogFooter}
            onHide={onHide}
        >
            {validationErrors.general && (
                <div className="p-error mb-3">
                    {validationErrors.general.map((error, index) => (
                        <div key={index} className="mb-1">{error}</div>
                    ))}
                </div>
            )}

            <div className="field">
                <label htmlFor="code">Code</label>
                <InputText
                    id="code"
                    value={formData.code}
                    onChange={(e) => onInputChange(e, 'code')}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !formData.code })}
                />
                {submitted && validationErrors.code && (
                    <small className="p-error">{validationErrors.code[0]}</small>
                )}
            </div>

            <div className="field">
                <label htmlFor="type">Type</label>
                <Dropdown
                    id="type"
                    value={formData.type}
                    options={couponTypes}
                    onChange={(e) => onDropdownChange(e, 'type')}
                    placeholder="Select a type"
                />
            </div>

            <div className="field">
                <label htmlFor="value">
                    {formData.type === CouponType.PERCENTAGE ? 'Percentage (%)' : 'Amount'}
                </label>
                <InputNumber
                    id="value"
                    value={formData.value}
                    onValueChange={(e) => onInputNumberChange(e, 'value')}
                    mode="decimal"
                    min={0}
                    max={formData.type === CouponType.PERCENTAGE ? 100 : undefined}
                    className={classNames({ 'p-invalid': submitted && validationErrors.value })}
                />
                {submitted && validationErrors.value && (
                    <small className="p-error">{validationErrors.value[0]}</small>
                )}
            </div>

            <div className="field">
                <label htmlFor="minPurchase">Minimum Purchase Amount (Optional)</label>
                <InputNumber
                    id="minPurchase"
                    value={formData.minPurchase}
                    onValueChange={(e) => onInputNumberChange(e, 'minPurchase')}
                    mode="decimal"
                    min={0}
                />
            </div>

            <div className="field">
                <label htmlFor="maxUsage">Maximum Usage Count (Optional)</label>
                <InputNumber
                    id="maxUsage"
                    value={formData.maxUsage}
                    onValueChange={(e) => onInputNumberChange(e, 'maxUsage')}
                    min={1}
                />
            </div>

            <div className="field">
                <label htmlFor="startDate">Start Date</label>
                <Calendar
                    id="startDate"
                    value={startDate}
                    onChange={onStartDateChange}
                    showTime
                    dateFormat="dd/mm/yy"
                    className={classNames({ 'p-invalid': submitted && validationErrors.startDate })}
                />
                {submitted && validationErrors.startDate && (
                    <small className="p-error">{validationErrors.startDate[0]}</small>
                )}
            </div>

            <div className="field">
                <label htmlFor="endDate">End Date</label>
                <Calendar
                    id="endDate"
                    value={endDate}
                    onChange={onEndDateChange}
                    showTime
                    dateFormat="dd/mm/yy"
                    className={classNames({ 'p-invalid': submitted && validationErrors.endDate })}
                />
                {submitted && validationErrors.endDate && (
                    <small className="p-error">{validationErrors.endDate[0]}</small>
                )}
            </div>

            <div className="field">
                <label htmlFor="status">Status</label>
                <Dropdown
                    id="status"
                    value={formData.status}
                    options={statusOptions}
                    onChange={(e) => onDropdownChange(e, 'status')}
                    placeholder="Select a status"
                />
            </div>
        </Dialog>
    );
};

export default CouponForm;

