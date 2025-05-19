'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/navigation';
import { Post, PostStatus } from '@/types/blog';
import { BlogApiService } from '@/service/BlogApiService';
import { TagApiService } from '@/service/TagApiService';
import { BlogTable, DeletePostDialog, DeletePostsDialog } from './components';

const BlogPage = () => {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
    const [deletePostDialog, setDeletePostDialog] = useState(false);
    const [deletePostsDialog, setDeletePostsDialog] = useState(false);
    const [post, setPost] = useState<Post | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<PostStatus | null>(null);
    const [tagFilter, setTagFilter] = useState<number | null>(null);
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        search: '',
        status: null as PostStatus | null,
        tagId: null as number | null
    });

    const statusOptions = [
        { label: 'All Statuses', value: null },
        { label: 'Draft', value: PostStatus.DRAFT },
        { label: 'Published', value: PostStatus.PUBLISHED }
    ];

    const loadPosts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await BlogApiService.getPosts(
                lazyParams.page,
                lazyParams.rows,
                {
                    search: lazyParams.search,
                    status: lazyParams.status || undefined,
                    tagId: lazyParams.tagId || undefined
                }
            );
            console.log(response);
            
            if (response) {
                setPosts(response.data);
                setTotalRecords(response.meta.total);
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load blog posts', life: 3000 });
        } finally {
            setLoading(false);
        }
    }, [lazyParams]);

    const loadTags = async () => {
        try {
            const response = await TagApiService.getAllTags();
            if (response) {
                const tagOptions = [
                    { label: 'All Tags', value: null },
                    ...response.map(tag => ({ label: tag.name, value: tag.id }))
                ];
                setTags(tagOptions);
            }
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    useEffect(() => {
        loadTags();
    }, []);

    const hideDeletePostDialog = () => {
        setDeletePostDialog(false);
    };

    const hideDeletePostsDialog = () => {
        setDeletePostsDialog(false);
    };

    const createPost = () => {
        router.push('/pages/blog/create');
    };

    const editPost = (post: Post) => {
        router.push(`/pages/blog/edit/${post.id}`);
    };

    const viewPost = (post: Post) => {
        window.open(`/blog/${post.slug}`, '_blank');
    };

    const confirmDeletePost = (post: Post) => {
        setPost(post);
        setDeletePostDialog(true);
    };

    const deletePost = async () => {
        try {
            if (post) {
                await BlogApiService.deletePost(post.id);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Blog post deleted', life: 3000 });
                setDeletePostDialog(false);
                setPost(null);
                loadPosts();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete blog post', life: 3000 });
        }
    };

    const confirmDeleteSelected = () => {
        setDeletePostsDialog(true);
    };

    const deleteSelectedPosts = async () => {
        try {
            const deletePromises = selectedPosts.map(post => BlogApiService.deletePost(post.id));
            await Promise.all(deletePromises);
            
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Blog posts deleted', life: 3000 });
            setDeletePostsDialog(false);
            setSelectedPosts([]);
            loadPosts();
        } catch (error) {
            console.error('Error deleting selected posts:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete blog posts', life: 3000 });
        }
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilter(value);
        setLazyParams({
            ...lazyParams,
            page: 1,
            first: 0,
            search: value
        });
    };

    const onStatusChange = (e: { value: PostStatus | null }) => {
        setStatusFilter(e.value);
        setLazyParams({
            ...lazyParams,
            page: 1,
            first: 0,
            status: e.value
        });
    };

    const onTagChange = (e: { value: number | null }) => {
        setTagFilter(e.value);
        setLazyParams({
            ...lazyParams,
            page: 1,
            first: 0,
            tagId: e.value
        });
    };

    const onPage = (event: any) => {
        setLazyParams({
            ...lazyParams,
            page: event.page + 1,
            first: event.first,
            rows: event.rows
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={createPost} />
                <Button 
                    label="Delete" 
                    icon="pi pi-trash" 
                    severity="danger" 
                    onClick={confirmDeleteSelected} 
                    disabled={!selectedPosts || selectedPosts.length === 0} 
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Dropdown 
                    value={statusFilter} 
                    options={statusOptions} 
                    onChange={onStatusChange} 
                    placeholder="Filter by Status" 
                    className="w-full md:w-14rem"
                />
                <Dropdown 
                    value={tagFilter} 
                    options={tags} 
                    onChange={onTagChange} 
                    placeholder="Filter by Tag" 
                    className="w-full md:w-14rem"
                />
            </div>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <BlogTable
                    posts={posts}
                    selectedPosts={selectedPosts}
                    onSelectionChange={setSelectedPosts}
                    onEditPost={editPost}
                    onDeletePost={confirmDeletePost}
                    onViewPost={viewPost}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={onGlobalFilterChange}
                    loading={loading}
                    totalRecords={totalRecords}
                    rows={lazyParams.rows}
                    first={lazyParams.first}
                    onPage={onPage}
                />
            </div>

            <DeletePostDialog
                post={post}
                visible={deletePostDialog}
                onHide={hideDeletePostDialog}
                onDelete={deletePost}
            />

            <DeletePostsDialog
                visible={deletePostsDialog}
                onHide={hideDeletePostsDialog}
                onDeleteSelected={deleteSelectedPosts}
                selectedPosts={selectedPosts}
            />
        </div>
    );
};

export default BlogPage;
