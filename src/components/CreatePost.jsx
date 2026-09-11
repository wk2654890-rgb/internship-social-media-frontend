import { useState } from "react";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Send } from "lucide-react";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { addPost } = usePosts();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await addPost(content.trim(), image.trim());
      setContent("");
      setImage("");
      setShowImage(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/10">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder={`What's on your mind, ${user?.username}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0 resize-none"
            />
            {showImage && (
              <Input
                type="text"
                placeholder="Paste an image URL..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="mt-2 h-8 text-xs"
              />
            )}
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>
        </div>

        <Separator className="my-3" />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImage((s) => !s)}
            className="gap-1.5 text-muted-foreground h-8 text-xs"
          >
            <ImageIcon className="h-4 w-4" />
            Image
          </Button>
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={submitting || !content.trim()}
            className="gap-1.5 h-8"
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
