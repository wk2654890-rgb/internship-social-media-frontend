import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { usePosts } from "../context/PostContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Users, Heart, Pencil, UserPlus, UserMinus } from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  const { user, updateLocalUser } = useAuth();
  const { posts: feedPosts } = usePosts();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [avatarDraft, setAvatarDraft] = useState("");
  const [panel, setPanel] = useState(null);
  const [panelUsers, setPanelUsers] = useState([]);

  const isOwnProfile = user?.id === id;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/users/${id}`);
      setProfile(res.data.user);
      setBioDraft(res.data.user.bio);
      setAvatarDraft(res.data.user.avatar);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProfile(); }, [fetchProfile, feedPosts.length]);

  const isFollowing = profile && user ? profile.followedByIds.includes(user.id) : false;

  const toggleFollow = async () => {
    const res = await api.put(`/users/${id}/${isFollowing ? "unfollow" : "follow"}`);
    setProfile((prev) => ({
      ...prev,
      followedByIds: isFollowing
        ? prev.followedByIds.filter((uid) => uid !== user.id)
        : [...prev.followedByIds, user.id],
      followerCount: isFollowing ? prev.followerCount - 1 : prev.followerCount + 1,
    }));
    updateLocalUser({ followingIds: res.data.user.followingIds });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const res = await api.put("/users/me", { bio: bioDraft, avatar: avatarDraft });
    setProfile((prev) => ({ ...prev, bio: res.data.user.bio, avatar: res.data.user.avatar }));
    updateLocalUser({ bio: res.data.user.bio, avatar: res.data.user.avatar });
    setEditing(false);
  };

  const openPanel = async (type) => {
    setPanel(type);
    const res = await api.get(`/users/${id}/${type}`);
    setPanelUsers(type === "followers" ? res.data.followers : res.data.following);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Card className="p-6">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3.5 w-48" />
            <div className="flex gap-6">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) return <p className="text-center text-sm text-destructive py-16">{error}</p>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 ring-4 ring-primary/10 mb-4">
              <AvatarImage src={profile.avatar} alt={profile.username} />
              <AvatarFallback className="text-2xl font-bold">
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-xl font-bold text-foreground">@{profile.username}</h1>

            {!editing ? (
              <>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  {profile.bio || "No bio yet."}
                </p>

                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <p className="font-bold text-foreground">{profile.posts.length}</p>
                    <p className="text-xs text-muted-foreground">Posts</p>
                  </div>
                  <button onClick={() => openPanel("followers")} className="text-center hover:text-primary transition-colors">
                    <p className="font-bold text-foreground">{profile.followerCount}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </button>
                  <button onClick={() => openPanel("following")} className="text-center hover:text-primary transition-colors">
                    <p className="font-bold text-foreground">{profile.followingCount}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  {isOwnProfile ? (
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1.5">
                      <Pencil className="h-3.5 w-3.5" /> Edit Profile
                    </Button>
                  ) : (
                    user && (
                      <Button
                        size="sm"
                        variant={isFollowing ? "outline" : "default"}
                        onClick={toggleFollow}
                        className="gap-1.5"
                      >
                        {isFollowing
                          ? <><UserMinus className="h-3.5 w-3.5" /> Unfollow</>
                          : <><UserPlus className="h-3.5 w-3.5" /> Follow</>
                        }
                      </Button>
                    )
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={saveProfile} className="mt-4 w-full max-w-sm space-y-3 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Bio</label>
                  <Textarea
                    rows={3}
                    value={bioDraft}
                    onChange={(e) => setBioDraft(e.target.value)}
                    className="min-h-[72px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Avatar URL</label>
                  <Input
                    value={avatarDraft}
                    onChange={(e) => setAvatarDraft(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Posts</h2>
        <Badge variant="secondary" className="text-xs">{profile.posts.length}</Badge>
      </div>

      {profile.posts.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center p-0">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          </CardContent>
        </Card>
      )}

      {profile.posts.map((p) => {
        const live = feedPosts.find((fp) => fp.id === p.id);
        if (live) return <PostCard key={p.id} post={live} />;
        return (
          <Card key={p.id} className="mb-3">
            <CardContent className="p-4">
              <p className="text-sm leading-relaxed">{p.content}</p>
              {p.image && (
                <div className="mt-3 rounded-lg overflow-hidden border border-border">
                  <img src={p.image} alt="post attachment" className="w-full max-h-80 object-cover" />
                </div>
              )}
              <Separator className="my-3" />
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {p.likedByIds.length}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={!!panel} onOpenChange={() => setPanel(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {panel === "followers" ? "Followers" : "Following"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {panelUsers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nobody here yet.</p>
            )}
            {panelUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={u.avatar} alt={u.username} />
                  <AvatarFallback className="text-xs">{u.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">@{u.username}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
