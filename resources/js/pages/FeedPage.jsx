import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function PostCard({ post, onLike, onComment, onDelete }) {
    const { user }          = useAuth();
    const [comment, setComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);

    async function loadComments() {
        const res = await api.get(`/posts/${post.id}/comments`);
        setComments(res.data);
        setShowComments(true);
    }

    async function submitComment(e) {
        e.preventDefault();
        if (!comment.trim()) return;
        await api.post(`/posts/${post.id}/comments`, { content: comment });
        setComment('');
        loadComments();
        onComment(post.id);
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {post.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{post.user?.name}</p>
                        <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                </div>
                {user?.id === post.user_id && (
                    <button onClick={() => onDelete(post.id)} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
                )}
            </div>

            <p className="text-gray-800 mb-4">{post.content}</p>

            <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-3">
                <button
                    onClick={() => onLike(post.id)}
                    className={`flex items-center gap-1 hover:text-indigo-600 ${post.liked_by_me ? 'text-indigo-600 font-medium' : ''}`}
                >
                    ♥ {post.likes_count ?? 0}
                </button>
                <button
                    onClick={showComments ? () => setShowComments(false) : loadComments}
                    className="flex items-center gap-1 hover:text-indigo-600"
                >
                    💬 {post.comments_count ?? 0}
                </button>
            </div>

            {showComments && (
                <div className="mt-4 space-y-3">
                    {comments.map((c) => (
                        <div key={c.id} className="flex gap-2 text-sm">
                            <span className="font-medium text-gray-900">{c.user?.name}</span>
                            <span className="text-gray-600">{c.content}</span>
                        </div>
                    ))}
                    {user && (
                        <form onSubmit={submitComment} className="flex gap-2 mt-2">
                            <input
                                value={comment} onChange={(e) => setComment(e.target.value)}
                                placeholder="Écrire un commentaire..."
                                className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button type="submit" className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700">
                                Envoyer
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default function FeedPage() {
    const { user }        = useAuth();
    const [posts, setPosts]   = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage]       = useState(1);
    const [hasMore, setHasMore] = useState(true);

    async function fetchPosts(p = 1) {
        const res = await api.get('/posts', { params: { page: p } });
        const data = res.data;
        if (p === 1) {
            setPosts(data.data);
        } else {
            setPosts((prev) => [...prev, ...data.data]);
        }
        setHasMore(data.current_page < data.last_page);
        setLoading(false);
    }

    useEffect(() => { fetchPosts(1); }, []);

    async function handlePublish(e) {
        e.preventDefault();
        if (!newPost.trim()) return;
        await api.post('/posts', { content: newPost });
        setNewPost('');
        fetchPosts(1);
    }

    async function handleLike(postId) {
        const res = await api.post(`/posts/${postId}/like`);
        setPosts((prev) => prev.map((p) =>
            p.id === postId
                ? { ...p, likes_count: res.data.likes_count, liked_by_me: res.data.liked }
                : p
        ));
    }

    async function handleDelete(postId) {
        await api.delete(`/posts/${postId}`);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
    }

    function handleComment(postId) {
        setPosts((prev) => prev.map((p) =>
            p.id === postId ? { ...p, comments_count: (p.comments_count ?? 0) + 1 } : p
        ));
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Fil d'actualité</h1>

            {user && (
                <form onSubmit={handlePublish} className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                    <textarea
                        value={newPost} onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Quoi de neuf ?"
                        rows={3}
                        className="w-full border-0 resize-none focus:outline-none text-gray-800 placeholder-gray-400"
                    />
                    <div className="flex justify-end border-t border-gray-100 pt-3">
                        <button
                            type="submit" disabled={!newPost.trim()}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium disabled:opacity-50"
                        >
                            Publier
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-center text-gray-500">Chargement...</p>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onLike={handleLike}
                            onComment={handleComment}
                            onDelete={handleDelete}
                        />
                    ))}
                    {hasMore && (
                        <button
                            onClick={() => { const next = page + 1; setPage(next); fetchPosts(next); }}
                            className="w-full text-center text-indigo-600 hover:underline py-3 text-sm"
                        >
                            Charger plus
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}