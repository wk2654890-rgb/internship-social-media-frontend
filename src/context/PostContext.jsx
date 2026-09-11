import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const PostContext = createContext(null);

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/posts");
      setPosts(res.data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = useCallback(async (content, image) => {
    const res = await api.post("/posts", { content, image });
    setPosts((prev) => [res.data.post, ...prev]);
    return res.data.post;
  }, []);

  const removePost = useCallback(async (postId) => {
    await api.delete(`/posts/${postId}`);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const toggleLike = useCallback(async (postId) => {
    if (!user) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const alreadyLiked = p.likedByIds.includes(user.id);
        return {
          ...p,
          likedByIds: alreadyLiked
            ? p.likedByIds.filter((id) => id !== user.id)
            : [...p.likedByIds, user.id],
        };
      })
    );

    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts((prev) => prev.map((p) => (p.id === postId ? res.data.post : p)));
    } catch {
      fetchFeed();
    }
  }, [user, fetchFeed]);

  const addComment = useCallback(async (postId, content) => {
    const res = await api.post(`/posts/${postId}/comments`, { content });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, res.data.comment] } : p
      )
    );
    return res.data.comment;
  }, []);

  const removeComment = useCallback(async (postId, commentId) => {
    await api.delete(`/comments/${commentId}`);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p
      )
    );
  }, []);

  return (
    <PostContext.Provider value={{
      posts, loading, error,
      fetchFeed, addPost, removePost, toggleLike, addComment, removeComment,
    }}>
      {children}
    </PostContext.Provider>
  );
}

export const usePosts = () => useContext(PostContext);
