import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", bio: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
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
          <p className="text-xs text-muted-foreground">Join the EXPS Nexus community</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>Start sharing and connecting with people.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Username</label>
                <Input
                  name="username"
                  required
                  value={form.username}
                  onChange={handleChange}
                  placeholder="janedoe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Bio <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Textarea
                  name="bio"
                  rows={2}
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  className="min-h-[60px]"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
