/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { VariationApiService, Variation, VariationOption } from '@/demo/service/VariationApiService';
import { PaginatedData } from '@/types/response';
import { useParams, useRouter } from 'next/navigation';
import '../../styles.css';

// Import components
import {
    VariationOptionTable,
    VariationOptionForm,
    DeleteVariationOptionDialog,
    DeleteVariationOptionsDialog
} from './components';

const VariationOptionPage = () => {
    const params = useParams();
    const router = useRouter();
    const variationId = parseInt(params.id as string);

    let emptyVariationOption: VariationOption = {
        id: 0,
        name: '',
        slug: '',
        value: '',
        variationId: variationId,
        sort: 0,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const [variation, setVariation] = useState<Variation | null>(null);
    const [options, setOptions] = useState<VariationOption[]>([]);
    const [optionSidebar, setOptionSidebar] = useState(false);
    const [deleteOptionDialog, setDeleteOptionDialog] = useState(false);
    const [deleteOptionsDialog, setDeleteOptionsDialog] = useState(false);
    const [option, setOption] = useState<VariationOption>(emptyVariationOption);
    const [selectedOptions, setSelectedOptions] = useState<VariationOption[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    // Pagination state
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadVariation();
        loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, rows]);

    const loadVariation = async () => {
        try {
            const data = await VariationApiService.getVariationById(variationId);
            if (data) {
                setVariation(data);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Variation not found',
                    life: 3000
                });
                router.push('/variation');
            }
        } catch (error) {
            console.error('Error loading variation:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load variation',
                life: 3000
            });
            router.push('/variation');
        }
    };

    const loadOptions = () => {
        setLoading(true);
        VariationApiService.getVariationOptions(variationId, currentPage, rows)
            .then((response: PaginatedData<VariationOption> | null) => {
                if (response) {
                    setOptions(response.data);
                    setTotalRecords(response.meta.total);
                } else {
                    setOptions([]);
                    setTotalRecords(0);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error loading variation options:', error);
                setLoading(false);
                setOptions([]);
                setTotalRecords(0);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load variation options',
                    life: 3000
                });
            });
    };

    const openNew = () => {
        setOption(emptyVariationOption);
        setSubmitted(false);
        setOptionSidebar(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setOptionSidebar(false);
    };

    const hideDeleteOptionDialog = () => {
        setDeleteOptionDialog(false);
    };

    const hideDeleteOptionsDialog = () => {
        setDeleteOptionsDialog(false);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const saveOption = () => {
        setSubmitted(true);

        if (option.name.trim()) {
            let _option = { ...option };

            // Generate slug if empty
            if (!_option.slug) {
                _option.slug = generateSlug(_option.name);
            }

            if (_option.id) {
                // Update existing option
                VariationApiService.updateVariationOption(variationId, _option.id, _option)
                    .then(() => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Variation Option Updated',
                            life: 3000
                        });
                        loadOptions();
                    })
                    .catch((error) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to update variation option: ${error.message}`,
                            life: 3000
                        });
                    });
            } else {
                // Create new option
                VariationApiService.createVariationOption(variationId, _option)
                    .then(() => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Variation Option Created',
                            life: 3000
                        });
                        loadOptions();
                    })
                    .catch((error) => {
                        console.error('Failed to create variation option:', error);
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to create variation option: ${error.message || 'Unknown error'}`,
                            life: 3000
                        });
                    });
            }

            setOptionSidebar(false);
            setOption(emptyVariationOption);
        }
    };

    const editOption = (option: VariationOption) => {
        setOption({ ...option });
        setOptionSidebar(true);
    };

    const confirmDeleteOption = (option: VariationOption) => {
        setOption(option);
        setDeleteOptionDialog(true);
    };

    const deleteOption = () => {
        VariationApiService.deleteVariationOption(variationId, option.id)
            .then(() => {
                setDeleteOptionDialog(false);
                setOption(emptyVariationOption);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Variation Option Deleted',
                    life: 3000
                });
                loadOptions();
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to delete variation option: ${error.message}`,
                    life: 3000
                });
            });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteOptionsDialog(true);
    };

    const deleteSelectedOptions = () => {
        if (!selectedOptions || selectedOptions.length === 0) return;

        const deletePromises = selectedOptions.map((option) => 
            VariationApiService.deleteVariationOption(variationId, option.id)
        );

        Promise.all(deletePromises)
            .then(() => {
                loadOptions();
                setDeleteOptionsDialog(false);
                setSelectedOptions([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Variation Options Deleted',
                    life: 3000
                });
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to delete variation options: ${error.message}`,
                    life: 3000
                });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _option = { ...option } as any;
        _option[name] = val;

        // Auto-generate slug when name changes
        if (name === 'name' && !_option.slug) {
            _option.slug = generateSlug(val);
        }

        setOption(_option);
    };

    const onInputNumberChange = (e: { value: number | null }, name: string) => {
        const val = e.value || 0;
        let _option = { ...option } as any;
        _option[name] = val;

        setOption(_option);
    };

    const onStatusChange = (e: { value: string }) => {
        let _option = { ...option };
        _option.status = e.value as 'ACTIVE' | 'INACTIVE' | 'DRAFT';
        setOption(_option);
    };

    // Handle pagination change
    const onPage = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(Math.floor(event.first / event.rows) + 1);
    };

    const statusOptions = [
        { label: 'ACTIVE', value: 'ACTIVE' },
        { label: 'INACTIVE', value: 'INACTIVE' },
        { label: 'DRAFT', value: 'DRAFT' }
    ];

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h3>
                            Options for Variation: {variation?.name || 'Loading...'}
                        </h3>
                        <Button 
                            label="Back to Variations" 
                            icon="pi pi-arrow-left" 
                            className="p-button-outlined"
                            onClick={() => router.push('/variation')}
                        />
                    </div>
                    
                    <Toolbar
                        className="mb-3"
                        start={
                            <div className="my-2">
                                <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedOptions || selectedOptions.length === 0} />
                            </div>
                        }
                        end={
                            <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
                        }
                    />

                    <VariationOptionTable
                        options={options}
                        selectedOptions={selectedOptions}
                        onSelectionChange={(e) => setSelectedOptions(e.value)}
                        loading={loading}
                        totalRecords={totalRecords}
                        first={first}
                        rows={rows}
                        onPage={onPage}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        onEdit={editOption}
                        onDelete={confirmDeleteOption}
                        dt={dt}
                        exportCSV={exportCSV}
                    />

                    <VariationOptionForm
                        visible={optionSidebar}
                        onHide={hideDialog}
                        option={option}
                        submitted={submitted}
                        statusOptions={statusOptions}
                        onSave={saveOption}
                        onInputChange={onInputChange}
                        onInputNumberChange={onInputNumberChange}
                        onStatusChange={onStatusChange}
                    />

                    <DeleteVariationOptionDialog
                        visible={deleteOptionDialog}
                        onHide={hideDeleteOptionDialog}
                        option={option}
                        onDelete={deleteOption}
                    />

                    <DeleteVariationOptionsDialog
                        visible={deleteOptionsDialog}
                        onHide={hideDeleteOptionsDialog}
                        onDeleteSelected={deleteSelectedOptions}
                    />
                </div>
            </div>
        </div>
    );
};

export default VariationOptionPage;
