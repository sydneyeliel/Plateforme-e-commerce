import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const FEED_POST_IMGS = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA0GPn3Jt_mOlS2srA2qh9YfZiAQfWzG2nVktcK5Wjr5zew9yvuj6WjB_sgobinnWFedrzdU2ror3uiTkSIklAIUOr6utyc3igIeUuppmKGw_lB9wZXfYEbdkGocFD8AizZ3yfveBBr7l-RFj-lBFSbXUvO_tPCUAsr7n3dmYqye75V4LGY2Jy6loDFeFguJRWUBfxSraxZVcI66hOeyCpXBHVGSJzo3yrieRlkUV3-4tGDQUAC35rOMMlYN-BO9xcD1e9GobF1rxE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAjm_gfch_Ob4GkaDHMCtmBVjuA85Q1Ds-0pczv0EyYQepLMZq6UG5YAPhlHbI_5_HL-qcEoih2rOiDVEzsnNrqpUdNDHnwtW9sCzXAcRnAxPj4_9cTSinap3d8q3gTZqSlh1mOWrTHntVIIYnLVOPkpieMS522wGBUdkBKCWAPIlHFu9kWFjiTEQaowH6YTrHCwbT01BxWgJb3jfAxZUyz22_tA2AM_A8Ms_EcWB_sp80ahmaf8r-zCe4sOeFiE47naNCmebYggGw',
];

