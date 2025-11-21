import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function InviteDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          + Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Invite to Household</DialogTitle>
          <DialogDescription>
            Bring your crew together for an epic expedition. Choose your method.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
