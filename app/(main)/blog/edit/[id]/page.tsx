'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { BlogForm } from '../../components';
import { BlogApiService } from '@/service/BlogApiService';
import { Post } from '@/types/blog';
import { ProgressSpinner } from 'primereact/progressspinner';

interface EditBlogPageProps {
    params: Promise<{
        id: string;
    }>;
}
const EditBlogPage = ({ params }: EditBlogPageProps) => {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const resolvedParams = use(params);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postId = parseInt(resolvedParams.id);
                if (isNaN(postId)) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Invalid post ID', life: 3000 });
                    router.push('/blog');
                    return;
                }

                const postData = await BlogApiService.getPostById(postId);
                if (postData) {
                    setPost(postData);
                } else {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Blog post not found', life: 3000 });
                    router.push('/blog');
                }
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load blog post', life: 3000 });
                router.push('/blog');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [resolvedParams.id, router]);

    const handleSave = async (formData: FormData) => {
        try {
            if (!post) return;

            await BlogApiService.updatePost(post.id, {
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                description: formData.get('description') as string || undefined,
                metaTitle: formData.get('metaTitle') as string || undefined,
                metaDescription: formData.get('metaDescription') as string || undefined,
                status: formData.get('status') as any,
                publishedAt: formData.get('publishedAt') as string || undefined,
                tagIds: formData.getAll('tagIds').map(id => parseInt(id as string)),
                thumbnail: formData.get('thumbnail') as File || undefined,
                removeThumbnail: formData.get('removeThumbnail') === 'true'
            });
            
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Blog post updated successfully', life: 3000 });
            router.push('/blog');
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update blog post', life: 3000 });
        }
    };

    const handleCancel = () => {
        router.push('/blog');
    };

    if (loading) {
        return (
            <div className="card flex justify-content-center">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="card">
            <Toast ref={toast} />
            <h2>Edit Blog Post</h2>
            {post && (
                <BlogForm 
                    post={post} 
                    onSave={handleSave} 
                    onCancel={handleCancel} 
                />
            )}
        </div>
    );
};

export default EditBlogPage;
