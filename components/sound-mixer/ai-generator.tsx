import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

interface AIGeneratorProps {
  aiPrompt: string;
  isGenerating: boolean;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => Promise<void>;
}

export function AIGenerator({ aiPrompt, isGenerating, onPromptChange, onGenerate }: AIGeneratorProps) {
  const handleGenerate = async () => {
    if (!aiPrompt.trim() || isGenerating) return;
    
    try {
      await onGenerate();
    } catch (error) {
      toast.error("Failed to generate mix", {
        description: error instanceof Error ? error.message : "Please try a different prompt"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Describe your ideal focus environment:</label>
        <Input
          placeholder="e.g., Rainy forest with birds chirping, Cozy cafe with soft piano..."
          value={aiPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </div>
      <Button onClick={handleGenerate} disabled={!aiPrompt.trim() || isGenerating} className="w-fit float-right">
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Sound Mix
          </>
        )}
      </Button>
      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Try these examples:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>"Peaceful forest with gentle rain and distant thunder"</li>
          <li>"Cozy fireplace with soft piano music"</li>
          <li>"Ocean waves with seagulls and light breeze"</li>
          <li>"Busy cafe atmosphere with background chatter"</li>
        </ul>
      </div>
    </div>
  )
} 