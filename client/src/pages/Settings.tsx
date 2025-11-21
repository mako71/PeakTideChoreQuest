import { Navigation } from "@/components/layout/Navigation";
import { InviteDialog } from "@/components/settings/InviteDialog";
import { USERS } from "@/lib/data";
import { useAppSettings } from "@/lib/context";
import { useToast } from "@/hooks/use-toast";
import { Settings, Users, Bell, Palette, Shield, HelpCircle, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import generatedMap from "@assets/generated_images/topographic_map_pattern_texture.png";

export default function SettingsPage() {
  const { notifications, setNotifications, darkMode, setDarkMode, soundEnabled, setSoundEnabled, selectedTheme, setSelectedTheme } = useAppSettings();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Navigation />
      
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 relative">
        <div 
          className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-repeat" 
          style={{ backgroundImage: `url(${generatedMap})`, backgroundSize: '400px' }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8 space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-display font-bold mb-1 flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              Settings & Gear
            </h1>
            <p className="text-muted-foreground">Customize your household expedition experience</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">

              {/* Notification Settings */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Control how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Quest Notifications</p>
                      <p className="text-sm text-muted-foreground">Get alerts for new quests and assignments</p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Completion Reminders</p>
                      <p className="text-sm text-muted-foreground">Daily reminders for uncompleted tasks</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Sound Effects</p>
                      <p className="text-sm text-muted-foreground">Play sounds for quest completion</p>
                    </div>
                    <Switch 
                      checked={soundEnabled} 
                      onCheckedChange={(checked) => {
                        setSoundEnabled(checked);
                        if (soundEnabled) {
                          // Play a notification sound effect
                          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                          const oscillator = audioContext.createOscillator();
                          const gain = audioContext.createGain();
                          oscillator.connect(gain);
                          gain.connect(audioContext.destination);
                          oscillator.frequency.value = 800;
                          gain.gain.setValueAtTime(0.3, audioContext.currentTime);
                          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                          oscillator.start(audioContext.currentTime);
                          oscillator.stop(audioContext.currentTime + 0.1);
                        }
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Display Settings */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-secondary" />
                    Display
                  </CardTitle>
                  <CardDescription>Customize your interface</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Easier on the eyes during night expeditions</p>
                    </div>
                    <Switch 
                      checked={darkMode} 
                      onCheckedChange={(checked) => {
                        setDarkMode(checked);
                        if (checked) {
                          document.documentElement.classList.add("dark");
                        } else {
                          document.documentElement.classList.remove("dark");
                        }
                        toast({
                          title: checked ? "Dark Mode Activated" : "Light Mode Activated",
                          description: `Switched to ${checked ? "dark" : "light"} theme. Enjoy your expedition!`,
                        });
                      }} 
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Color Theme</Label>
                    <div className="flex gap-3">
                      {[
                        { name: "Forest", id: "forest", colors: "from-primary to-secondary" },
                        { name: "Ocean", id: "ocean", colors: "from-blue-500 to-cyan-500" },
                        { name: "Sunset", id: "sunset", colors: "from-orange-500 to-red-500" },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setSelectedTheme(theme.id);
                            toast({
                              title: `${theme.name} Theme Activated`,
                              description: `Your household expedition now has the ${theme.name} aesthetic.`,
                            });
                          }}
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${theme.colors} cursor-pointer transition-all ${
                            selectedTheme === theme.id ? "ring-2 ring-offset-2 ring-foreground scale-110" : "hover:ring-2 ring-offset-2 ring-foreground/30"
                          }`}
                          title={theme.name}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Household Members */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Household Members
                  </CardTitle>
                  <CardDescription>Manage your expedition crew</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {USERS.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">Level {user.level} • {user.xp} XP</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast({
                          title: "Member removed",
                          description: `${user.name} has been removed from the household.`,
                        })}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  <InviteDialog />
                </CardContent>
              </Card>

              {/* Privacy & Security */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-destructive" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Keep your expedition data safe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">Let household members see your profile</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Show XP Progress</p>
                      <p className="text-sm text-muted-foreground">Display your stats on the leaderboard</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast({
                      title: "Change Password",
                      description: "Password change link has been sent to your email.",
                    })}
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="border-border bg-gradient-to-br from-primary/10 to-secondary/10">
                <CardHeader>
                  <CardTitle className="text-base">Your Household</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-bold">{USERS.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Household Level</span>
                    <span className="font-bold text-primary">15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-bold">3 months ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={() => toast({
                      title: "Tutorial",
                      description: "Check out our Getting Started guide on the help docs.",
                    })}
                  >
                    📖 View Tutorial
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={() => toast({
                      title: "Bug Reported",
                      description: "Thanks! Our team will investigate this issue.",
                    })}
                  >
                    🐛 Report Bug
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={() => toast({
                      title: "Feedback Sent",
                      description: "We appreciate your suggestions for improvement!",
                    })}
                  >
                    💡 Send Feedback
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={() => toast({
                      title: "FAQ",
                      description: "Browse our frequently asked questions.",
                    })}
                  >
                    ❓ FAQ
                  </Button>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-sm h-auto py-2 border-destructive/50 hover:bg-destructive/10"
                    onClick={() => toast({
                      title: "Progress Reset",
                      description: "Your household expedition progress has been reset. All quests and XP cleared.",
                    })}
                  >
                    Reset Progress
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive text-sm h-auto py-2"
                    onClick={() => toast({
                      title: "Logged Out",
                      description: "See you next time, Ranger! 👋",
                    })}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
