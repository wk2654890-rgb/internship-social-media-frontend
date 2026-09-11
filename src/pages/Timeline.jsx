import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import AuthPromptDialog from "../components/AuthPromptDialog";
import api from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Home, Compass, User, TrendingUp, Users, FileText, Hash,
  UserPlus, Sparkles,
} from "lucide-react";

function LeftSidebar({ user }) {
  return (
    <aside className="hidden lg:flex flex-col gap-3 w-64 shrink-0">
      <Card>
        <CardContent className="p-3">
          <nav className="space-y-1">
            {[
              { to: "/", icon: Home, label: "Timeline" },
              { to: "/users", icon: Compass, label: "Discover" },
              ...(user ? [{ to: `/profile/${user.id}`, icon: User, label: "My Profile" }] : []),
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>

      {user && (
        <Card>
          <CardContent className="p-4">
            <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">@{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user.bio || "No bio yet"}</p>
              </div>
            </Link>
            <Separator className="my-3" />
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-foreground">{user.followingIds?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{user.followedByIds?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </aside>
  );
}

function RightSidebar({ user }) {
  const [suggested, setSuggested] = useState([]);
  const [authPrompt, setAuthPrompt] = useState(false);
  const { user: authUser, updateLocalUser } = useAuth();

  const fetchSuggested = useCallback(async () => {
    try {
      const res = await api.get("/users", { params: { limit: 4 } });
      setSuggested(res.data.users.filter((u) => u.id !== authUser?.id).slice(0, 4));
    } catch {}
  }, [authUser?.id]);

  useEffect(() => { fetchSuggested(); }, [fetchSuggested]);

  const toggleFollow = async (target) => {
    if (!authUser) return setAuthPrompt(true);
    const isFollowing = target.followedByIds.includes(authUser.id);
    const res = await api.put(`/users/${target.id}/${isFollowing ? "unfollow" : "follow"}`);
    setSuggested((prev) =>
      prev.map((u) =>
        u.id === target.id
          ? {
              ...u,
              followedByIds: isFollowing
                ? u.followedByIds.filter((id) => id !== authUser.id)
                : [...u.followedByIds, authUser.id],
            }
          : u
      )
    );
    updateLocalUser({ followingIds: res.data.user.followingIds });
  };

  const trendingTopics = ["#WebDev", "#OpenSource", "#UIDesign", "#ReactJS", "#TypeScript"];

  return (
    <>
      <aside className="hidden xl:flex flex-col gap-3 w-72 shrink-0">
        <Card>
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Suggested to Follow
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 space-y-3">
            {suggested.length === 0 && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {suggested.map((u) => {
              const isFollowing = authUser ? u.followedByIds.includes(authUser.id) : false;
              return (
                <div key={u.id} className="flex items-center gap-2">
                  <Link to={`/profile/${u.id}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.avatar} alt={u.username} />
                      <AvatarFallback className="text-xs">{u.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/profile/${u.id}`}
                      className="text-xs font-semibold text-foreground hover:text-primary truncate block"
                    >
                      @{u.username}
                    </Link>
                    <p className="text-[11px] text-muted-foreground">
                      {u.followedByIds.length} followers
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={isFollowing ? "outline" : "default"}
                    className="h-6 px-2 text-[11px]"
                    onClick={() => toggleFollow(u)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              );
            })}
            <Button variant="ghost" size="sm" className="w-full text-xs text-primary h-7 mt-1" asChild>
              <Link to="/users">See all</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs cursor-pointer hover:bg-primary/10 transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Platform Stats</p>
            </div>
            <div className="space-y-2">
              {[
                { icon: Users, label: "Active Users", value: "1.2K+" },
                { icon: FileText, label: "Posts Today", value: "340+" },
                { icon: Hash, label: "Topics", value: "89" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </div>
                  <Badge variant="outline" className="text-xs h-5">{value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>

      <AuthPromptDialog open={authPrompt} onClose={() => setAuthPrompt(false)} />
    </>
  );
}

export default function Timeline() {
  const { posts, loading, error, fetchFeed } = usePosts();
  const { user } = useAuth();

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  const PostSkeletons = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex gap-6 items-start">
        <LeftSidebar user={user} />

        <main className="flex-1 min-w-0">
          {!user && (
            <Card className="mb-4 border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Welcome to EXPS Nexus</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sign in to post, like, comment, and follow people.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">Join Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {user && <CreatePost />}

          <Tabs defaultValue="latest">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="latest" className="flex-1 sm:flex-none gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Latest
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex-1 sm:flex-none gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Trending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latest">
              {loading && posts.length === 0 && <PostSkeletons />}
              {error && <p className="text-sm text-destructive text-center py-8">{error}</p>}
              {!loading && posts.length === 0 && !error && (
                <Card className="py-16">
                  <CardContent className="text-center p-0">
                    <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">No posts yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Be the first to share something!</p>
                  </CardContent>
                </Card>
              )}
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </TabsContent>

            <TabsContent value="trending">
              {[...posts]
                .sort((a, b) => b.likedByIds.length - a.likedByIds.length)
                .map((post) => <PostCard key={post.id} post={post} />)}
              {posts.length === 0 && (
                <Card className="py-16">
                  <CardContent className="text-center p-0">
                    <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No trending posts yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>

        <RightSidebar user={user} />
      </div>
    </div>
  );
}
