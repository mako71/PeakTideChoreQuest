import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddQuestDialogProps {
  onAddQuest: (quest: any) => void;
}

export function AddQuestDialog({ onAddQuest }: AddQuestDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xp, setXp] = useState("100");
  const [difficulty, setDifficulty] = useState("2");
  const [type, setType] = useState("mountain");
  const [steps, setSteps] = useState<string[]>([]);
  const [stepInput, setStepInput] = useState("");
  const { toast } = useToast();

  const handleAddStep = () => {
    if (stepInput.trim()) {
      setSteps([...steps, stepInput]);
      setStepInput("");
    }
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Quest Title Required",
        description: "Please enter a quest title",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Quest Description Required",
        description: "Please enter a quest description",
      });
      return;
    }

    const newQuest = {
      id: Math.random(),
      title,
      description,
      xp: parseInt(xp),
      difficulty: parseInt(difficulty),
      type,
      steps,
      assignee: null,
      status: "open",
    };

    onAddQuest(newQuest);

    toast({
      title: "Quest Created! 🎉",
      description: `"${title}" has been added to your household expedition.`,
      className: "bg-primary text-primary-foreground border-none",
    });

    setTitle("");
    setDescription("");
    setXp("100");
    setDifficulty("2");
    setType("mountain");
    setSteps([]);
    setStepInput("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-white font-bold gap-2">
          <Plus className="w-4 h-4" />
          Create Quest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Quest</DialogTitle>
          <DialogDescription>
            Add a new chore to your household expedition
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium">
              Quest Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Conquer the Dish Mountain"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the quest challenge..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* XP Value */}
            <div className="space-y-2">
              <Label htmlFor="xp" className="font-medium">
                XP Reward
              </Label>
              <Input
                id="xp"
                type="number"
                min="10"
                max="1000"
                step="10"
                value={xp}
                onChange={(e) => setXp(e.target.value)}
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="font-medium">
                Difficulty
              </Label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="1">Easy 🟢</option>
                <option value="2">Medium 🟡</option>
                <option value="3">Hard 🟠</option>
                <option value="4">Very Hard 🔴</option>
                <option value="5">Extreme ⚫</option>
              </select>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label className="font-medium">Quest Type</Label>
            <div className="flex gap-3">
              <button
                onClick={() => setType("mountain")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  type === "mountain"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                🏔️ Land Quest
              </button>
              <button
                onClick={() => setType("ocean")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  type === "ocean"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                🌊 Sea Quest
              </button>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <Label className="font-medium">Quest Steps (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a step..."
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddStep()}
              />
              <Button
                variant="outline"
                onClick={handleAddStep}
                className="flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {steps.length > 0 && (
              <div className="space-y-2">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border"
                  >
                    <span className="text-sm">
                      <span className="font-bold text-primary mr-2">{idx + 1}.</span>
                      {step}
                    </span>
                    <button
                      onClick={() => handleRemoveStep(idx)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-accent hover:bg-accent/90 text-white font-bold"
            >
              Create Quest ⚔️
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
