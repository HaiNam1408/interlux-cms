'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Editor } from 'primereact/editor';
import { Post, PostStatus, Tag as TagType } from '@/types/blog';
import { TagApiService } from '@/service/TagApiService';

interface BlogFormProps {
    post: Post | null;
    onSave: (postData: FormData) => Promise<void>;
    onCancel: () => void;
}

export const BlogForm = (props: BlogFormProps) => {
    const { post, onSave, onCancel } = props;
    const toast = useRef<Toast>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [status, setStatus] = useState<PostStatus>(PostStatus.DRAFT);
    const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
    const [allTags, setAllTags] = useState<TagType[]>([]);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [removeThumbnail, setRemoveThumbnail] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const statusOptions = [
        { label: 'Draft', value: PostStatus.DRAFT },
        { label: 'Published', value: PostStatus.PUBLISHED }
    ];

    useEffect(() => {
        loadTags();
    }, []);

    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setContent(post.content || '');
            setDescription(post.description || '');
            setMetaTitle(post.metaTitle || '');
            setMetaDescription(post.metaDescription || '');
            setStatus(post.status || PostStatus.DRAFT);
            if (post.tags) {
                setSelectedTags(post.tags.map((t: any) => t.tag ?? t));
            }
            
            if (post.thumbnail) {
                setThumbnailPreview(post.thumbnail.filePath);
            } else {
                setThumbnailPreview(null);
            }
        } else {
            resetForm();
        }
    }, [post]);

    const loadTags = async () => {
        try {
            const response = await TagApiService.getAllTags();
            if (response) {
                setAllTags(response);
            }
        } catch (error) {
            console.error('Error loading tags:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load tags', life: 3000 });
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setDescription('');
        setMetaTitle('');
        setMetaDescription('');
        setStatus(PostStatus.DRAFT);
        setSelectedTags([]);
        setThumbnail(null);
        setThumbnailPreview(null);
        setRemoveThumbnail(false);
        setSubmitted(false);
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setThumbnail(file);
            setRemoveThumbnail(false);
            
            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveThumbnail = () => {
        setThumbnail(null);
        setThumbnailPreview(null);
        setRemoveThumbnail(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        if (!title.trim() || !content.trim()) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields', life: 3000 });
            return;
        }

        try {
            setLoading(true);
            
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            
            if (description) {
                formData.append('description', description);
            }
            
            if (metaTitle) {
                formData.append('metaTitle', metaTitle);
            }
            
            if (metaDescription) {
                formData.append('metaDescription', metaDescription);
            }
            
            formData.append('status', status);
            
            if (selectedTags && selectedTags.length > 0) {
                selectedTags.forEach(tag => {
                    formData.append('tagIds', tag.id.toString());
                });
            }
            
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }
            
            if (removeThumbnail) {
                formData.append('removeThumbnail', 'true');
            }
            
            await onSave(formData);
            resetForm();
        } catch (error) {
            console.error('Error saving post:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to save blog post', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <form onSubmit={handleSubmit} className="p-fluid">
                <div className="grid">
                    <div className="col-12 md:col-8">
                        <div className="field">
                            <label htmlFor="title">Title*</label>
                            <InputText
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !title })}
                            />
                            {submitted && !title && <small className="p-error">Title is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="content">Content*</label>
                            <Editor
                                value={content}
                                onTextChange={(e) => setContent(e.htmlValue || '')}
                                style={{ height: '320px' }}
                            />
                            {submitted && !content && <small className="p-error">Content is required.</small>}
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown
                                id="status"
                                value={status}
                                options={statusOptions}
                                onChange={(e) => setStatus(e.value)}
                                placeholder="Select a status"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="tags">Tags</label>
                            <MultiSelect
                                id="tags"
                                value={selectedTags}
                                options={allTags}
                                onChange={(e) => setSelectedTags(e.value)}
                                optionLabel="name"
                                placeholder="Select Tags"
                                display="chip"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="thumbnail">Thumbnail</label>
                            <div className="flex flex-column gap-2">
                                {thumbnailPreview && (
                                    <div className="relative">
                                        <img 
                                            src={thumbnailPreview} 
                                            alt="Thumbnail Preview" 
                                            className="w-full border-round"
                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                        />
                                        <Button 
                                            icon="pi pi-times" 
                                            className="p-button-rounded p-button-danger p-button-sm absolute" 
                                            style={{ top: '0.5rem', right: '0.5rem' }}
                                            onClick={handleRemoveThumbnail}
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="p-inputtext w-full"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="metaTitle">Meta Title</label>
                            <InputText
                                id="metaTitle"
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="metaDescription">Meta Description</label>
                            <InputTextarea
                                id="metaDescription"
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-content-end gap-2 mt-4">
                    <Button label="Cancel" icon="pi pi-times" outlined onClick={onCancel} type="button" />
                    <Button label="Save" icon="pi pi-check" type="submit" loading={loading} />
                </div>
            </form>
        </div>
    );
};
