import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Mail, MessageCircle, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMembers } from "@/lib/members-context";

export function InviteDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberTitle, setMemberTitle] = useState("");
  const [memberAvatar, setMemberAvatar] = useState("");
  const [memberRole, setMemberRole] = useState<"member" | "manager">("member");
  const { toast } = useToast();
  const { addMember } = useMembers();

  const inviteLink = "https://basecamp.household/invite/xyz123abc456";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Share this link with your household members.",
        className: "bg-primary text-primary-foreground border-none",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
      });
    }
  };

  const handleEmailInvite = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
      });
      return;
    }

    const subject = "Join our Household Expedition on Basecamp!";
    const body = `I'd like to invite you to join our household on Basecamp, a fun gamified chore tracking app!

Join us here: ${inviteLink}

Let's complete quests together and compete on the leaderboard! 🏔️🌊`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    toast({
      title: "Email Invite Sent",
      description: `Invitation sent to ${email}`,
      className: "bg-primary text-primary-foreground border-none",
    });
    
    setEmail("");
    setOpen(false);
  };

  const handleSmsInvite = () => {
    if (!phone) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number",
      });
      return;
    }

    const message = `Join my household on Basecamp! 🏔️ Complete chores, earn XP, and compete on the leaderboard. ${inviteLink}`;
    const smsLink = `sms:${phone}?body=${encodeURIComponent(message)}`;
    window.location.href = smsLink;

    toast({
      title: "SMS Invite Sent",
      description: `Text invite sent to ${phone}`,
      className: "bg-secondary text-secondary-foreground border-none",
    });

    setPhone("");
    setOpen(false);
  };

  const handleAddMemberManually = () => {
    if (!memberName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a member name",
      });
      return;
    }

    addMember({
      name: memberName,
      title: memberTitle || "Adventurer",
      avatar: memberAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100",
      role: memberRole,
    });

    toast({
      title: "Member Added! 🎉",
      description: `${memberName} has joined as a ${memberRole}.`,
      className: "bg-primary text-primary-foreground border-none",
    });

    setMemberName("");
    setMemberTitle("");
    setMemberAvatar("");
    setMemberRole("member");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          + Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add to Household</DialogTitle>
          <DialogDescription>
            Bring your crew together for an epic expedition. Choose your method.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="add" className="w-full py-4">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="invite">Invite Link</TabsTrigger>
            <TabsTrigger value="add">Add Member</TabsTrigger>
          </TabsList>

          <TabsContent value="invite" className="space-y-6">
          {/* Copy Link Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share Link</Label>
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="text-sm"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={handleCopyLink}
                className="flex-shrink-0"
              >
                <Copy className={`w-4 h-4 transition-all ${copied ? "text-green-500" : ""}`} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Share this link directly with household members</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">Or Send Invite</span>
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email Invite
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailInvite()}
            />
            <Button
              onClick={handleEmailInvite}
              className="w-full bg-primary hover:bg-primary/90 font-semibold"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>

          {/* SMS Section */}
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-secondary" />
              Text Message
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSmsInvite()}
            />
            <Button
              onClick={handleSmsInvite}
              className="w-full bg-secondary hover:bg-secondary/90 font-semibold"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Text
            </Button>
          </div>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="member-name" className="text-sm font-medium">
                Member Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="member-name"
                placeholder="e.g., Casey"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMemberManually()}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="member-title" className="text-sm font-medium">
                Title (Optional)
              </Label>
              <Input
                id="member-title"
                placeholder="e.g., Peak Conqueror"
                value={memberTitle}
                onChange={(e) => setMemberTitle(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="member-avatar" className="text-sm font-medium">
                Avatar URL (Optional)
              </Label>
              <Input
                id="member-avatar"
                placeholder="https://example.com/avatar.jpg"
                value={memberAvatar}
                onChange={(e) => setMemberAvatar(e.target.value)}
              />
              {memberAvatar && (
                <div className="mt-2">
                  <img src={memberAvatar} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="member-role" className="text-sm font-medium">
                Role
              </Label>
              <select
                id="member-role"
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value as "member" | "manager")}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="member">Member (Can complete quests)</option>
                <option value="manager">Manager (Can create & edit quests)</option>
              </select>
              <p className="text-xs text-muted-foreground">Managers can add and edit quests. Members only complete them.</p>
            </div>

            <Button
              onClick={handleAddMemberManually}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold mt-4"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
