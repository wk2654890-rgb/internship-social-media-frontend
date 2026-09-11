import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthPromptDialog from "../components/AuthPromptDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users, UserPlus } from "lucide-react";

export default function Discover() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [authPrompt, setAuthPrompt] = useState(false);
  const { user, updateLocalUser } = useAuth();

  const fetchUsers = useCallback(async (term = "") => {
    setLoading(true);
    try {
      const res = await api.get("/users", { params: term ? { search: term } : {} });
      setUsers(res.data.users.filter((u) => u.id !== user?.id));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const isFollowing = (target) => user && target.followedByIds.includes(user.id);

  const toggleFollow = async (target) => {
    if (!user) return setAuthPrompt(true);
    const following = isFollowing(target);
    const res = await api.put(`/users/${target.id}/${following ? "unfollow" : "follow"}`);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === target.id
          ? {
              ...u,
              followedByIds: following
                ? u.followedByIds.filter((id) => id !== user.id)
                : [...u.followedByIds, user.id],
            }
          : u
      )
    );
    updateLocalUser({ followingIds: res.data.user.followingIds });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Discover People
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find and connect with people on EXPS Nexus.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by username or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && users.length === 0 && (
        <Card className="py-16">
          <CardContent className="text-center p-0">
            <UserPlus className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">No users found</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search term.</p>
          </CardContent>
        </Card>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <Card key={u.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                <Link to={`/profile/${u.id}`}>
                  <Avatar className="h-16 w-16 ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                    <AvatarImage src={u.avatar} alt={u.username} />
                    <AvatarFallback className="text-lg font-bold">
                      {u.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="min-w-0 w-full">
                  <Link
                    to={`/profile/${u.id}`}
                    className="font-semibold text-sm text-foreground hover:text-primary transition-colors block"
                  >
                    @{u.username}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {u.bio || "No bio yet."}
                  </p>
                </div>

                <Badge variant="secondary" className="text-xs">
                  {u.followedByIds.length} followers
                </Badge>

                <Button
                  size="sm"
                  variant={isFollowing(u) ? "outline" : "default"}
                  className="w-full h-8"
                  onClick={() => toggleFollow(u)}
                >
                  {isFollowing(u) ? "Following" : "Follow"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AuthPromptDialog open={authPrompt} onClose={() => setAuthPrompt(false)} />
    </div>
  );
}
