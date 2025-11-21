import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMembers } from "@/lib/members-context";
import { Edit2 } from "lucide-react";

interface EditMemberDialogProps {
  member: {
    id: number;
    name: string;
    title: string;
    avatar: string;
  };
}

export function EditMemberDialog({ member }: EditMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(member.name);
  const [title, setTitle] = useState(member.title);
  const [avatar, setAvatar] = useState(member.avatar);
  const { toast } = useToast();
  const { updateMember } = useMembers();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a member name",
      });
      return;
    }

    setLoading(true);
    try {
      await updateMember(member.id, {
        name,
        title,
        avatar,
      });

      toast({
        title: "Member Updated! ✨",
        description: `${name}'s profile has been updated.`,
        className: "bg-primary text-primary-foreground border-none",
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          data-testid={`button-edit-member-${member.id}`}
        >
          <Edit2 className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>Update {member.name}'s profile information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="member-name">Name</Label>
            <Input
              id="member-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Member name"
              data-testid="input-member-name"
            />
          </div>
          <div>
            <Label htmlFor="member-title">Title</Label>
            <Input
              id="member-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Kitchen Champion, Laundry Legend"
              data-testid="input-member-title"
            />
          </div>
          <div>
            <Label htmlFor="member-avatar">Avatar URL</Label>
            <Input
              id="member-avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              data-testid="input-member-avatar"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            data-testid="button-save-member"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
