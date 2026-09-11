import { useState } from "react";
import { Link } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import CommentList from "./CommentList";
import AuthPromptDialog from "./AuthPromptDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    ["y", 31536000], ["mo", 2592000], ["d", 86400], ["h", 3600], ["m", 60],
  ];
  for (const [label, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return "just now";
}

export default function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [authPrompt, setAuthPrompt] = useState(false);
  const { toggleLike, removePost } = usePosts();
  const { user } = useAuth();

  const liked = user ? post.likedByIds.includes(user.id) : false;
  const isOwner = user?.id === post.author.id;

  const handleLike = () => {
    if (!user) return setAuthPrompt(true);
    toggleLike(post.id);
  };

  const handleComment = () => {
    if (!user) return setAuthPrompt(true);
    setShowComments((s) => !s);
  };

  return (
    <>
      <Card className="mb-3 transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Link to={`/profile/${post.author.id}`}>
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <AvatarImage src={post.author.avatar} alt={post.author.username} />
                <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to={`/profile/${post.author.id}`}
                    className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
                  >
                    {post.author.username}
                  </Link>
                  <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
                </div>

                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 -mr-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => removePost(post.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {post.content}
              </p>

              {post.image && (
                <div className="mt-3 rounded-lg overflow-hidden border border-border">
                  <img
                    src={post.image}
                    alt="post attachment"
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}

              <Separator className="mt-3 mb-2" />

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`gap-1.5 h-8 px-2.5 text-xs font-semibold transition-colors ${
                    liked
                      ? "text-red-500 hover:text-red-500 hover:bg-red-50"
                      : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
                  {post.likedByIds.length}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleComment}
                  className="gap-1.5 h-8 px-2.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5"
                >
                  <MessageCircle className="h-4 w-4" />
                  {post.comments.length}
                </Button>
              </div>

              {showComments && <CommentList post={post} onAuthPrompt={() => setAuthPrompt(true)} />}
            </div>
          </div>
        </CardContent>
      </Card>

      <AuthPromptDialog open={authPrompt} onClose={() => setAuthPrompt(false)} />
    </>
  );
}
