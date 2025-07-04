import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Square } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  hasActiveSounds: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
}

export function PlaybackControls({
  isPlaying,
  hasActiveSounds,
  onTogglePlay,
  onStop,
}: PlaybackControlsProps) {
  return (
    <div className="flex justify-center gap-4">
      <div className="relative w-32 h-32 flex items-center justify-center">


        {/* Play/Pause button */}
        <Button
          onClick={onTogglePlay}
          disabled={!hasActiveSounds}
          size="icon"
          variant={"outline"}
          className={`rounded-full p-10`}
        >
          {isPlaying ? (
            <Pause size={35} className="text-primary" />
          ) : (
            <Play size={35} className="text-primary" />
          )}
        </Button>
      </div>
    </div>
  );
}
