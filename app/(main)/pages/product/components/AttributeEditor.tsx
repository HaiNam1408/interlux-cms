import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './attribute-editor.css';
import { v4 as uuidv4 } from 'uuid';

interface AttributeEditorProps {
    attributes: Record<string, any>;
    onChange: (attributes: Record<string, any>) => void;
}

interface AttributePair {
    id: string;
    key: string;
    value: string;
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({ attributes, onChange }) => {
    const [attributePairs, setAttributePairs] = useState<AttributePair[]>([]);

    useEffect(() => {
        const pairs: AttributePair[] = [];

        if (attributes && typeof attributes === 'object') {
            Object.entries(attributes).forEach(([key, value]) => {
                pairs.push({
                    id: uuidv4(),
                    key,
                    value: typeof value === 'object' ? JSON.stringify(value) : String(value)
                });
            });
        }
        setAttributePairs(pairs);
    }, [attributes]);

    const updateAttributes = (newPairs: AttributePair[]) => {
        const newAttributes: Record<string, any> = {};

        newPairs.forEach((pair) => {
            if (pair.key.trim()) {
                try {
                    if ((pair.value.startsWith('{') && pair.value.endsWith('}')) || (pair.value.startsWith('[') && pair.value.endsWith(']'))) {
                        newAttributes[pair.key] = JSON.parse(pair.value);
                    } else {
                        newAttributes[pair.key] = pair.value;
                    }
                } catch (e) {
                    newAttributes[pair.key] = pair.value;
                }
            }
        });

        onChange(newAttributes);
    };

    const handleChange = (id: string, field: 'key' | 'value', value: string) => {
        const newPairs = attributePairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair));
        setAttributePairs(newPairs);
        updateAttributes(newPairs);
    };

    const addAttributePair = () => {
        setAttributePairs([...attributePairs, { id: uuidv4(), key: '', value: '' }]);
    };

    const removeAttributePair = (id: string) => {
        const newPairs = attributePairs.filter((pair) => pair.id !== id);

        if (newPairs.length === 0) {
            newPairs.push({ id: uuidv4(), key: '', value: '' });
        }

        setAttributePairs(newPairs);
        updateAttributes(newPairs);
    };

    return (
        <div className="attribute-editor">
            <h5>Product Attributes</h5>

            {attributePairs.map((pair) => (
                <div key={pair.id} className="p-inputgroup">
                    <span className="p-inputgroup-addon">Key</span>
                    <InputText value={pair.key} onChange={(e) => handleChange(pair.id, 'key', e.target.value)} placeholder="Attribute name" />
                    <span className="p-inputgroup-addon">Value</span>
                    <InputText value={pair.value} onChange={(e) => handleChange(pair.id, 'value', e.target.value)} placeholder="Attribute value" />
                    <Button icon="pi pi-times" severity="danger" onClick={() => removeAttributePair(pair.id)} disabled={attributePairs.length === 1} />
                </div>
            ))}

            <Button label="Add Attribute" icon="pi pi-plus" severity="success" outlined className="mt-2" onClick={addAttributePair} />
        </div>
    );
};

export default AttributeEditor;
