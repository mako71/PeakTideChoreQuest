import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Mountain } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        await register(username, password);
        toast({
          title: "Account created! 🎉",
          description: "Welcome to Basecamp. Let's set up your household.",
        });
      } else {
        await login(username, password);
        toast({
          title: "Welcome back!",
          description: "Logging you in...",
        });
      }
      navigate("/setup");
    } catch (error) {
      toast({
        title: "Error",
        description: isSignup ? "Failed to create account" : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2 text-accent">
            <Mountain className="w-6 h-6" />
            <span className="text-lg font-bold">Basecamp</span>
          </div>
          <div>
            <CardTitle className="text-2xl">{isSignup ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isSignup ? "Join your household expedition" : "Log in to your household"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading} data-testid="button-submit">
              {loading ? "Loading..." : isSignup ? "Create Account" : "Login"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  {isSignup ? "Already have an account?" : "Don't have an account?"}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsSignup(!isSignup)}
              data-testid="button-toggle-mode"
            >
              {isSignup ? "Login Instead" : "Create New Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