const TRENDING = [
    { name:'Solar Flare V1', by:'Studio Lux', price:'0.4 ETH', img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCLPYPbD5afTCW0QW8xo26l_JV83-WR2DDy6fOLYRpC9c49wQRjXtJt96dIQblzbC4g_2GfX_gmq389xjbGC4Ivu3A4LrAG3l6VaQKTjj6pxKtVx22p9QUYtxN3IS7WYLfFmAW9epG0ZR89RA1RidYQvSfFyFP0pnNizt8MgqkiFnKnP8tUvE3o5owvp-pzuzVV-R0CRLGS5YvvYOmGJzaZWb9LRrwmsJ-Ya9uKSYEBHq-V5of7kmrCItepYhkKIO5vvoSDEIYPq7w' },
    { name:'Kinetix Runners', by:'AeroGear', price:'0.2 ETH', img:'https://lh3.googleusercontent.com/aida-public/AB6AXuDUW3ULYsezlKrL6oRv73xCkxwTvHXPdn7jpyH7IpJ-QNNxKQeuJE_LwN06Bz7hNDqwQbvUe-ai6ixsJ6uVTYYu3o4edwPeG1AHgXIYTK5avPl4HlFEd9bV2_BC5DeYIcOTSuIbsMkqnvscBb4uN91wp8_2qP679_uGrLSGDvvVqJ_kzWa4xjVyftFcTDxxqikoHw4cCmoKHJjOkr8tDYg98PfBUGCo9sHoWE1DfVPT2hk9SfiQElfdL1lrcRiAm9ze-oSdgpCdAcw' },
    { name:'Mercury Fluid', by:'LiquidLabs', price:'0.8 ETH', img:'https://lh3.googleusercontent.com/aida-public/AB6AXuBtxhV19uEorlIxTZTKhXY8j4Pn-LOvwNvIYuROyLwjFRFo3KonyEijihBDjc7DLbwq1ZcB46UFjJiLp-cgx0gfd560ArRvrZuQBkUfZqMduiTotkap6SfQQKiO3f8s08qSsuYX3OKb1EFlN1FE1rM8TwHJBcIGI7U5JRX2DYtv4ZJ0gBAkUd6JP0vzGJtnUNpWTcN5m4wSXDCzlYXAjR9qzLyvaYlHzUEz7fcsDwSlfcGyHchjcFKTYDonIdlvCSy-0laiDO-U9u4' },
];

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

    const img = post.image || FEED_POST_IMGS[post.id % 2];

    return (
        <article className="rounded-[1.5rem] overflow-hidden group"
            style={{background:'#ffffff', boxShadow:'0px 20px 40px rgba(26,28,28,0.06)'}}>
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-3 items-center">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                            style={{background:'linear-gradient(to bottom right, #9d4300, #f97316)', fontSize:'1rem'}}>
                            {post.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">{post.user?.name}</h4>
                            <p className="text-[10px] uppercase tracking-wider" style={{color:'#584237'}}>
                                {new Date(post.created_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                    {user?.id === post.user_id && (
                        <button onClick={() => onDelete(post.id)} style={{color:'#584237'}} className="hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                    )}
                </div>
                <p className="leading-relaxed mb-4" style={{fontSize:'0.95rem'}}>{post.content}</p>
            </div>

            <div className="relative px-6 pb-2">
                <img src={img} alt="" className="w-full object-cover rounded-[1rem]" style={{aspectRatio:'16/9'}}/>
            </div>

            <div className="px-6 pb-6 pt-4">
                <div className="flex justify-between items-center pt-4" style={{borderTop:'1px solid rgba(224,192,177,0.1)'}}>
                    <div className="flex gap-6">
                        <button onClick={() => onLike(post.id)}
                            className="flex items-center gap-2 transition-colors hover:text-red-500"
                            style={{color: post.liked_by_me ? '#ef4444' : '#584237'}}>
                            <span className="material-symbols-outlined" style={post.liked_by_me ? {fontVariationSettings:"'FILL' 1"} : {}}>favorite</span>
                            <span className="text-xs font-semibold">{post.likes_count ?? 0}</span>
                        </button>
                        <button onClick={showComments ? () => setShowComments(false) : loadComments}
                            className="flex items-center gap-2 transition-colors hover:text-[#9d4300]" style={{color:'#584237'}}>
                            <span className="material-symbols-outlined">chat_bubble</span>
                            <span className="text-xs font-semibold">{post.comments_count ?? 0}</span>
                        </button>
                        <button className="flex items-center gap-2 transition-colors hover:text-[#9d4300]" style={{color:'#584237'}}>
                            <span className="material-symbols-outlined">share</span>
                        </button>
                    </div>
                    <button className="transition-colors hover:text-[#9d4300]" style={{color:'#584237'}}>
                        <span className="material-symbols-outlined">bookmark_border</span>
                    </button>
                </div>

                {showComments && (
                    <div className="mt-4 space-y-3">
                        {comments.map((c) => (
                            <div key={c.id} className="flex gap-2 text-sm">
                                <span className="font-bold">{c.user?.name}</span>
                                <span style={{color:'#584237'}}>{c.content}</span>
                            </div>
                        ))}
                        {user && (
                            <form onSubmit={submitComment} className="flex gap-2 mt-2">
                                <input value={comment} onChange={(e) => setComment(e.target.value)}
                                    placeholder="Écrire un commentaire..."
                                    className="flex-1 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                                    style={{background:'#f3f4f3', border:'1px solid rgba(224,192,177,0.2)'}}/>
                                <button type="submit"
                                    className="px-3 py-1.5 rounded-lg text-sm text-white font-semibold"
                                    style={{background:'linear-gradient(to right, #9d4300, #f97316)'}}>
                                    Envoyer
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}

export default function FeedPage() {
    const { user }               = useAuth();
    const { addToast }           = useToast();
    const textareaRef            = useRef(null);
    const [posts, setPosts]      = useState([]);
    const [newPost, setNewPost]  = useState('');
    const [imageFile, setImageFile]       = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading]  = useState(true);
    const [posting, setPosting]  = useState(false);
    const [postError, setPostError] = useState('');
    const [page, setPage]        = useState(1);
    const [hasMore, setHasMore]  = useState(true);
    const fileInputRef           = useRef(null);

    async function fetchPosts(p = 1) {
        const res = await api.get('/posts', { params: { page: p } });
        const data = res.data;
        if (p === 1) setPosts(data.data);
        else setPosts((prev) => [...prev, ...data.data]);
        setHasMore(data.current_page < data.last_page);
        setLoading(false);
    }

    useEffect(() => { fetchPosts(1); }, []);

    function insertMention() {
        const ta = textareaRef.current;
        if (!ta) return;
        const pos = ta.selectionStart;
        const before = newPost.slice(0, pos);
        const after  = newPost.slice(pos);
        const updated = before + '@' + after;
        setNewPost(updated);
        setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = pos + 1; }, 0);
    }

    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function removeImage() {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handlePublish(e) {
        e.preventDefault();
        if (!newPost.trim() || posting) return;
        setPostError('');
        setPosting(true);
        try {
            const formData = new FormData();
            formData.append('content', newPost);
            if (imageFile) formData.append('image', imageFile);

            await api.post('/posts', formData, {
                headers: { 'Content-Type': null },
            });

            setNewPost('');
            removeImage();
            fetchPosts(1);
        } catch (err) {
            setPostError(err.response?.status === 401
                ? 'Vous devez être connecté pour publier.'
                : 'Erreur lors de la publication. Réessayez.');
        } finally {
            setPosting(false);
        }
    }

    async function handleLike(postId) {
        const res = await api.post(`/posts/${postId}/like`);
        setPosts((prev) => prev.map((p) =>
            p.id === postId ? { ...p, likes_count: res.data.likes_count, liked_by_me: res.data.liked } : p
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
        <div style={{background:'#f9f9f8', color:'#1a1c1c', minHeight:'100vh'}}>
            <main className="max-w-[1440px] mx-auto pt-24 pb-12 px-8 flex gap-12">

                {/* Left Sidebar */}
                <aside className="w-[220px] flex-shrink-0 sticky top-24 h-fit hidden lg:block">
                    <div className="rounded-[1.5rem] p-6 mb-8 text-center"
                        style={{background:'#ffffff', boxShadow:'0px 20px 40px rgba(26,28,28,0.04)'}}>
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4"
                            style={{background:'linear-gradient(to bottom right, #9d4300, #f97316)'}}>
                            {user?.name?.[0]?.toUpperCase() ?? 'A'}
                        </div>
                        <h3 className="font-bold">{user?.name ?? 'Alex Rivera'}</h3>
                        <p className="text-xs mb-6" style={{color:'#584237'}}>3D Sculptor</p>
                        <div className="flex justify-between items-center px-2">
                            <div>
                                <div className="font-bold text-sm">{posts.length}</div>
                                <div style={{fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', color:'#584237'}}>Posts</div>
                            </div>
                            <div style={{width:1, height:24, background:'rgba(224,192,177,0.2)'}}/>
                            <div>
                                <div className="font-bold text-sm">4.2k</div>
                                <div style={{fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', color:'#584237'}}>Followers</div>
                            </div>
                        </div>
                    </div>
                    <nav className="space-y-2">
                        {[{icon:'dynamic_feed', label:'My Feed', active:true},{icon:'explore', label:'Explore'},{icon:'bookmark', label:'Saved'}].map(item => (
                            <a key={item.label} href="#"
                                className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all"
                                style={item.active ? {background:'#f3f4f3', color:'#9d4300', fontWeight:700} : {color:'#584237'}}>
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </aside>

                {/* Center Feed */}
                <section className="flex-grow max-w-[680px]">
                    {user && (
                        <div className="rounded-[1.5rem] p-6 mb-8"
                            style={{background:'#ffffff', boxShadow:'0px 20px 40px rgba(26,28,28,0.04)'}}>
                            <form onSubmit={handlePublish}>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                                        style={{background:'linear-gradient(to right, #9d4300, #f97316)'}}>
                                        {user.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-grow">
                                        <textarea ref={textareaRef} value={newPost} onChange={(e) => setNewPost(e.target.value)}
                                            placeholder="Share your latest creation..."
                                            rows={3}
                                            className="w-full rounded-xl p-4 text-sm focus:outline-none resize-none min-h-[100px]"
                                            style={{background:'#f3f4f3', border:'none'}}/>

                                        {/* Preview image */}
                                        {imagePreview && (
                                            <div className="relative mt-3 rounded-xl overflow-hidden">
                                                <img src={imagePreview} alt="preview"
                                                    className="w-full object-cover rounded-xl" style={{maxHeight: 200}}/>
                                                <button type="button" onClick={removeImage}
                                                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white"
                                                    style={{background:'rgba(0,0,0,0.55)'}}>
                                                    <span className="material-symbols-outlined" style={{fontSize:16}}>close</span>
                                                </button>
                                            </div>
                                        )}

                                        {postError && (
                                            <p className="text-xs mt-2 px-1" style={{color:'#c0392b'}}>{postError}</p>
                                        )}

                                        {/* Input fichier caché */}
                                        <input ref={fileInputRef} type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            className="hidden" onChange={handleImageSelect}/>

                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex gap-4">
                                                <button type="button" onClick={() => fileInputRef.current?.click()}
                                                    className="transition-colors hover:text-[#9d4300]"
                                                    style={{color: imageFile ? '#9d4300' : '#584237'}}
                                                    title="Ajouter une image">
                                                    <span className="material-symbols-outlined">image</span>
                                                </button>
                                                <button type="button"
                                                    onClick={() => addToast('Attachement 3D bientôt disponible', 'info')}
                                                    className="transition-colors hover:text-[#9d4300]"
                                                    style={{color:'#584237'}}
                                                    title="Objet 3D (bientôt)">
                                                    <span className="material-symbols-outlined">view_in_ar</span>
                                                </button>
                                                <button type="button"
                                                    onClick={insertMention}
                                                    className="transition-colors hover:text-[#9d4300]"
                                                    style={{color:'#584237'}}
                                                    title="Mentionner quelqu'un">
                                                    <span className="material-symbols-outlined">alternate_email</span>
                                                </button>
                                            </div>
                                            <button type="submit" disabled={!newPost.trim() || posting}
                                                className="px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 active:scale-95"
                                                style={{background:'linear-gradient(to right, #9d4300, #f97316)'}}>
                                                {posting ? 'Publication...' : 'Post'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <p className="text-center py-20" style={{color:'#584237'}}>Chargement...</p>
                    ) : (
                        <div className="space-y-12">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post}
                                    onLike={handleLike} onComment={handleComment} onDelete={handleDelete}/>
                            ))}
                            {hasMore && (
                                <button onClick={() => { const next = page + 1; setPage(next); fetchPosts(next); }}
                                    className="w-full text-center py-3 text-sm font-semibold transition-colors hover:text-[#9d4300]"
                                    style={{color:'#584237'}}>
                                    Charger plus
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* Right Sidebar */}
                <aside className="w-[260px] flex-shrink-0 space-y-12 hidden xl:block">
                    <div>
                        <h4 style={{fontSize:'10px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#584237', marginBottom:24}}>
                            Trending Objects
                        </h4>
                        <div className="space-y-4">
                            {TRENDING.map((item) => (
                                <div key={item.name} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden" style={{background:'#f3f4f3'}}>
                                        <img src={item.img} alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold truncate w-32">{item.name}</p>
                                        <p className="text-[10px]" style={{color:'#584237'}}>{item.by}</p>
                                    </div>
                                    <span className="text-[10px] font-bold ml-auto" style={{color:'#9d4300'}}>{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 text-[10px] font-bold uppercase tracking-widest hover:underline underline-offset-4 transition-colors"
                            style={{color:'#9d4300'}}>
                            View All Marketplace
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
}
