import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { USERS } from "@/lib/data";
import { Settings, Users, Bell, Palette, Shield, HelpCircle, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import generatedMap from "@assets/generated_images/topographic_map_pattern_texture.png";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

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
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
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
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Color Theme</Label>
                    <div className="flex gap-3">
                      {[
                        { name: "Forest", colors: "from-primary to-secondary" },
                        { name: "Ocean", colors: "from-blue-500 to-cyan-500" },
                        { name: "Sunset", colors: "from-orange-500 to-red-500" },
                      ].map((theme) => (
                        <button
                          key={theme.name}
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${theme.colors} cursor-pointer hover:ring-2 ring-offset-2 ring-foreground transition-all`}
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
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    + Invite Member
                  </Button>
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

                  <Button variant="outline" className="w-full">
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
                  <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2">
                    📖 View Tutorial
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2">
                    🐛 Report Bug
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2">
                    💡 Send Feedback
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2">
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
                  <Button variant="outline" className="w-full text-sm h-auto py-2 border-destructive/50 hover:bg-destructive/10">
                    Reset Progress
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-destructive text-sm h-auto py-2">
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
