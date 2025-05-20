import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@/types/customer';

interface CustomerFormProps {
    visible: boolean;
    customer: Customer | null;
    onHide: () => void;
    onSave: (customer: CreateCustomerDto | UpdateCustomerDto, isNew: boolean) => Promise<any>;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ visible, customer, onHide, onSave }) => {
    const [formData, setFormData] = useState<CreateCustomerDto | UpdateCustomerDto>({
        username: '',
        email: '',
        phone: '',
        password: '',
        address: '',
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [deleteAvatar, setDeleteAvatar] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        username?: string;
        email?: string;
        phone?: string;
        password?: string;
        address?: string;
        general?: string[];
    }>({});

    const isNew = !customer?.id;

    useEffect(() => {
        if (customer) {
            setFormData({
                username: customer.username || '',
                email: customer.email || '',
                phone: customer.phone || '',
                password: '', // Don't populate password for security reasons
                address: customer.address || '',
            });

            if (customer.avatar) {
                setAvatarPreview(customer.avatar.filePath);
            } else {
                setAvatarPreview(null);
            }
        } else {
            resetForm();
        }
        setSubmitted(false);
        setDeleteAvatar(false);
        setValidationErrors({});
    }, [customer, visible]);

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            phone: '',
            password: '',
            address: '',
        });
        setAvatar(null);
        setAvatarPreview(null);
        setDeleteAvatar(false);
        setValidationErrors({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
            setDeleteAvatar(false);
        }
    };

    const handleDeleteAvatar = () => {
        setAvatar(null);
        setAvatarPreview(null);
        setDeleteAvatar(true);
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        setValidationErrors({});
        if (!formData.username || !formData.email || !formData.phone || (isNew && !formData.password)) {
            return;
        }

        const customerData: CreateCustomerDto | UpdateCustomerDto = { ...formData };

        if (avatar) {
            customerData.avatar = avatar;
        } else if (deleteAvatar) {
            customerData.avatar = '';
        }

        if (!isNew && !formData.password) {
            delete customerData.password;
        }

        try {
            await onSave(customerData, isNew);
        } catch (error: any) {
            if (error.status === 400 && error.payload) {
                const errorData = error.payload;
                if (Array.isArray(errorData.message)) {
                    const errors: any = {};

                    errorData.message.forEach((message: string) => {
                        if (message.includes('Username')) {
                            errors.username = message;
                        } else if (message.includes('Email')) {
                            errors.email = message;
                        } else if (message.includes('Phone')) {
                            errors.phone = message;
                        } else if (message.includes('Password')) {
                            errors.password = message;
                        } else if (message.includes('Address')) {
                            errors.address = message;
                        } else {
                            if (!errors.general) {
                                errors.general = [];
                            }
                            errors.general.push(message);
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

    const customerDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header={isNew ? 'Create New Customer' : 'Edit Customer'}
            modal
            className="p-fluid"
            footer={customerDialogFooter}
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
                <label htmlFor="username" className="font-bold">
                    Username
                </label>
                <InputText
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': (submitted && !formData.username) || validationErrors.username })}
                />
                {submitted && !formData.username && <small className="p-error">Username is required.</small>}
                {validationErrors.username && <small className="p-error">{validationErrors.username}</small>}
            </div>

            <div className="field">
                <label htmlFor="email" className="font-bold">
                    Email
                </label>
                <InputText
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={classNames({ 'p-invalid': (submitted && !formData.email) || validationErrors.email })}
                />
                {submitted && !formData.email && <small className="p-error">Email is required.</small>}
                {validationErrors.email && <small className="p-error">{validationErrors.email}</small>}
            </div>

            <div className="field">
                <label htmlFor="phone" className="font-bold">
                    Phone
                </label>
                <InputText
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={classNames({ 'p-invalid': (submitted && !formData.phone) || validationErrors.phone })}
                />
                {submitted && !formData.phone && <small className="p-error">Phone is required.</small>}
                {validationErrors.phone && <small className="p-error">{validationErrors.phone}</small>}
            </div>

            <div className="field">
                <label htmlFor="password" className="font-bold">
                    Password {!isNew && <span className="text-sm text-500">(Leave empty to keep current password)</span>}
                </label>
                <Password
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={isNew}
                    toggleMask
                    feedback={false}
                    className={classNames({ 'p-invalid': (submitted && isNew && !formData.password) || validationErrors.password })}
                />
                {submitted && isNew && !formData.password && <small className="p-error">Password is required for new customers.</small>}
                {validationErrors.password && <small className="p-error">{validationErrors.password}</small>}
            </div>

            <div className="field">
                <label htmlFor="address" className="font-bold">
                    Address
                </label>
                <InputText
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={classNames({ 'p-invalid': validationErrors.address })}
                />
                {validationErrors.address && <small className="p-error">{validationErrors.address}</small>}
            </div>

            <div className="field">
                <label htmlFor="avatar" className="font-bold">
                    Avatar
                </label>
                <div className="flex flex-column gap-2">
                    {avatarPreview && (
                        <div className="flex align-items-center gap-2 mb-2">
                            <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                className="shadow-2 border-round"
                                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                            />
                            <Button
                                icon="pi pi-trash"
                                rounded
                                outlined
                                severity="danger"
                                onClick={handleDeleteAvatar}
                                tooltip="Delete Avatar"
                                tooltipOptions={{ position: 'bottom' }}
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                    <Button
                        label="Select Avatar"
                        icon="pi pi-upload"
                        outlined
                        onClick={() => document.getElementById('avatar')?.click()}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default CustomerForm;
