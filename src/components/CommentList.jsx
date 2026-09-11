import { useState } from "react";
import { Link } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Send } from "lucide-react";

export default function CommentList({ post, onAuthPrompt }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addComment, removeComment } = usePosts();
  const { user } = useAuth();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return onAuthPrompt?.();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await addComment(post.id, text.trim());
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      {post.comments.length === 0 && (
        <p className="text-xs text-muted-foreground py-1">No comments yet. Be the first!</p>
      )}

      {post.comments.map((c) => (
        <div key={c.id} className="flex items-start gap-2 group">
          <Link to={`/profile/${c.author.id}`}>
            <Avatar className="h-7 w-7">
              <AvatarImage src={c.author.avatar} alt={c.author.username} />
              <AvatarFallback className="text-[10px]">{c.author.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="bg-muted rounded-xl px-3 py-2">
              <Link
                to={`/profile/${c.author.id}`}
                className="text-xs font-semibold text-foreground hover:text-primary"
              >
                {c.author.username}
              </Link>
              <p className="text-xs text-foreground mt-0.5">{c.content}</p>
            </div>
          </div>
          {user?.id === c.author.id && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              onClick={() => removeComment(post.id, c.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}

      <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
        {user && (
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="text-[10px]">{user.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        <Input
          placeholder={user ? "Write a comment..." : "Sign in to comment..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => { if (!user) onAuthPrompt?.(); }}
          className="h-8 text-xs rounded-full bg-muted border-0 focus-visible:ring-1"
          readOnly={!user}
        />
        {user && (
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 shrink-0"
            disabled={submitting || !text.trim()}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        )}
      </form>
    </div>
  );
}
