import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Welcome back to EXPS Nexus</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>Enter your credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
