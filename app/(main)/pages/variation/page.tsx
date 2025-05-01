/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { VariationApiService, Variation } from '@/demo/service/VariationApiService';
import { PaginatedData } from '@/types/response';
import './styles.css';

// Import components
import {
    VariationTable,
    VariationForm,
    DeleteVariationDialog,
    DeleteVariationsDialog
} from './components';

const VariationPage = () => {
    let emptyVariation: Variation = {
        id: 0,
        name: '',
        slug: '',
        sort: 0,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const [variations, setVariations] = useState<Variation[]>([]);
    const [variationSidebar, setVariationSidebar] = useState(false);
    const [deleteVariationDialog, setDeleteVariationDialog] = useState(false);
    const [deleteVariationsDialog, setDeleteVariationsDialog] = useState(false);
    const [variation, setVariation] = useState<Variation>(emptyVariation);
    const [selectedVariations, setSelectedVariations] = useState<Variation[]>([]);
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
        loadVariations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, rows]);

    const loadVariations = () => {
        setLoading(true);
        VariationApiService.getVariations(currentPage, rows)
            .then((response: PaginatedData<Variation> | null) => {
                if (response) {
                    setVariations(response.data);
                    setTotalRecords(response.meta.total);
                } else {
                    setVariations([]);
                    setTotalRecords(0);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error loading variations:', error);
                setLoading(false);
                setVariations([]);
                setTotalRecords(0);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load variations',
                    life: 3000
                });
            });
    };

    const openNew = () => {
        setVariation(emptyVariation);
        setSubmitted(false);
        setVariationSidebar(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setVariationSidebar(false);
    };

    const hideDeleteVariationDialog = () => {
        setDeleteVariationDialog(false);
    };

    const hideDeleteVariationsDialog = () => {
        setDeleteVariationsDialog(false);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const saveVariation = () => {
        setSubmitted(true);

        if (variation.name.trim()) {
            let _variation = { ...variation };

            // Generate slug if empty
            if (!_variation.slug) {
                _variation.slug = generateSlug(_variation.name);
            }

            if (_variation.id) {
                // Update existing variation
                VariationApiService.updateVariation(_variation.id, _variation)
                    .then(() => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Variation Updated',
                            life: 3000
                        });
                        loadVariations();
                    })
                    .catch((error) => {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to update variation: ${error.message}`,
                            life: 3000
                        });
                    });
            } else {
                // Create new variation
                VariationApiService.createVariation(_variation)
                    .then(() => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Variation Created',
                            life: 3000
                        });
                        loadVariations();
                    })
                    .catch((error) => {
                        console.error('Failed to create variation:', error);
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to create variation: ${error.message || 'Unknown error'}`,
                            life: 3000
                        });
                    });
            }

            setVariationSidebar(false);
            setVariation(emptyVariation);
        }
    };

    const editVariation = (variation: Variation) => {
        setVariation({ ...variation });
        setVariationSidebar(true);
    };

    const confirmDeleteVariation = (variation: Variation) => {
        setVariation(variation);
        setDeleteVariationDialog(true);
    };

    const deleteVariation = () => {
        VariationApiService.deleteVariation(variation.id)
            .then(() => {
                setDeleteVariationDialog(false);
                setVariation(emptyVariation);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Variation Deleted',
                    life: 3000
                });
                loadVariations();
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to delete variation: ${error.message}`,
                    life: 3000
                });
            });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteVariationsDialog(true);
    };

    const deleteSelectedVariations = () => {
        if (!selectedVariations || selectedVariations.length === 0) return;

        const deletePromises = selectedVariations.map((variation) => VariationApiService.deleteVariation(variation.id));

        Promise.all(deletePromises)
            .then(() => {
                loadVariations();
                setDeleteVariationsDialog(false);
                setSelectedVariations([]);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Variations Deleted',
                    life: 3000
                });
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to delete variations: ${error.message}`,
                    life: 3000
                });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _variation = { ...variation } as any;
        _variation[name] = val;

        // Auto-generate slug when name changes
        if (name === 'name' && !_variation.slug) {
            _variation.slug = generateSlug(val);
        }

        setVariation(_variation);
    };

    const onInputNumberChange = (e: { value: number | null }, name: string) => {
        const val = e.value || 0;
        let _variation = { ...variation } as any;
        _variation[name] = val;

        setVariation(_variation);
    };

    const onStatusChange = (e: { value: string }) => {
        let _variation = { ...variation };
        _variation.status = e.value as 'ACTIVE' | 'INACTIVE' | 'DRAFT';
        setVariation(_variation);
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
                    <Toolbar
                        className="mb-3"
                        start={
                            <div className="my-2">
                                <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedVariations || selectedVariations.length === 0} />
                            </div>
                        }
                        end={
                            <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
                        }
                    />

                    <VariationTable
                        variations={variations}
                        selectedVariations={selectedVariations}
                        onSelectionChange={(e) => setSelectedVariations(e.value)}
                        loading={loading}
                        totalRecords={totalRecords}
                        first={first}
                        rows={rows}
                        onPage={onPage}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        onEdit={editVariation}
                        onDelete={confirmDeleteVariation}
                        dt={dt}
                        exportCSV={exportCSV}
                    />

                    <VariationForm
                        visible={variationSidebar}
                        onHide={hideDialog}
                        variation={variation}
                        submitted={submitted}
                        statusOptions={statusOptions}
                        onSave={saveVariation}
                        onInputChange={onInputChange}
                        onInputNumberChange={onInputNumberChange}
                        onStatusChange={onStatusChange}
                    />

                    <DeleteVariationDialog
                        visible={deleteVariationDialog}
                        onHide={hideDeleteVariationDialog}
                        variation={variation}
                        onDelete={deleteVariation}
                    />

                    <DeleteVariationsDialog
                        visible={deleteVariationsDialog}
                        onHide={hideDeleteVariationsDialog}
                        onDeleteSelected={deleteSelectedVariations}
                    />
                </div>
            </div>
        </div>
    );
};

export default VariationPage;
