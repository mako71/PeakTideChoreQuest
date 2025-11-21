import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Compass, Users } from "lucide-react";

export default function SetupHousehold() {
  const [householdName, setHouseholdName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/households", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: householdName }),
      });

      if (!res.ok) {
        throw new Error("Failed to create household");
      }

      toast({
        title: "Household Created! 🏠",
        description: `${householdName} is ready for your expedition.`,
        className: "bg-primary text-primary-foreground border-none",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create household",
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
            <Compass className="w-6 h-6" />
            <span className="text-lg font-bold">Setup Your Household</span>
          </div>
          <div>
            <CardTitle className="text-2xl">Let's Begin Your Expedition</CardTitle>
            <CardDescription>Create a household where your crew can collaborate</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateHousehold} className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <p className="font-medium">Welcome, {user?.username}!</p>
              </div>
              <p className="text-sm text-muted-foreground">You'll be the household manager and can invite others later.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="household-name">Household Name</Label>
              <Input
                id="household-name"
                type="text"
                placeholder="e.g., Mountain Peak House, Ocean View Lodge"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                required
                data-testid="input-household-name"
              />
              <p className="text-xs text-muted-foreground">This is your team's expedition base name</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !householdName} data-testid="button-create-household">
              {loading ? "Creating..." : "Create Household 🏕️"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
