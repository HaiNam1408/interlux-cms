'use client';
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Tag, CreateTagDto, UpdateTagDto } from '@/types/blog';

interface TagFormProps {
    tag: Tag | null;
    visible: boolean;
    onHide: () => void;
    onSave: (tag: CreateTagDto | UpdateTagDto) => void;
}

export const TagForm = (props: TagFormProps) => {
    const { tag, visible, onHide, onSave } = props;
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (tag) {
            setName(tag.name);
        } else {
            setName('');
        }
        setSubmitted(false);
    }, [tag, visible]);

    const saveTag = () => {
        setSubmitted(true);

        if (name.trim()) {
            const tagData = {
                name: name.trim()
            };
            
            onSave(tagData);
            onHide();
        }
    };

    const tagDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={onHide} />
            <Button label="Save" icon="pi pi-check" onClick={saveTag} />
        </React.Fragment>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header={tag ? 'Edit Tag' : 'New Tag'}
            modal
            className="p-fluid"
            footer={tagDialogFooter}
            onHide={onHide}
        >
            <div className="field">
                <label htmlFor="name">Name</label>
                <InputText
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !name })}
                />
                {submitted && !name && <small className="p-error">Name is required.</small>}
            </div>
        </Dialog>
    );
};
