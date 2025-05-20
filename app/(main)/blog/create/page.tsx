'use client';
import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { BlogForm } from '../components';
import { BlogApiService } from '@/service/BlogApiService';

const CreateBlogPage = () => {
    const toast = useRef<Toast>(null);
    const router = useRouter();

    const handleSave = async (formData: FormData) => {
        try {
            await BlogApiService.createPost({
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                description: formData.get('description') as string || undefined,
                metaTitle: formData.get('metaTitle') as string || undefined,
                metaDescription: formData.get('metaDescription') as string || undefined,
                status: formData.get('status') as any,
                publishedAt: formData.get('publishedAt') as string || undefined,
                tagIds: formData.getAll('tagIds').map(id => parseInt(id as string)),
                thumbnail: formData.get('thumbnail') as File || undefined
            });
            
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Blog post created successfully', life: 3000 });
            router.push('/blog');
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create blog post', life: 3000 });
        }
    };

    const handleCancel = () => {
        router.push('/blog');
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <h2>Create New Blog Post</h2>
            <BlogForm 
                post={null} 
                onSave={handleSave} 
                onCancel={handleCancel} 
            />
        </div>
    );
};

export default CreateBlogPage;
